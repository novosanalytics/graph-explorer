import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import type { ModuleContainerHeaderProps } from "../../components";
import { GridIcon, ModuleContainer, ModuleContainerHeader } from "../../components";
import PanelEmptyState from "../../components/PanelEmptyState/PanelEmptyState";
import useTranslations from "../../hooks/useTranslations";
import { 
    subQueriesAtom, 
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
            selectedQueries={subQuery}
            />
        )}
        </ModuleContainer>
    );
};

export default MultiSearch;