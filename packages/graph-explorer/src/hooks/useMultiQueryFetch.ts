import { useCallback } from "react";
import { useNotification } from "../components/NotificationProvider";
import type { MultiKeywordSearchRequest, NeighborsCountRequest } from "../connector/useGEFetchTypes";
import { explorerSelector } from "../core/connector";
import useEntities from "./useEntities";
import { Vertex } from "../@types/entities";
import { useRecoilValue } from "recoil";


const useMultiQueryFetch = () => {
  const [, setEntities] = useEntities();
  const explorer = useRecoilValue(explorerSelector);
  const { enqueueNotification, clearNotification } = useNotification();

  const fetchNeighborsCount = useCallback(
    (req: NeighborsCountRequest) => {
      return explorer?.fetchNeighborsCount(req);
    },
    [explorer]
  );

  const fetchNodeResults = useCallback(

  );

    return useCallback(
        async (req: MultiKeywordSearchRequest, limit: number, clusiver: string) => {


            if (clusiver == "OR"){
                // 
            } else {
                // Default: Add to keywordSearch, return the
            }


            const nodeOrNodes = null;
            const nodes = Array.isArray(nodeOrNodes) ? nodeOrNodes : [nodeOrNodes];
            const searchResults = await Promise.all(
                nodes.map(async node => {
                  const neighborsCount = await fetchNeighborsCount({
                    vertexId: node.data.id,
                    idType: node.data.idType,
                    limit: neighbors_limit,
                  });
                  if (!neighborsCount) {
                    return;
                  }

                  return {
                    data: {
                      ...node.data,
                      neighborsCount:
                        neighborsCount?.totalCount || node.data.neighborsCount,
                      neighborsCountByType: {
                        ...(node.data.neighborsCountByType || {}),
                        ...(neighborsCount.counts || {}),
                      },
                    },
                  };
                })
            );

            const validResults = searchResults.filter(Boolean) as Vertex[];

            if (!validResults.length) {
              return;
            }


            setEntities({
                nodes: validResults,
                edges: [],
                selectNewEntities: "nodes",
              });
        },
        [explorer, setEntities, enqueueNotification, clearNotification]
    );

  /*return useCallback(
    async (req: NeighborsRequest) => {
      const result = await explorer?.fetchNeighbors(req);

      if (!result || !result.vertices.length) {
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
      });

      const notificationId = enqueueNotification({
        title: "Updating Neighbors",
        message: `Looking for the Neighbors of ${result.vertices.length} results`,
        autoHideDuration: null,
      });

      const verticesWithUpdatedCounts = await Promise.all<Vertex>(
        result.vertices.map(async vertex => {
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

      clearNotification(notificationId);
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
        edges: result.edges,
      }));
    },
    [explorer, setEntities, enqueueNotification, clearNotification]
  );
  */
};

export default useMultiQueryFetch;
