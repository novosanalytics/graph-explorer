import { useCallback } from "react";
import { useNotification } from "../components/NotificationProvider";
import type { NeighborsRequest, SubGraphRequest } from "../connector/useGEFetchTypes";
import { explorerSelector } from "../core/connector";
import useEntities from "./useEntities";
import { Vertex, Edge } from "../@types/entities";
import { useRecoilValue } from "recoil";
import { NeighborsCountRequest } from "../connector/useGEFetchTypes";


const useSubGraph = () => {
  const [, setEntities] = useEntities();
  const explorer = useRecoilValue(explorerSelector);
  const { enqueueNotification, clearNotification } = useNotification();


  return useCallback( 
    async (req: SubGraphRequest) => {
        const subGraphResult = await explorer?.createSubgraph(req);

        if (!subGraphResult || !subGraphResult.vertices.length) {
            enqueueNotification({
              title: "No Results",
              message: "Your search has returned no results",
            });
            return;
        }

        setEntities({
            nodes: subGraphResult.vertices,
            edges: subGraphResult.edges,
            selectNewEntities: "nodes",
            forceSet:true
        });

        const notificationId = enqueueNotification({
            title: "Filtering by Date",
            message: `Looking for everything filtered on ${req.date}`,
            autoHideDuration: null,
          });
          clearNotification(notificationId);

        const verticesWithUpdatedCounts = await Promise.all<Vertex>(
            subGraphResult.vertices.map(async vertex => {
                const neighborsCount = await explorer?.fetchNeighborsCount({
                    vertexId: vertex.data.id,
                    idType: vertex.data.idType,
                });

                return {
                    ...vertex,
                    data: {
                      ...vertex.data,
                      neighborsCount:
                        neighborsCount?.totalCount ?? vertex.data.neighborsCount,
                      neighborsCountByType:
                        neighborsCount?.counts ?? vertex.data.neighborsCountByType,
                    },
                  };
            })
        );

        setEntities(prev => ({
            nodes: prev.nodes.map(node => {
              const nodeWithCounts = verticesWithUpdatedCounts.find(
                v => v.data.id === node.data.id
              );
    
              if (!nodeWithCounts) {
                return node;
              }
    
              return nodeWithCounts;
            }),
            edges: subGraphResult.edges,
            forceSet:true
          }));

    }, [explorer, setEntities, enqueueNotification, clearNotification]
  );

  /*return useCallback(
    async (req: SubGraphRequest) => {
        const result = await explorer?.createSubgraph(req);
        
        if (!result) {
            enqueueNotification({
              title: "No Results",
              message: "Your search has returned no results",
            });
            return;
        }

        setEntities({
          nodes: result.vertices,
          edges: result.edges,
          selectNewEntities: "nodes",
          forceSet:true
        });

        const notificationId = enqueueNotification({
          title: "Filtering by Date",
          message: `Looking for everything filtered on ${req.date}`,
          autoHideDuration: null,
        });
        clearNotification(notificationId);

        

    },[explorer, setEntities, enqueueNotification, clearNotification]
    );*/

}; 


export default useSubGraph;