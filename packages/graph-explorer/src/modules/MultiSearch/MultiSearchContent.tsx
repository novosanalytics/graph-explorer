import { useCallback, useMemo, useState, useRef } from "react";
import { css, cx } from "@emotion/css";
import type { Edge, Vertex } from "../../@types/entities";
import { 
    AddCircleIcon,
    AdvancedList,
    AdvancedListItemType,
    ModuleContainerFooter, 
    MagicExpandIcon,
    DeleteIcon,
    VertexIcon,
    GraphIcon,
    IconButton,
    Carousel,
    PanelEmptyState,
 } from "../../components";
 import RemoveFromCanvasIcon from "../../components/icons/RemoveFromCanvasIcon";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useConfiguration, useWithTheme, withClassNamePrefix } from "../../core";
import ExpandGraphIcon from "../../components/icons/ExpandGraphIcon";
import useTranslations from "../../hooks/useTranslations";
import { CarouselRef } from "../../components/Carousel/Carousel";
import fade from "../../core/ThemeProvider/utils/fade";
import useTextTransform from "../../hooks/useTextTransform";
import useNeighborsOptions from "../../hooks/useNeighborsOptions";
import useDisplayNames from "../../hooks/useDisplayNames";
import MultiNeighborsList from "../common/NeighborsList/MultiNeighborList";
import MultiSearchFilters from "./MultiSearchFilters"
import defaultStyles from "./MutliSearchContent.styles"
import { useEntities, useFetchNode, useFetchMultiQuery, useSet } from "../../hooks";
import NodeDetail from "../EntityDetails/NodeDetail";
import { SubQuery } from "../../@types/subqueries";
import toAdvancedList from "../KeywordSearch/toAdvancedList";
import { multiQueriesResultAtom } from "../../core/StateProvider/subquery";
import { KeywordSearchResponse } from "../../connector/useGEFetchTypes";
import { useRecoilValueLoadable, useRecoilValue, useSetRecoilState, useRecoilState  } from "recoil";
import { subQueriesAtom } from "../../core/StateProvider/subquery"
//import keywordSearch from "../../connector/gremlin/queries/keywordSearch";
//import { queryTriggerAtom } from "../../core/StateProvider/subquery";


export type MultiSearchContentProps = {
  classNamePrefix?: string;
  selectedQueries: Set<SubQuery> ;
};

