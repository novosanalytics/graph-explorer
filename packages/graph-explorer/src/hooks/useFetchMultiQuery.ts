import { useNotification } from "../components/NotificationProvider";
//import { KeywordSearchRequest, MultiKeywordSearchRequest } from "../connector/useGEFetchTypes";
import { explorerSelector } from "../core/connector";
import useEntities from "./useEntities";
import { Vertex } from "../@types/entities";
import { useRecoilValue } from "recoil";
import { useCallback } from "react";
import { SubQuery } from "../@types/subqueries";
import { MultiKeywordSearchRequest } from "../connector/useGEFetchTypes";

/*const useFetchMultiQuery = () => {
  const [, setEntities] = useEntities();
  const explorer = useRecoilValue(explorerSelector);
  const { enqueueNotification, clearNotification } = useNotification();


};

export default useFetchMultiQuery;*/


const useFetchMultiQuery = () => {
    const explorer = useRecoilValue(explorerSelector);
    const { enqueueNotification, clearNotification } = useNotification();
    
    return useCallback(
        async (req: any) => {
            const result = await explorer?.multiKeywordSearch(req);
            if (!result || !result.vertices.length) {
                enqueueNotification({
                  title: "No Results",
                  message: "Your search has returned no results",
                });
                return;
            }
        }, [explorer, enqueueNotification, clearNotification]
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
