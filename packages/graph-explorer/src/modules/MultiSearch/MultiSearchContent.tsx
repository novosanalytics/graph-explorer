import { useCallback, useMemo, useState } from "react";
import type { Edge, Vertex } from "../../@types/entities";
import { 
    AdvancedList,
    AdvancedListItemType,
    ModuleContainerFooter, 
    MagicExpandIcon,
    DeleteIcon,
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
  const fetchMultiQuery = useFetchMultiQuery;
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

  const searchClick = useCallback(async () => {
    await fetchMultiQuery();
  }, [fetchMultiQuery]);

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
            items={collectQueries}
            draggable={true}
            defaultItemType={"graph-viewer__node"}
          />
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
            onPress={searchClick}
            >
                Search SubQueries 
          </Button>
          <Button
            icon={
                <MagicExpandIcon/>
            }
            variant={"filled"}
            onPress={()=>{
                console.log("Test")
            }}
            >
                Add Selected 
          </Button>

          </ModuleContainerFooter>
        </>
      )}
    </div>
  );
};

export default MultiSearchContent;