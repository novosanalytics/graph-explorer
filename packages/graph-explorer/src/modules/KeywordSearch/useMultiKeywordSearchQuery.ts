import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../../components/NotificationProvider";
import { KeywordSearchRequest, type MultiKeywordSearchRequest, type NeighborsCountRequest } from "../../connector/useGEFetchTypes";
import { explorerSelector } from "../../core/connector";
import useEntities from "../../hooks/useEntities";
import { Vertex } from "../../@types/entities";
import { useRecoilValue } from "recoil";
import type { SearchQueryRequest } from "./useKeywordSearchQuery";

export function useMultiKeywordSearchQuery({
    multiKeywordSearch,
}: MultiKeywordSearchRequest){
  const [, setEntities] = useEntities();
  const explorer = useRecoilValue(explorerSelector);
  const { enqueueNotification, clearNotification } = useNotification();

  const multiQueryKey = ['multiQueryKey'];

  const multiQuery = useQuery({
    multiQueryKey,
    multiQueryFn: async ({ signal }) => {
        if (!explorer) {
          return;
        }
  
        return await explorer.multiKeywordSearch (
            {
                null, //change this to KeywordSearchRequest
            },
            { signal }
        );
      },
      enabled: isOpen && !!explorer,
  });

  return {
    ...multiQuery
  }
};