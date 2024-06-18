import { useCallback, useMemo, useState } from "react";
import type { Edge, Vertex } from "../../@types/entities";
import { 
    AdvancedList,
    AdvancedListItemType,
    ModuleContainerFooter, 
    MagicExpandIcon,
    DeleteIcon,
    VertexIcon,
    GraphIcon,
 } from "../../components";
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
import MultiSearchFilters, { MultiSearchFilter } from "./MultiSearchFilters"
import defaultStyles from "./MutliSearchContent.styles"
import { useExpandNode, useFetchNode,useFetchMultiQuery } from "../../hooks";
import useKeywordSearch from "../KeywordSearch/useKeywordSearch"
import { SubQuery } from "../../@types/subqueries";
import toAdvancedList from "../KeywordSearch/toAdvancedList";
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
  //const fetchNode = useFetchNode();
  const fetchMultiQuery = useFetchMultiQuery();
  const [isExpanding, setIsExpanding] = useState(false);
  const [limit, setLimit] = useState<number | null>(null);
  const [clusive, setClusive] = useState<string | null>(null);

  const multiKeywordTotal = (subQueries:Set<SubQuery>) => {
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
    let results = await fetchMultiQuery(multiSearch);
    // add something here to send the results in the carousel
    setIsExpanding(false);
  }, [fetchMultiQuery, multiSearch]);


  const resultItems = useMemo(() => {
    return toAdvancedList(results)
  })

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


          <div className={pfx("multi-search-grid")}>
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
                console.log("Test")
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