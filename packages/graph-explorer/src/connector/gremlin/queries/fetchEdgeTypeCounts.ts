import type {
  CountsByTypeRequest,
  CountsByTypeResponse,
} from "../../useGEFetchTypes";
import edgeTypeCountTemplate from "../templates/edgeTypeCountTemplate"; 
import { GInt64, GremlinFetch } from "../types";

type RawCountsByTypeResponse = {
  requestId: string;
  status: {
    message: string;
    code: number;
  };
  result: {
    data: {
      "@type": "g:List";
      "@value": Array<GInt64>;
    };
  };
};

const fetchEdgeTypeCounts = async (
  gremlinFetch: GremlinFetch,
  req: CountsByTypeRequest
): Promise<CountsByTypeResponse> => {
  const template = edgeTypeCountTemplate(req.label);
  const response = await gremlinFetch<RawCountsByTypeResponse>(template);
  return {
    total: response.result.data["@value"][0]["@value"],
  };
};

export default fetchEdgeTypeCounts;
