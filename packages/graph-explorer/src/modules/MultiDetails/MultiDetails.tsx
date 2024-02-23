import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import type { ModuleContainerHeaderProps } from "../../components";
import { GridIcon, ModuleContainer, ModuleContainerHeader } from "../../components";
import GraphIcon from "../../components/icons/GraphIcon";
import PanelEmptyState from "../../components/PanelEmptyState/PanelEmptyState";
import useTranslations from "../../hooks/useTranslations";
import { 
    nodesAtom,
    nodesSelectedIdsAtom, 
} from "../../core/StateProvider/nodes";
import {
    edgesAtom,
    edgesSelectedIdsAtom,
    edgesTypesFilteredAtom,
  } from "../../core/StateProvider/edges";
import { overDateAtom, overDateFlagAtom } from "../../core/StateProvider/overdate";
import MultiDetailsContent from "./MultiDetailsContent";
import { Vertex } from "../../@types/entities";

export type MultiDetailsProp = Omit<
    ModuleContainerHeaderProps,
    "title" | "sidebar"
> & {
    title?: ModuleContainerHeaderProps["title"];
};


// #Multi-Details v0.1: All common nodes shall reflect the necessary neighbors or so.
//      NO MULTI-TYPE

const MultiDetails = ({title = "Multi-Details", ...headerProps }: MultiDetailsProp) =>{
    const t = useTranslations();
    const nodes = useRecoilValue(nodesAtom);
    const nodesSelectedIds = useRecoilValue(nodesSelectedIdsAtom)
    const edgesSelectedIds = useRecoilValue(edgesSelectedIdsAtom)
    //const nodesSelected = nodes - nodesSelectedIds
    const nodesSelected: Vertex[] = [];
    nodes.forEach(nItem => {
        if (nodesSelectedIds.has(nItem.data.id)){
            nodesSelected.push(nItem)
        }
    })

    const leadingNode = useMemo(() => {
        return nodes.find(node => nodesSelectedIds);
      }, [nodes, nodesSelectedIds]);
    
    const odFlag = useRecoilValue(overDateFlagAtom);
    const overDate = useRecoilValue(overDateAtom);

    return (
        <ModuleContainer>
            <ModuleContainerHeader
            title={title}
            variant={"sidebar"}
            {...headerProps}
        />
        {nodesSelectedIds.size === 0 && edgesSelectedIds.size === 0 && (
            <PanelEmptyState
                icon={<GridIcon />}
                title={t("multi-details.no-selection-title")}
                subtitle={t("multi-details.no-selection-subtitle")}
            />
        )}
        {nodesSelectedIds.size >= 1 && leadingNode && (
            <MultiDetailsContent
            selectedItems={nodesSelected} 
            vertex={leadingNode}
            odFlag={odFlag}
            overDate={overDate}/>
        )}
        </ModuleContainer>
    );
};

export default MultiDetails;