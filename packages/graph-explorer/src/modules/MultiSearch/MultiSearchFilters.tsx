import { clone } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import {
  AddIcon,
  DeleteIcon,
  IconButton,
  Input,
} from "../../components";
import { CarouselRef } from "../../components/Carousel/Carousel";
import { useConfiguration, withClassNamePrefix } from "../../core";
import useTextTransform from "../../hooks/useTextTransform";
import useTranslations from "../../hooks/useTranslations";
import Switch from "../../components/Switch";
import { useSet } from "../../hooks";


export type MultiSearchFilter = {
  name: string;
  value: string;
  clusive: boolean;
};

export type MultiSearchFiltersContentProps = {
  classNamePrefix?: string;
  limit: number | null;
  onLimitChange(limit: number | null): void;
  clusive: boolean;
  onClusiveChange(clusive: boolean): void;
}

const MultiSearchFilter =({
  classNamePrefix = "ft",
  limit,
  onLimitChange,
  clusive,
  onClusiveChange,
}: MultiSearchFiltersContentProps) => {
  const config = useConfiguration();
  const t = useTranslations();
  const textTransform = useTextTransform();
  const pfx = withClassNamePrefix(classNamePrefix);
  const selection = useSet<string>(new Set());

  const carouselRef = useRef<CarouselRef>(null);
  useEffect(() => {
    carouselRef.current?.slideTo(selection.state.size - 1);
  }, [selection.state.size]);


  return (
    <div className={pfx("filters-section")}>
        <div className={pfx("title")}>
            <div>AND/OR Clusive</div>
        </div>
        <div className={pfx("clusive")}>
          <Switch
            className={pfx("item-switch")}
            labelPosition={"right"}
            isSelected={clusive === true || false }
            onChange={() => onClusiveChange(!clusive)}
            >
            {clusive ? "OR MultiSearch" : "AND MultiSearch"}
            </Switch>
        </div>
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

export default MultiSearchFilter;