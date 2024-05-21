import { useCallback } from "react";
import { useNotification } from "../components/NotificationProvider";
import type { SubGraphRequest } from "../connector/useGEFetchTypes";
import { explorerSelector } from "../core/connector";
import useEntities from "./useEntities";
import { Vertex, Edge } from "../@types/entities";
import { useRecoilValue } from "recoil";


const useSubGraph = () => {
  const [, setEntities] = useEntities();
  const explorer = useRecoilValue(explorerSelector);
  const { enqueueNotification, clearNotification } = useNotification();

  return useCallback(
    async (req: SubGraphRequest) => {
        const result = await explorer?.createSubgraph(req);
        
        if (!result) {
            enqueueNotification({
              title: "No Results",
              message: "Your search has returned no results",
            });
            return;
        }
        /*setEntities({
            nodes: [],
            edges: [],
            forceSet: true,
        });*/

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
  );
};

export default useSubGraph;