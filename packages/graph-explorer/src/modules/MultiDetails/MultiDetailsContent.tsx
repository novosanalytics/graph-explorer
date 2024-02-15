import { useCallback, useMemo, useState } from "react";
import type { Edge, Vertex } from "../../@types/entities";
import { ModuleContainerFooter, VertexIcon } from "../../components";
import Button from "../../components/Button";
import { useConfiguration, useWithTheme, withClassNamePrefix } from "../../core";
import PanelEmptyState from "../../components/PanelEmptyState/PanelEmptyState";
import ExpandGraphIcon from "../../components/icons/ExpandGraphIcon";
import GraphIcon from "../../components/icons/GraphIcon";
import useTranslations from "../../hooks/useTranslations";
import fade from "../../core/ThemeProvider/utils/fade";
import useTextTransform from "../../hooks/useTextTransform";
import useNeighborsOptions from "../../hooks/useNeighborsOptions";
import useDisplayNames from "../../hooks/useDisplayNames";
import NeighborsList from "../common/NeighborsList/NeighborsList";
import MultiDetailsFilters, { MultiDetailsFilter } from "./MultiDetailsFilters"
import defaultStyles from "./MutliDetailsContent.styles"


export type MultiDetailsContentProps = {
  classNamePrefix?: string;
  selectedItems: Set<String>;
  vertex:Vertex;
  odFlag: boolean;
  overDate: string;
};

const MultiDetailsContent = ({
  classNamePrefix = "ft",
  selectedItems,
  vertex,
  odFlag,
  overDate
}: MultiDetailsContentProps) => {
  const config = useConfiguration();
  // ^^ this will need to be removed, everything should flow based on leadingNode 
  const t = useTranslations();
  const styleWithTheme = useWithTheme();
  const pfx = withClassNamePrefix(classNamePrefix)
  const textTransform = useTextTransform();

  const [isExpanding, setIsExpanding] = useState(false);
  const neighborsOptions = useNeighborsOptions(vertex);
  const [selectedType, setSelectedType] = useState<string>(
    neighborsOptions[0]?.value
  );
  const [filters, setFilters] = useState<Array<MultiDetailsFilter>>([]);
  const [limit, setLimit] = useState<number | null>(null);
  
  /**
   * PLACE EXPAND FUNCTION HERE
   * 
   */



  const getDisplayNames = useDisplayNames();
  const { name } = getDisplayNames(vertex); //might want to change this later
  const displayLabels = useMemo(() => {
    return (vertex.data.types ?? [vertex.data.type])
      .map(type => {
      return (
        config?.getVertexTypeConfig(type)?.displayLabel || textTransform(type)
      );
      })
      .filter(Boolean)
      .join(", ");
    }, [config, textTransform, vertex.data.type, vertex.data.types]);
  const vtConfig = config?.getVertexTypeConfig(vertex.data.type);

  return(
    <div className={styleWithTheme(defaultStyles(classNamePrefix))}>
      <div className={pfx("header")}>
        {vtConfig?.iconUrl && (
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
        <div className={pfx("content")}>
          <div className={pfx("title")}>
            {displayLabels || vertex.data.type}
          </div>
          <div></div>
        </div>
      </div>
      {vertex.data.neighborsCount === 0 && (
        <PanelEmptyState
          icon={<GraphIcon />}
          title={t("multi-details.no-selection-title")}
          subtitle={t("multi-details.no-connections-subtitle")}
        />
      )}
      {vertex.data.neighborsCount !== 0 && (
        <>
          <NeighborsList vertex={vertex} classNamePrefix={classNamePrefix} />
          {!vertex.data.__unfetchedNeighborCount && (
            <PanelEmptyState
            className={pfx("empty-panel-state")}
            icon={<GraphIcon />}
            title={t("node-expand.no-unfetched-title")}
            subtitle={t("node-expand.no-unfetched-subtitle")}
            />
          )}
          {!!vertex.data.__unfetchedNeighborCount && (
            <MultiDetailsFilters
              classNamePrefix={classNamePrefix}
              neighborsOptions={neighborsOptions}
              selectedType={selectedType}
              onSelectedTypeChange={setSelectedType}
              filters={filters}
              onFiltersChange={setFilters}
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

export default MultiDetailsContent;