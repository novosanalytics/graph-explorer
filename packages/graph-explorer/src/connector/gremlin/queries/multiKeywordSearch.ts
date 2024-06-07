import type {
  ErrorResponse,
  MultiKeywordSearchRequest,
  KeywordSearchResponse,
} from "../../useGEFetchTypes";
import isErrorResponse from "../../utils/isErrorResponse";
import mapApiVertex from "../mappers/mapApiVertex";
import keywordSearchTemplate from "../templates/keywordSearchTemplate";
import type { GVertexList } from "../types";
import { GremlinFetch } from "../types";

type RawKeySearchResponse = {
  requestId: string;
  status: {
    message: string;
    code: number;
  };
  result: {
    data: GVertexList;
  };
};

const multiKeywordSearch = async (
  gremlinFetch: GremlinFetch,
  req: MultiKeywordSearchRequest
): Promise<KeywordSearchResponse> => {
  const gremlinTemplate = keywordSearchTemplate(req);
  const data = await gremlinFetch<RawKeySearchResponse | ErrorResponse>(
    gremlinTemplate
  );

  if (isErrorResponse(data)) {
    throw new Error(data.detailedMessage);
  }

  const vertices = data.result.data["@value"].map(value => {
    return mapApiVertex(value);
  });

  return { vertices };
};

export default multiKeywordSearch;
