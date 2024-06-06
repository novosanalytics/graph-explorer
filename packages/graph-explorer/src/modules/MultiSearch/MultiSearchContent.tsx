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
import { useExpandNode } from "../../hooks";
import { SubQuery } from "../../@types/subqueries";

export type MultiSearchContentProps = {
  classNamePrefix?: string;
  selectedQueries:SubQuery[] ;
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

  //const [isExpanding, setIsExpanding] = useState(false); // this isn't super necessary
  //const neighborsOptions = useNeighborsOptions(vertex);
  //const selectedNeighborOptions = useNeighborsOptions(selectedItems[0])
  //const [selectedType, setSelectedType] = useState<string>(
  //  neighborsOptions[0]?.value
  //);
  //const [filters, setFilters] = useState<Array<MultiSearchFilter>>([]);
  const [limit, setLimit] = useState<number | null>(null);
  
  // Try merging or something, let's make a detailed node type inspector
  let collectQueries: AdvancedListItemType<any>[] = [];
  selectedQueries.forEach(sQItem => {
    collectQueries.push({
        id: [
            sQItem.data.selectedVertexType,
            sQItem.data.attribute,
            sQItem.data.searchTerm
            ].toString(),
        title: [
            sQItem.data.selectedVertexType,
            sQItem.data.attribute,
            sQItem.data.searchTerm
            ].toString(),
    })
  })

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
        {selectedQueries.length === 0 && (
            <PanelEmptyState
            icon={<GraphIcon />}
            title={t("multi-search.no-selection-title")}
            subtitle={t("multi-search.no-connections-subtitle")}
            />
        )}
        {!!(selectedQueries.length > 0) && (
            <MultiSearchFilters
              classNamePrefix={classNamePrefix}
              limit={limit}
              onLimitChange={setLimit}
            />
          )}

          <ModuleContainerFooter>
          </ModuleContainerFooter>
        </>
      )}
    </div>
  );
};

export default MultiSearchContent;