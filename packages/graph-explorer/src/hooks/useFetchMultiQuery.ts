import { useNotification } from "../components/NotificationProvider";
//import { KeywordSearchRequest, MultiKeywordSearchRequest } from "../connector/useGEFetchTypes";
import { explorerSelector } from "../core/connector";
import useEntities from "./useEntities";
import { Vertex } from "../@types/entities";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback } from "react";
import { SubQuery } from "../@types/subqueries";
import { multiQueriesResultAtom } from "../core/StateProvider/subquery";

const useFetchMultiQuery = () => {
    const explorer = useRecoilValue(explorerSelector);
    const setMultiQueryAtom = useSetRecoilState(multiQueriesResultAtom);
    const { enqueueNotification, clearNotification } = useNotification();
    
    return useCallback(
        async (req: any) => {
            let result = await explorer?.multiKeywordSearch(req);
            if (!result || !result.vertices.length) {
                enqueueNotification({
                  title: "No Results",
                  message: "Your search has returned no results",
                });
                return;
            };
            setMultiQueryAtom(result);
            return result
        }, [explorer, enqueueNotification, clearNotification]
      );
};
  
export default useFetchMultiQuery;
            /*const addSubQuery = () => {
                setSubQuery((prev) => {
                    const newSubQuery = {
                        selectedVertexType:selectedVertexType,
                        attribute:selectedAttribute,
                        searchTerm:searchTerm,
                        exactMatch: exactMatch,
                    }
                    console.log('New SubQuery:', newSubQuery);
                    const updatedSubQueries = new Set([...prev, newSubQuery]);
                    console.log('Updated SubQueries:', updatedSubQueries);
                    return updatedSubQueries;
                  });    
              }*/

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
