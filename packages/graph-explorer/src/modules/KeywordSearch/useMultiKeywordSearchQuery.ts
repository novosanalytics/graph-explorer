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
  const multiKeywordTotal = (subQueries:Set<SubQuery>) => {
    console.log(`transforming: ${Array.from(subQueries).join(' ')}`)
    const setResult = Array.from(subQueries).map((subQuery) => ({
      searchTerm: subQuery.searchTerm,
      searchById: false,
      searchByAttributes: subQuery.attribute,
      vertexTypes: subQuery.selectedVertexType,
      exactMatch: subQuery.exactMatch,
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
        console.log(`Sending: ${requests[0]}`)
        return await explorer?.multiKeywordSearch (requests, { signal });
      },
      enabled: false,
  });

  useEffect(() => {
    if (trigger) {
        console.log("Got multi request")
        multiQuery.refetch();
        setTrigger(false); 
    }
  }, [trigger, multiQuery, setTrigger]);

  return {
    ...multiQuery
  };
};
