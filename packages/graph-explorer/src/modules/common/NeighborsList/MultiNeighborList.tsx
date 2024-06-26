import { cx } from "@emotion/css";
import { Vertex } from "../../../@types/entities";
import { Chip, Tooltip, VertexIcon, VisibleIcon } from "../../../components";
import { useWithTheme, withClassNamePrefix } from "../../../core";
import useNeighborsOptions from "../../../hooks/useNeighborsOptions";
import defaultStyles from "./NeighborsList.styles";

export type NeighborsListProps = {
  classNamePrefix?: string;
  vertex: Vertex;
  vertexList?:Vertex[];
};

const MultiNeighborsList = ({
  classNamePrefix = "ft",
  vertex,
  vertexList,
}: NeighborsListProps) => {
  const styleWithTheme = useWithTheme();
  const pfx = withClassNamePrefix(classNamePrefix);
  const neighborsOptions = useNeighborsOptions(vertex);
  let neighborTotalCounts = 0;
  vertexList?.forEach(node => {
    neighborTotalCounts += node?.data.neighborsCount
  });


  /*const neighborsInView =
  vertex.data.neighborsCountByType[op.value] -
  (vertex.data.__unfetchedNeighborCounts?.[op.value] ?? 0);*/



  /*let neighborTotalCounts = 0;
  vertexList?.forEach(node => {
    neighborTotalCounts += node.data.neighborsCount
  });*/

  return (
    <div
      className={cx(
        styleWithTheme(defaultStyles(classNamePrefix)),
        pfx("section")
      )}
    >
      <div className={pfx("title")}>
        Neighbors ({neighborTotalCounts})
      </div>
      {neighborsOptions.map(op => {
        let neighborsInView = 0;
        vertexList?.forEach(subItem =>{
        neighborsInView += subItem.data.neighborsCountByType[op.value] -
        (subItem.data.__unfetchedNeighborCounts?.[op.value] ?? 0);
        })
        return (
          <div key={op.value} className={pfx("node-item")}>
            <div className={pfx("vertex-type")}>
              <div
                style={{
                  color: op.config?.color,
                }}
              >
                <VertexIcon
                  iconUrl={op.config?.iconUrl}
                  iconImageType={op.config?.iconImageType}
                />
              </div>
              {op.label}
            </div>
            <div className={pfx("vertex-totals")}>
              <Tooltip
                text={`${neighborsInView} ${op.label} in the Graph View`}
              >
                <Chip className={pfx("chip")} startAdornment={<VisibleIcon />}>
                  {neighborsInView}
                </Chip>
              </Tooltip>
              <Chip className={pfx("chip")}>
                {vertex.data.neighborsCountByType[op.value]}
              </Chip>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MultiNeighborsList;
