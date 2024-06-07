import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import type { ModuleContainerHeaderProps } from "../../components";
import { GridIcon, ModuleContainer, ModuleContainerHeader } from "../../components";
import PanelEmptyState from "../../components/PanelEmptyState/PanelEmptyState";
import useTranslations from "../../hooks/useTranslations";
import { 
    subQueriesAtom, 
    //subQuerySelector 
    } from "../../core/StateProvider/subquery"
import MultiSearchContent from "./MultiSearchContent";
import { SubQuery } from "../../@types/subqueries";

export type MultiSearchProp = Omit<
    ModuleContainerHeaderProps,
    "title" | "sidebar"
> & {
    title?: ModuleContainerHeaderProps["title"];
};


const MultiSearch = ({title = "Multi-Search", ...headerProps }: MultiSearchProp) =>{
    const t = useTranslations();
    const subQuery = useRecoilValue(subQueriesAtom);
    const subQueriesSelected: SubQuery[] = [];
    subQuery.forEach(sqItem => {
        subQueriesSelected.push(sqItem)
    })

    //const nodes = useRecoilValue(nodesAtom);
    //const nodesSelectedIds = useRecoilValue(nodesSelectedIdsAtom)
    //const nodesSelected: Vertex[] = [];
    /*nodes.forEach(nItem => {
        if (nodesSelectedIds.has(nItem.data.id)){
            nodesSelected.push(nItem)
        }
    })

    const leadingNode = useMemo(() => {
        return nodes.find(node => nodesSelectedIds);
      }, [nodes, nodesSelectedIds]);
    
    const overDate = useRecoilValue(overDateAtom);
    */ 
    return (
        <ModuleContainer>
            <ModuleContainerHeader
            title={title}
            variant={"sidebar"}
            {...headerProps}
        />
        {subQuery.size === 0 && (
            <PanelEmptyState
                icon={<GridIcon />}
                title={t("multi-search.no-selection-title")}
                subtitle={t("multi-search.no-selection-subtitle")}
            />
        )}
        {subQuery.size >= 1 && (
            <MultiSearchContent
            selectedQueries={subQueriesSelected}
            />
        )}
        </ModuleContainer>
    );
};

export default MultiSearch;