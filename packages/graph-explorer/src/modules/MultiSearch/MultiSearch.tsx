import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import type { ModuleContainerHeaderProps } from "../../components";
import { GridIcon, ModuleContainer, ModuleContainerHeader } from "../../components";
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
import { overDateAtom } from "../../core/StateProvider/overdate";
import MultiSearchContent from "./MultiSearchContent";
import { Vertex } from "../../@types/entities";

export type MultiSearchProp = Omit<
    ModuleContainerHeaderProps,
    "title" | "sidebar"
> & {
    title?: ModuleContainerHeaderProps["title"];
};


// MMulti-Search

const MultiSearch = ({title = "Multi-Search", ...headerProps }: MultiSearchProp) =>{
    const t = useTranslations();
    const nodes = useRecoilValue(nodesAtom);
    const nodesSelectedIds = useRecoilValue(nodesSelectedIdsAtom)
    const edgesSelectedIds = useRecoilValue(edgesSelectedIdsAtom)
    const nodesSelected: Vertex[] = [];
    nodes.forEach(nItem => {
        if (nodesSelectedIds.has(nItem.data.id)){
            nodesSelected.push(nItem)
        }
    })

    const leadingNode = useMemo(() => {
        return nodes.find(node => nodesSelectedIds);
      }, [nodes, nodesSelectedIds]);
    
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
                title={t("multi-search.no-selection-title")}
                subtitle={t("multi-search.no-selection-subtitle")}
            />
        )}
        {nodesSelectedIds.size >= 1 && leadingNode && (
            <MultiSearchContent
            selectedItems={nodesSelected} 
            vertex={leadingNode}
            overDate={overDate}/>
        )}
        </ModuleContainer>
    );
};

export default MultiSearch;