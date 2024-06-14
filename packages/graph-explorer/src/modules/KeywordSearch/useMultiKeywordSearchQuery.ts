import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../../components/NotificationProvider";
import { KeywordSearchRequest } from "../../connector/useGEFetchTypes";
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
  const subQueries = useRecoilState(subQueriesAtom);
  const multiKeywordTotal = (subQueries:Set<SubQuery>) => {
    return Array.from(subQueries).map((subQuery) => ({
      searchTerm: subQuery.searchTerm,
      searchById: true,
      searchByAttributes: subQuery.attribute ? [subQuery.attribute] : [],
      vertexTypes: subQuery.selectedVertexType ? [subQuery.selectedVertexType] : [],
      exactMatch: subQuery.exactMatch,
    }));
  };


  const multiQuery = useQuery({
    queryKey: multiQueryKey,
    queryFn: async ({ signal }) => {
        if (!explorer) {
          return;
        }
  
        return await explorer.multiKeywordSearch (
            {
                multiKeywordSearch:multiKeywordTotal  
            },
            { signal }
        );
      },
      enabled: false,
  });

  useEffect(() => {
    if (trigger) {
      multiQuery.refetch();
      setTrigger(false); // Reset the trigger
    }
  }, [trigger, multiQuery, setTrigger]);

  return {
    ...multiQuery
  };
};
