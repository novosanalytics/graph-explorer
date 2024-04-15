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
import Switch from "../../components/Switch";

export type NodeExpandFilter = {
  name: string;
  value: string;
  compare: string;
};
export type NodeExpandFiltersProps = {
    classNamePrefix?: string;
    neighborsOptions: Array<{ label: string; value: string }>;
    selectedType: string;
    onSelectedTypeChange(type: string): void;
    searchType: boolean;
    onSearchChange(type: boolean): void;
    filters: Array<NodeExpandFilter>;
    onFiltersChange(filters: Array<NodeExpandFilter>): void;
    limit: number | null;
    onLimitChange(limit: number | null): void;
};

const NodeExpandFilters = ({
  classNamePrefix = "ft",
  neighborsOptions,
  selectedType,
  onSelectedTypeChange,
  searchType,
  onSearchChange,
  filters,
  onFiltersChange,
  limit,
  onLimitChange,
}: NodeExpandFiltersProps) => {
  const config = useConfiguration();
  const t = useTranslations();
  const textTransform = useTextTransform();
  const pfx = withClassNamePrefix(classNamePrefix);

  const vtConfig = config?.getVertexTypeConfig(selectedType);
  const searchableAttributes = config?.getVertexTypeSearchableAttributes(
    selectedType
  );

  const comparatives = [
    "==","like",
    ">",">=",
    "<=","<",
    "!="
  ]

  const onFilterAdd = useCallback(() => {
    onFiltersChange([
      ...filters,
      {
        name: vtConfig?.attributes?.[0].name || "",
        value: "",
        compare: "=="
      },
    ]);
  }, [filters, onFiltersChange, vtConfig?.attributes]);

  const onFilterDelete = useCallback(
    (filterIndex: number) => {
      const updatedFilters = filters.filter((_, i) => i !== filterIndex);
      onFiltersChange(updatedFilters);
    },
    [filters, onFiltersChange]
  );

  const onFilterChange = useCallback(
    (filterIndex: number, name?: string, value?: string, compare?: string) => {
      const currFilters = clone(filters);
      currFilters[filterIndex].name = name || currFilters[filterIndex].name;
      currFilters[filterIndex].value = value ?? currFilters[filterIndex].value;
      currFilters[filterIndex].compare = compare ?? currFilters[filterIndex].compare;
      onFiltersChange(currFilters);
    },
    [filters, onFiltersChange]
  );

  //const onSwitchChange = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    onFiltersChange([]);
  }, [onFiltersChange, selectedType]);

  return (
    <div className={pfx("filters-section")}>
      <div className={pfx("title")}>{t("node-expand.neighbors-of-type")}</div>
      <Switch
        className={pfx("item-switch")}
        labelPosition={"right"}
        isSelected={true || false}
        onValueChange={() => onSearchChange(!searchType)}
        //onChange={(v: number | null) => onLimitChange(v ?? 0)} 
        >
        {searchType ? "Exact Term Search" : "Partial Term Search"}
      </Switch>
      <Select
        aria-label={"neighbor type"}
        value={selectedType}
        onChange={v => {
          onSelectedTypeChange(v as string);
        }}
        options={neighborsOptions}
      />
      {!!vtConfig?.attributes?.length && (
        <div className={pfx("title")}>
          <div>Filter to narrow results</div>
          <IconButton
            icon={<AddIcon />}
            variant={"text"}
            size={"small"}
            onPress={onFilterAdd}
          />
        </div>
      )}
      {!!searchableAttributes?.length && (
        <div className={pfx("filters")}>
          {filters.map((filter, filterIndex) => (
            <div key={filterIndex} className={pfx("single-filter")}>
              <Select
                aria-label={"Attribute"}
                value={filter.name}
                onChange={value => {
                  onFilterChange(filterIndex, value as string, filter.value);
                }}
                options={searchableAttributes?.map(attr => ({
                  label: attr.displayLabel || textTransform(attr.name),
                  value: attr.name,
                }))}
                hideError={true}
                noMargin={true}
              />
              <Select
                aria-label={"Comparison"}
                value={filter.compare}
                onChange={value => {
                    onFilterChange(filterIndex, filter.name, filter.value, value as string);
                }}
                options={comparatives?.map(comopt => ({
                    label: comopt,
                    value: comopt,
                }))}
                hideError={true}
                noMargin={true}
                />
              <Input
                aria-label={"Filter"}
                className={pfx("input")}
                value={filter.value}
                onChange={value => {
                  onFilterChange(filterIndex, filter.name, value as string, filter.compare);
                }}
                hideError={true}
                noMargin={true}
              />
              <IconButton
                icon={<DeleteIcon />}
                variant={"text"}
                color={"error"}
                size={"small"}
                tooltipText={"Remove Filter"}
                onPress={() => onFilterDelete(filterIndex)}
              />
            </div>
          ))}
        </div>
      )}
      <div className={pfx("title")}>
        <div>Limit returned neighbors to</div>
        <IconButton
          icon={<AddIcon />}
          variant={"text"}
          size={"small"}
          onPress={() => onLimitChange(1)}
        />
      </div>
      {limit !== null && (
        <div className={pfx("limit")}>
          <Input
            aria-label={"limit"}
            className={pfx("input")}
            type={"number"}
            min={1}
            step={1}
            value={limit}
            onChange={(v: number | null) => onLimitChange(v ?? 0)}
            hideError={true}
            noMargin={true}
          />
          <IconButton
            icon={<DeleteIcon />}
            variant={"text"}
            color={"error"}
            size={"small"}
            tooltipText={"Remove Limit"}
            onPress={() => onLimitChange(null)}
          />
        </div>
      )}
    </div>
  );
};

export default NodeExpandFilters;
