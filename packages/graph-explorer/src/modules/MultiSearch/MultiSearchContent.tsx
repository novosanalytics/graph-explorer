import { useCallback, useMemo, useState } from "react";
import type { Edge, Vertex } from "../../@types/entities";
import { 
    AdvancedList,
    AdvancedListItemType,
    ModuleContainerFooter, 
    MagicExpandIcon,
    VertexIcon } from "../../components";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useConfiguration, useWithTheme, withClassNamePrefix } from "../../core";
import PanelEmptyState from "../../components/PanelEmptyState/PanelEmptyState";
import ExpandGraphIcon from "../../components/icons/ExpandGraphIcon";
import GraphIcon from "../../components/icons/GraphIcon";
import useTranslations from "../../hooks/useTranslations";
import fade from "../../core/ThemeProvider/utils/fade";
import useTextTransform from "../../hooks/useTextTransform";
import useNeighborsOptions from "../../hooks/useNeighborsOptions";
import useDisplayNames from "../../hooks/useDisplayNames";
import MultiNeighborsList from "../common/NeighborsList/MultiNeighborList";
import MultiSearchFilters, { MultiSearchFilter } from "./MultiSearchFilters"
import defaultStyles from "./MutliSearchContent.styles"
import { useExpandNode, useFetchNode } from "../../hooks";
import useKeywordSearch from "./useKeywordSearch";
import { SubQuery } from "../../@types/subqueries";

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
  const fetchNode = useFetchNode()
  const [limit, setLimit] = useState<number | null>(null);

  const onSearchQueries = useCallback(async () => {

    //await 

  }, []);
  let collectQueries: AdvancedListItemType<any>[] = [];
  console.log(selectedQueries)
  selectedQueries.forEach(sQItem => {
    collectQueries.push({
        id: `
            Selected Vertex: ${sQItem.selectedVertexType.replace("/__/gi", "")},
            Attribute:  ${sQItem.attribute.replace("/__/gi", "")},
            Attribute:  ${sQItem.searchTerm.replace("/__/gi", "")}, 
        `,
        title: `
        Selected Vertex: ${sQItem.selectedVertexType.replace("/__/gi", "")},
        Attribute:  ${sQItem.attribute.replace("/__/gi", "")},
        Attribute:  ${sQItem.searchTerm.replace("/__/gi", "")}, 
        `,
    });
  });

/**
 *  CHANGE TO MULTI-SEARCH ICON
 * 
 *      {vtConfig?.iconUrl && (
          <div
            className={pfx("icon")}
            style={{
              background: fade(vtConfig?.color, 0.2),
              color: vtConfig?.color,
            }}
        >
          <VertexIcon
            iconUrl={vtConfig?.iconUrl}
            iconImageType={vtConfig?.iconImageType}
            />
          </div>
        )}
 * 
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

        {!!(selectedQueries.size > 0) && (
            <MultiSearchFilters
              classNamePrefix={classNamePrefix}
              limit={limit}
              onLimitChange={setLimit}
            />
          )}
          <Button
            icon={
                <MagicExpandIcon/>
            }
            variant={"filled"}
            onPress={()=>{
                console.log("Test")
            }}
            >
                Search SubQueries 
          </Button>

          <ModuleContainerFooter>
          </ModuleContainerFooter>
        </>
      )}
    </div>
  );
};

export default MultiSearchContent;