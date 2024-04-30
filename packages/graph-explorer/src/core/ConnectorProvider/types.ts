import LoggerConnector from "../../connector/LoggerConnector";
import { CountsByTypeResponse, KeywordSearchResponse, NeighborsCountResponse, NeighborsResponse, SchemaResponse, SubGraphResponse } from "../../connector/useGEFetchTypes";

export type Explorer = {
  fetchSchema: (options?: any) => Promise<SchemaResponse>;
  fetchVertexCountsByType: (req: any, options?: any) => Promise<CountsByTypeResponse>
  fetchEdgeCountsByType: (req: any, options?: any) => Promise<CountsByTypeResponse>
  fetchNeighbors: (req: any, options?: any) => Promise<NeighborsResponse>;
  fetchEdgeNeighbors: (req: any, options?: any) => Promise<NeighborsResponse> 
  fetchMultiNeighbors: (req: any, options?: any) => Promise<NeighborsResponse>
  fetchNeighborsCount: (req: any, options?: any) => Promise<NeighborsCountResponse>
  createSubgraph: (req: any, options?: any) => Promise<SubGraphResponse>
  keywordSearch: (req: any, options?: any) => Promise<KeywordSearchResponse>
};

export type ConnectorContextProps = {
  explorer?: Explorer;
  logger?: LoggerConnector;
};
