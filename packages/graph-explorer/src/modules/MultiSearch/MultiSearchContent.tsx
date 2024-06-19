import { useCallback, useMemo, useState } from "react";
import { css, cx } from "@emotion/css";
import type { Edge, Vertex } from "../../@types/entities";
import { 
    AdvancedList,
    AdvancedListItemType,
    ModuleContainerFooter, 
    MagicExpandIcon,
    DeleteIcon,
    VertexIcon,
    GraphIcon,
    IconButton,
    Carousel,
 } from "../../components";
 import RemoveFromCanvasIcon from "../../components/icons/RemoveFromCanvasIcon";
//import { useRecoilValue } from "recoil";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useConfiguration, useWithTheme, withClassNamePrefix } from "../../core";
//import { Panel,EmptyState} from "../../components/PanelEmptyState/PanelEmptyState";
import ExpandGraphIcon from "../../components/icons/ExpandGraphIcon";
import useTranslations from "../../hooks/useTranslations";
import fade from "../../core/ThemeProvider/utils/fade";
import useTextTransform from "../../hooks/useTextTransform";
import useNeighborsOptions from "../../hooks/useNeighborsOptions";
import useDisplayNames from "../../hooks/useDisplayNames";
import MultiNeighborsList from "../common/NeighborsList/MultiNeighborList";
import MultiSearchFilters from "./MultiSearchFilters"
import defaultStyles from "./MutliSearchContent.styles"
import { useEntities, useFetchNode, useFetchMultiQuery } from "../../hooks";
import NodeDetail from "../EntityDetails/NodeDetail";
import { SubQuery } from "../../@types/subqueries";
import toAdvancedList from "../KeywordSearch/toAdvancedList";
import { multiQueriesResultAtom } from "../../core/StateProvider/subquery";
import { KeywordSearchResponse } from "../../connector/useGEFetchTypes";
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
  //const fetchNode = useFetchNode();
  const fetchMultiQuery = useFetchMultiQuery();
  const [isExpanding, setIsExpanding] = useState(false);
  const [limit, setLimit] = useState<number | null>(null);
  const [clusive, setClusive] = useState<string | null>(null);
  //const multiResult = useRecoilValue(multiQueriesResultAtom);

  let multisearchresults: KeywordSearchResponse = {
    vertices: [],
  }

/*  const multiKeywordTotal = (subQueries:Set<SubQuery>) => {
    let setResult = Array.from(subQueries).map((subQuery) => ({
      searchTerm: subQuery.searchTerm,
      searchById: false,
      searchByAttributes: subQuery.attribute,
      vertexTypes: subQuery.selectedVertexType,
      exactMatch: subQuery.exactMatch,
      offset: 0,
      limit: 10,
    }));
    return setResult;
  };
*/
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
    // add something here to send the results in the carousel
    if (finalResult != undefined){
        multisearchresults = finalResult
    }
    console.log(multisearchresults)
    setIsExpanding(false);
  }, [fetchMultiQuery, multiSearch]);

  const resultItems = useMemo(() => {
    return toAdvancedList(multisearchresults.vertices, {
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
                const numNeighborsLimit = neighborsLimit ? 500 : 0;
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
    searchResults,
    config,
    getDisplayNames,
    textTransform,
    entities.nodes,
    pfx,
    setEntities,
    fetchNode,
    neighborsLimit,
  ])  

  /*const transformQueries = useMemo(() => {
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
  },[selectedQueries])*/

  
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
            {!(multisearchresults.vertices.length = 0) && (
              <div className={pfx("search-results-grid")}>
                <AdvancedList
                  classNamePrefix={classNamePrefix}
                  className={pfx("search-results-advanced-list")}
                  items={resultItems}
                  draggable={true}
                  defaultItemType={"graph-viewer__node"}
                  onItemClick={(event, item) => {
                    selection.toggle(item.id);
                  }}
                  selectedItemsIds={Array.from(selection.state)}
                  hideFooter
                />
                {selection.state.size > 0 && (
                  <Carousel
                    ref={carouselRef}
                    slidesToShow={1}
                    className={pfx("carousel")}
                    pagination={{
                      el: `.swiper-pagination`,
                    }}
                  >
                    {Array.from(selection.state).map(nodeId => {
                      const node = searchResults.find(
                        n => n.data.id === nodeId
                      );

                      return node !== undefined ? (
                        <NodeDetail
                          key={nodeId}
                          node={node}
                          hideNeighbors={true}
                        />
                      ) : null;
                    })}
                  </Carousel>
                )}
                {selection.state.size === 0 && (
                  <PanelEmptyState
                    className={pfx("node-preview")}
                    title="Select an item to preview"
                    icon={<GraphIcon />}
                  />
                )}
              </div>
            )}          
        {!!(selectedQueries.size > 0) && (
            <MultiSearchFilters
              classNamePrefix={classNamePrefix}
              limit={limit}
              onLimitChange={setLimit}
              clusive={clusive}
              onClusiveChange={setClusive}
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
                console.log(multisearchresults)
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