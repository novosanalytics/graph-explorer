import { useMemo } from "react";
import { useQuery } from "react-query";
import { useConfiguration } from "../core";
import useConnector from "../core/ConnectorProvider/useConnector";
import useUpdateSchema from "./useUpdateSchema";

const useUpdateEdgeTypeCounts = (edgeType?: string) => {
  const config = useConfiguration();
  const connector = useConnector();

  const edgeConfig = useMemo(() => {
    if (!edgeType) {
      return;
    }

    return config?.getEdgeTypeConfig(edgeType);
  }, [config, edgeType]);

  const updateSchemaState = useUpdateSchema();
  useQuery(
    ["fetchCountsByType", edgeConfig?.type],
    () => {
      if (edgeConfig?.total != null || edgeConfig?.type == null) {
        return;
      }

      return connector.explorer?.fetchEdgeCountsByType({
        label: edgeConfig?.type,
      });
    },
    {
      enabled: edgeConfig?.total == null && edgeConfig?.type != null,
      onSuccess: response => {
        if (!config?.id || !response) {
          return;
        }

        updateSchemaState(config.id, (prevSchema) => {
          const edgeSchema = prevSchema?.edges.find(
            edge => edge.type === edgeType
          );
          if (!edgeSchema) {
            return { ...(prevSchema || {}) };
          }

          edgeSchema.total = response.total;
          return {
            edges: [
              ...(prevSchema?.edges.filter(
                edge => edge.type !== edgeType
              ) || []),
              edgeSchema,
            ],
          };
        });
      },
    }
  );
};

export default useUpdateEdgeTypeCounts;
