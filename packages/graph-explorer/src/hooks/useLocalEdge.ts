import { useCallback } from "react";
import { useNotification } from "../components/NotificationProvider";
import useConnector from "../core/ConnectorProvider/useConnector";
import useEntities from "./useEntities";
import { EdgesRequest } from "../connector/AbstractConnector";

const useLocalEdges = () =>  {
    const connector = useConnector();
    
    return useCallback(
        async (req: EdgesRequest) => {
            const result = await connector.explorer?.fetchLocalEdges(req);

            return result
        },
        [connector.explorer
    ]);
};

export default useLocalEdges;