const MultiSearchContent = ({
  classNamePrefix = "ft",
  selectedQueries,
}: MultiSearchContentProps) => {
  const config = useConfiguration();
  const t = useTranslations();
  const styleWithTheme = useWithTheme();
  const pfx = withClassNamePrefix(classNamePrefix)
  const textTransform = useTextTransform();
  const getDisplayNames = useDisplayNames();
  const [entities, setEntities] = useEntities();
  const fetchNode = useFetchNode();
  const fetchMultiQuery = useFetchMultiQuery();
  const [isExpanding, setIsExpanding] = useState(false);
  const [limit, setLimit] = useState<number | null>(null);
  const [clusive, setClusive] = useState<boolean>(false);
  const [isFocused, setInputFocused] = useState(false);
  const selection = useSet<string>(new Set());
  const carouselRef = useRef<CarouselRef>(null);
  const [resultAtom, setResultAtom] = useRecoilState(multiQueriesResultAtom);
  const [subQuery, setSubQuery] = useRecoilValue(subQueriesAtom);


  let collectQueries: AdvancedListItemType<any>[] = [];
  selectedQueries.forEach(sQItem => {
    return collectQueries.push({
          id: `
            Attribute:  ${textTransform(sQItem.attribute)},
            Search Term:  ${sQItem.searchTerm},
            Precision:  ${sQItem.exactMatch ? "Exact" : "Partial"}
        `,
          title: `
        Attribute:  ${textTransform(sQItem.attribute)},
        Search Term:  ${sQItem.searchTerm},
        Precision:  ${sQItem.exactMatch ? "Exact" : "Partial"}
        `,
      });
  });

  let altResultItems: AdvancedListItemType<any>[] = Array.from(resultAtom.vertices).map((queryResult) => ({
    id: queryResult.data.id,
    title: queryResult.data.id,
  }));

  let multiSearch = Array.from(selectedQueries).map((subQuery) => ({
    searchTerm: subQuery.searchTerm,
    searchById: false,
    searchByAttributes: subQuery.attribute,
    vertexTypes: subQuery.selectedVertexType,
    exactMatch: subQuery.exactMatch,
    offset: 0,
    limit: 10,}));

  const onSearchClick = useCallback(async () => {
    setIsExpanding(true);
    let finalResult = await fetchMultiQuery(multiSearch);
    setResultAtom(finalResult);
    setIsExpanding(false);
  }, [fetchMultiQuery, multiSearch, setResultAtom]);

  const onDeleteSearch = useCallback(async () => {
    let smallerSubQuery = new Set(Array.from(selectedQueries).slice(0, -1));
    setSubQuery(smallerSubQuery);
  }, [subQueriesAtom])



/////////////////////////////////////////////////////////////////////////

const isTheNodeAdded = (nodeId: string): boolean => {
    const possibleNode = entities.nodes.find(
      addedNode => addedNode.data.id === nodeId
    );
    return possibleNode !== undefined;
  };


  const getNodeIdsToAdd = () => {
    const selectedNodeIds = Array.from(selection.state);
    return selectedNodeIds.filter(nodeId => !isTheNodeAdded(nodeId));
  };


  const handleAddEntities = () => {
    const nodeIdsToAdd = getNodeIdsToAdd();
    const nodes = nodeIdsToAdd
      .map(getNodeSearchedById)
      .filter(Boolean) as Vertex[];
    const numNeighborsLimit = 500;
    fetchNode(nodes, numNeighborsLimit);
  };

  const getNodeSearchedById = (nodeId: string): Vertex | undefined => {
    return resultAtom.vertices.find(result => result.data.id === nodeId);
  };
//////////////////////////////////////////////////////////////////////////////////////////

  const resultItems = useMemo(() => {
    return toAdvancedList(resultAtom.vertices, {
      getGroupLabel: vertex => {
        const vtConfig = config?.getVertexTypeConfig(vertex.data.type);
        return vtConfig?.displayLabel || textTransform(vertex.data.type);
      },
      getItem: vertex => {
        const vtConfig = config?.getVertexTypeConfig(vertex.data.type);
        const { name, longName } = getDisplayNames(vertex);
        return {
          className: css`
            .ft-start-adornment {
              background-color: ${fade(vtConfig?.color, 0.2)} !important;
              color: ${vtConfig?.color} !important;
            }
          `,
          group: vertex.data.type,
          id: vertex.data.id,
          title: name,
          subtitle: longName,
          icon: (
            <VertexIcon
              iconUrl={vtConfig?.iconUrl}
              iconImageType={vtConfig?.iconImageType}
            />
          ),
          endAdornment: entities.nodes.find(
            n => n.data.id === vertex.data.id
          ) ? (
            <IconButton 
              tooltipText={"Remove from canvas"}
              icon={
                <RemoveFromCanvasIcon className={pfx("graph-remove-icon")} />
              }
              size={"small"}
              variant={"text"}
              onPress={() => {
                setEntities(prev => {
                  return {
                    ...prev,
                    nodes: prev.nodes.filter(n => n.data.id !== vertex.data.id),
                    forceSet: true,
                  };
                });
              }}
            />
          ) : (
            <IconButton
              tooltipText={"Add to canvas"}
              icon={<AddCircleIcon />}
              size={"small"}
              variant={"text"}
              onPress={() => {
                const numNeighborsLimit = 500;
                fetchNode(vertex, numNeighborsLimit);
                setInputFocused(false);
              }}
            />
          ),
          properties: vertex,
        };
      },
    });
  }, [
    resultAtom,
    config,
    getDisplayNames,
    textTransform,
    entities.nodes,
    pfx,
    setEntities,
    fetchNode,
  ])

/*
  const transformQueries = useMemo(() => {
    let multiSearch = Array.from(selectedQueries).map((subQuery) => ({
              searchTerm: subQuery.searchTerm,
              searchById: false,
              searchByAttributes: subQuery.attribute,
              vertexTypes: subQuery.selectedVertexType,
              exactMatch: subQuery.exactMatch,
              offset: 0,
              limit: 10,
    }));
    return multiSearch;
  },[selectedQueries])
*/
  
  return(
    <div className={styleWithTheme(defaultStyles(classNamePrefix))}>
      <div className={pfx("header")}>
        <div className={pfx("content")}>
          <div className={pfx("title")}>
            Multi-Search 
          </div>
          <div></div>
        </div>
      </div>

      {(
        <>
          <AdvancedList
            classNamePrefix={classNamePrefix}
            className={pfx("selected-items-advanced-list")}
            items={collectQueries}
            draggable={true}
            defaultItemType={"graph-viewer__node"}
          />
          <AdvancedList
            classNamePrefix={classNamePrefix}
            className={pfx("selected-items-advanced-list")}
            items={resultItems}
            draggable={true}
            defaultItemType={"graph-viewer__node"}
            />
        {!!(selectedQueries.size > 0) && (
            <MultiSearchFilters
              classNamePrefix={classNamePrefix}
              clusive={clusive}
              onClusiveChange={setClusive}
              limit={limit}
              onLimitChange={setLimit}
            />
          )}
          <ModuleContainerFooter>
          <Button
            icon={
                <DeleteIcon/>
            }
            variant={"filled"}
            onPress={()=>{
                console.log("Test")
                //onDeleteSearch
            }}
            >
                Delete Subquery 
          </Button>
          <Button
            icon={
                <MagicExpandIcon/>
            }
            variant={"filled"}
            onPress={onSearchClick}
            >
                Search SubQueries 
          </Button>
          <Button
            icon={
                <GraphIcon/>
            }
            variant={"filled"}
            onPress={()=>{
                console.log(resultAtom)
                //handleAddEntities
            }}
            >
                Display Results 
          </Button>

          </ModuleContainerFooter>
        </>
      )}
    </div>
  );
};

export default MultiSearchContent;