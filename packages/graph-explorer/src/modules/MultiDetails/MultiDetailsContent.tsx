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
import { MultiDetailsFilter } from "./MultiDetailsFilters"
import defaultStyles from "./MutliDetailsContent.styles"
import { useExpandNode } from "../../hooks";

export type MultiDetailsContentProps = {
  classNamePrefix?: string;
  selectedItems: Vertex[];
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
  const expandNode = useExpandNode();
  // ^^ this will need to be removed, everything should flow based on leadingNode 
  const t = useTranslations();
  const styleWithTheme = useWithTheme();
  const pfx = withClassNamePrefix(classNamePrefix)
  const textTransform = useTextTransform();

  const [isExpanding, setIsExpanding] = useState(false);
  const neighborsOptions = useNeighborsOptions(vertex);
  const selectedNeighborOptions = useNeighborsOptions(selectedItems[0])
  //const [selectedType, setSelectedType] = useState<string>(
  //  neighborsOptions[0]?.value
  //);
  const [filters, setFilters] = useState<Array<MultiDetailsFilter>>([]);
  const [limit, setLimit] = useState<number | null>(null);
  
  const [collectTypes, setCollectTypes] = useState<Array<string>>([]);
  selectedItems.forEach(sItem => {
      collectTypes.includes(sItem.data.type) 
      ? null : collectTypes.push(sItem.data.type);
  })

  const [selectedMultiType, setSelectedMultiType] = useState<string>(
    collectTypes[0]
  );
/////////////////////////////////////////////////////////////////
/*const nodeNames = useMemo(() => {
    const collectNames: AdvancedListItemType<any>[] = [];
    selectedItems.forEach(item => {
        collectNames.push({
            id: item.data.id,
            title: item.data.id
        })
    })
    return collectNames
  }, [selectedItems, config, pfx, textTransform])
*/


  /*const [gNames, setGNames] = useState("");
  
  const nodeTypes = useMemo(() => {
    const collectTypes: Array<string> = [];
    selectedItems.forEach(sItem => {
  selectedItems.forEach(gDetail => {
    setGNames(gNames.concat(gDetail?.data.id))
    }
  );
    //collectGNames = collectGNames.concat(`"${gName.data.id}",`)
  //});
  //collectGNames = collectGNames.substring(0, collectGNames.length - 1));
 
  //console.log(gNames);
  */
  const gListNames = useMemo(() => {
    let collectGNames: string = "";
    selectedItems.forEach(gName => {
        collectGNames = collectGNames.concat(`"${gName.data.id}",`)
    });
    collectGNames = collectGNames.substring(0, collectGNames.length - 1);
    console.log(collectGNames);
    return collectGNames;
  }, [selectedItems])


  const onExpandClick = useCallback(async () => {
    setIsExpanding(true);
    await expandNode({
      multiVertexId: gListNames,
      vertexId: vertex.data.id,
      vertexType: (vertex.data.types ?? [vertex.data.type])?.join("::"),
      filterByVertexTypes: [selectedMultiType],
      filterCriteria: filters.map(filter => ({
        name: filter.name,
        operator: "LIKE",
        value: filter.value,
      })),
      // TODO - review limit and offset when data is not sorted
      limit: limit ?? vertex.data.neighborsCount,
      offset:
        limit === null
          ? 0
          : vertex.data.neighborsCount -
            (vertex.data.__unfetchedNeighborCount ?? 0),
    });
    setIsExpanding(false);
  }, [expandNode, filters, limit, selectedMultiType, vertex.data, gListNames]);

// ################################################################################### //

  const onFullClick = useCallback(async () => {
    setIsExpanding(true);
    await expandNode({
      vertexId: vertex.data.id,
      vertexType: (vertex.data.types ?? [vertex.data.type])?.join("::"),
      // TODO - review limit and offset when data is not sorted
      limit: limit ?? vertex.data.neighborsCount,
      offset:
        limit === null
          ? 0
          : vertex.data.neighborsCount -
            (vertex.data.__unfetchedNeighborCount ?? 0),
    });
    setIsExpanding(false);
  }, [expandNode, filters, limit, vertex.data]);

/////////////////////////////////////////////////////////////////
  const getDisplayNames = useDisplayNames();
  const { name } = getDisplayNames(vertex); //might want to change this later
  /*const displayLabels = useMemo(() => {
    return (vertex.data.types ?? [vertex.data.type])
      .map(type => {
      return (
        config?.getVertexTypeConfig(type)?.displayLabel || textTransform(type)
      );
      })
      .filter(Boolean)
      .join(", ");
    }, [config, textTransform, vertex.data.type, vertex.data.types]);
  */
  const vtConfig = config?.getVertexTypeConfig(vertex.data.type);


  // Try merging or something, let's make a detailed node type inspector
  let collectNames: AdvancedListItemType<any>[] = [];
  selectedItems.forEach(item => {
    collectNames.push({
        id: item.data.id,
        title: item.data.id
    })
  })



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
            {collectTypes.length != 1 ? "Multiple Types" : collectTypes[0]} 
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
          <AdvancedList
            classNamePrefix={classNamePrefix}
            className={pfx("selected-items-advanced-list")}
            items={collectNames}
            draggable={true}
            defaultItemType={"graph-viewer__node"}
          />
          <MultiNeighborsList 
            vertex={selectedItems[0]}
            vertexList={selectedItems}
            classNamePrefix={classNamePrefix}
          />
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
              neighborsOptions={selectedNeighborOptions}
              selectedType={selectedMultiType}
              onSelectedTypeChange={setSelectedMultiType}
              filters={filters}
              onFiltersChange={setFilters}
              limit={limit}
              onLimitChange={setLimit}
            />
          )}
          <ModuleContainerFooter>
          <Button
              icon={
                isExpanding ? (
                  <LoadingSpinner style={{ width: 24, height: 24 }} />
                ) : (
                  <MagicExpandIcon />
                )
              }
              variant={"filled"}
              isDisabled={
                isExpanding ||
                !vertex.data.__unfetchedNeighborCount ||
                !selectedMultiType
              }
              onPress={onExpandClick}
            >
              Exact Expand
            </Button>
            <Button
              icon={
                isExpanding ? (
                  <LoadingSpinner style={{ width: 24, height: 24 }} />
                ) : (
                  <ExpandGraphIcon />
                )
              }
              variant={"filled"}
              isDisabled={
                isExpanding ||
                !vertex.data.__unfetchedNeighborCount ||
                !selectedMultiType
              }
              onPress={onFullClick}
            >
              Full Expand
            </Button>
          </ModuleContainerFooter>
        </>
      )}
    </div>
  );
};

export default MultiDetailsContent;