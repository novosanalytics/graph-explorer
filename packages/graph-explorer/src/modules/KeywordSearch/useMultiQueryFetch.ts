import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../../components/NotificationProvider";
import type { MultiKeywordSearchRequest, NeighborsCountRequest } from "../../connector/useGEFetchTypes";
import { explorerSelector } from "../../core/connector";
import useEntities from "../../hooks/useEntities";
import { Vertex } from "../../@types/entities";
import { useRecoilValue } from "recoil";
import type { SearchQueryRequest } from "./useKeywordSearchQuery";

export function useMultiQueryFetch({
    multiKeywordSearch,
}: MultiKeywordSearchRequest){
  const [, setEntities] = useEntities();
  const explorer = useRecoilValue(explorerSelector);
  const { enqueueNotification, clearNotification } = useNotification();

  const multiQueryKey = ['multiQueryKey'];

  const multiQueryFetch = useQuery({
    multiQueryKey,
    multiQueryFn: async ({ signal }) => {
        if (!explorer) {
          return;
        }
  
        return await explorer.multiKeywordSearch (
          {
            searchTerm: debouncedSearchTerm,
            vertexTypes,
            searchByAttributes,
            searchById: true,
            exactMatch,
          },
          { signal }
        );
      },
      enabled: isOpen && !!explorer,
  });
};