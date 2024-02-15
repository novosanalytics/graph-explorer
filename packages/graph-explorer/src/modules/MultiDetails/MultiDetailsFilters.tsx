import { clone } from "lodash";
import { useCallback, useEffect } from "react";
import {
  AddIcon,
  DeleteIcon,
  IconButton,
  Input,
  Select,
} from "../../components";
import { useConfiguration, withClassNamePrefix } from "../../core";
import useTextTransform from "../../hooks/useTextTransform";
import useTranslations from "../../hooks/useTranslations";


export type MultiDetailsFilter = {
    name: string;
    value: string;
};

export type MultiDetailsFiltersContentProps = {
    classNamePrefix?: string;
    neighborsOptions: Array<{ label: string; value: string }>;
    selectedType: string;
    onSelectedTypeChange(type: string): void;
    filters: Array<MultiDetailsFilter>;
    onFiltersChange(filters: Array<MultiDetailsFilter>): void;
    limit: number | null;
    onLimitChange(limit: number | null): void;
}

const MultiDetailsFilter =({
    classNamePrefix = "ft",
    neighborsOptions,
    selectedType,
    onSelectedTypeChange,
    filters,
    onFiltersChange,
    limit,
    onLimitChange
}: MultiDetailsFiltersContentProps) => {

};

export default MultiDetailsFilter;