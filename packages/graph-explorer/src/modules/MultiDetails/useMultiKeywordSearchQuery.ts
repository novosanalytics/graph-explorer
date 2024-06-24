import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../../components/NotificationProvider";
import { KeywordSearchRequest, MultiKeywordSearchRequest } from "../../connector/useGEFetchTypes";
import { explorerSelector } from "../../core/connector";
import useEntities from "../../hooks/useEntities";
import { Vertex } from "../../@types/entities";
import { useRecoilValue, useRecoilState } from "recoil";
import { useCallback, useEffect, useMemo } from "react";
import { queryTriggerAtom, subQueriesAtom } from '../../core/StateProvider/subquery';
import { SubQuery } from "../../@types/subqueries";

export function useMultiKeywordSearchQuery() {
  const [, setEntities] = useEntities();
  const explorer = useRecoilValue(explorerSelector);
  const { enqueueNotification, clearNotification } = useNotification();
  const [trigger, setTrigger] = useRecoilState(queryTriggerAtom);

  const multiQueryKey = ['multiQueryKey'];
  const [subQueries] = useRecoilState(subQueriesAtom);
  const queryClient = useQueryClient();

  const multiKeywordTotal = (subQueries:Set<SubQuery>) => {
    let setResult = Array.from(subQueries).map((subQuery) => ({
      searchTerm: subQuery.searchTerm,
      searchById: false,
      searchByAttributes: subQuery.attribute,
      vertexTypes: subQuery.selectedVertexType,
      exactMatch: subQuery.exactMatch,
      offset: 0,
      limit: 10,
    }));
    return setResult;
  };

  const multiQuery = useQuery({
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
};
