import { useCallback } from "react";
import { useNotification } from "../components/NotificationProvider";
import type { SubGraphRequest } from "../connector/AbstractConnector";
import useConnector from "../core/ConnectorProvider/useConnector";
import useEntities from "./useEntities";


const useSubGraph = () => {
  const [, setEntities] = useEntities();
  const connector = useConnector();
  const { enqueueNotification, clearNotification } = useNotification();

  return useCallback(
    async (req: SubGraphRequest) => {
        const result = await connector.explorer?.createSubgraph(req);
        
        if (!result) {
            enqueueNotification({
              title: "No Results",
              message: "Your search has returned no results",
            });
            return;
        }
        console.log(result.vertices)
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

        

    },[connector.explorer, setEntities, enqueueNotification, clearNotification]
  );
};

export default useSubGraph;