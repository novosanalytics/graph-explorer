import { useNotification } from "../components/NotificationProvider";
//import { KeywordSearchRequest, MultiKeywordSearchRequest } from "../connector/useGEFetchTypes";
import { explorerSelector } from "../core/connector";
import useEntities from "./useEntities";
import { Vertex } from "../@types/entities";
import { useRecoilValue } from "recoil";
import { useCallback } from "react";
import { SubQuery } from "../@types/subqueries";

const useFetchMultiQuery = () => {
  const [, setEntities] = useEntities();
  const explorer = useRecoilValue(explorerSelector);
  const { enqueueNotification, clearNotification } = useNotification();

  return useCallback(
    async (querySet: Set<SubQuery>) => {
        const requests = Array.from(querySet).map((subQuery) => ({
              searchTerm: subQuery.searchTerm,
              searchById: false,
              searchByAttributes: subQuery.attribute,
              vertexTypes: subQuery.selectedVertexType,
              exactMatch: subQuery.exactMatch,
              offset: 0,
              limit: 10,
        }));
        const result = await explorer?.multiKeywordSearch(requests);

        if (!result || !result.vertices.length) {
            enqueueNotification({
              title: "No Results",
              message: "Your search has returned no results",
            });
            return;
        }

    },
    [explorer, setEntities, enqueueNotification, clearNotification]
  );
};

export default useFetchMultiQuery;


/*  const multiQuery = useQuery({
    queryKey: multiQueryKey,
    queryFn: async ({ signal }) => {
        if (!explorer) {
          return;
        }

        const requests =  multiKeywordTotal(subQueries)
        if (trigger) {
            setTrigger(false);
        }
        return await explorer.multiKeywordSearch(requests, { signal });
      },
      enabled: false,
  });

  const cancelAll = useCallback(async () => {
    await queryClient.cancelQueries({
      queryKey: ["keyword-search"],
      exact: false,
    });
  }, [queryClient]);

  return {
    ...multiQuery,
    cancelAll,
  };
};*/
