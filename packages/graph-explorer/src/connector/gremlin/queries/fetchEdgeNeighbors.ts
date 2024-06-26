import type {
    NeighborsRequest,
    NeighborsResponse,
} from "../../useGEFetchTypes";
  import mapApiEdge from "../mappers/mapApiEdge";
  import mapApiVertex from "../mappers/mapApiVertex";
  import toStringId from "../mappers/toStringId";
  //import oneHopTemplate from "../templates/oneHopTemplate";
  import edgeVertHopTemplate from "../templates/edgeVertHopTemplate";
  import edgeEdgeHopTemplate from "../templates/edgeEdgeHopTemplate";
  import type { GEdgeList, GVertexList } from "../types";
  import { GremlinFetch } from "../types";

type RawOneHopRequest = {
    requestId: string;
    status: {
      message: string;
      code: number;
    };
    result: {
      data: {
        "@type": "g:List";
        "@value": Array<{
          "@type": "g:Map";
          "@value": ["vertices", GVertexList, "edges", GEdgeList];
        }>;
      };
    };
  };

  const fetchEdgeNeighbors = async (
    gremlinFetch: GremlinFetch,
    req: NeighborsRequest,
  ): Promise<NeighborsResponse> => {
    //const idType = rawIds.get(req.vertexId) ?? "string";
    const gremlinTemplate = edgeVertHopTemplate({...req}); // Gets the vertices
    const edgeTemplate = edgeEdgeHopTemplate({...req}); // Gets the edges
    let [vData, eData] = await Promise.all([
      gremlinFetch<RawOneHopRequest>(gremlinTemplate),
      gremlinFetch<RawOneHopRequest>(edgeTemplate),
    ])
    //const data = await gremlinFetch<RawOneHopRequest>(gremlinTemplate);
    const verticesResponse =
      vData.result.data["@value"]?.[0]?.["@value"][1]["@value"];
    const edgesResponse = 
      eData.result.data["@value"]?.[0]?.["@value"][1]["@value"];
    const verticesIds = verticesResponse?.map(v => toStringId(v["@value"].id));
    //const edgeIds = edgesResponse?.map(e => toStringId(e["@value"].id));
    const vertices: NeighborsResponse["vertices"] = verticesResponse?.map(
      vertex => mapApiVertex(vertex)
    );

    const edges = eData.result.data["@value"]?.[0]?.["@value"][3]["@value"]
      .map(value => {
        return mapApiEdge(value);
      })
      .filter(
        edge =>
          verticesIds.includes(edge.data.source) ||
          verticesIds.includes(edge.data.target)
      );
    return {
      vertices,
      edges,
    };
  };

  export default fetchEdgeNeighbors;