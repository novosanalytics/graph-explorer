import { Edge } from "../../../@types/entities";
import type {
  NeighborsRequest,
  NeighborsResponse,
} from "../../AbstractConnector";
import mapApiEdge from "../mappers/mapApiEdge";
import mapApiVertex from "../mappers/mapApiVertex";
import toStringId from "../mappers/toStringId";
import oneHopTemplate from "../templates/oneHopTemplate";
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

const fetchMultiNeighbors = async (
  gremlinFetch: GremlinFetch,
  req: NeighborsRequest,
  rawIds: Map<string, "string" | "number">
): Promise<NeighborsResponse> => {
  const idType = rawIds.get(req.vertexId) ?? "string";
  const gremlinTemplate = oneHopTemplate({ ...req, idType });
  const data = await gremlinFetch<RawOneHopRequest>(gremlinTemplate);
  console.log(`Node Query: ${gremlinTemplate}`)
  //const verticesResponse =
  //  data.result.data["@value"]?.[0]?.["@value"][1]["@value"];
  //const verticesIds = verticesResponse?.map(v => toStringId(v["@value"].id));
  
  const rawVertices = data.result.data["@value"]
  let verticesIds: Array<any>[] = [];
  let edges: Edge[] = [];
  const vertices: NeighborsResponse["vertices"] = [];
  rawVertices.forEach(vResult => {
    const vItems = vResult["@value"][1]["@value"];
    const vDetails = vItems.map(v => toStringId(v["@value"].id));
    verticesIds.push(vDetails);
    vertices.concat(vItems.map(
      vertex => mapApiVertex(vertex)
    ));
    const eDetails = vResult["@value"][3]["@value"]
    .map(e=> {
      return mapApiEdge(e);
    }).filter(
      edge =>
        vDetails.includes(edge.data.source) ||
        vDetails.includes(edge.data.target)
    )
    console.log(`V Details: ${vDetails}`);
    console.log(`E Details: ${eDetails}`);
    edges.concat(eDetails)
  });
  //const rawVerticesIds = rawVertices?.map(v => toStringId(v["@value"].id));
  //const vertices: NeighborsResponse["vertices"] = verticesResponse?.map(
  //  vertex => mapApiVertex(vertex)
  //);

  return {
    vertices,
    edges,
  };
};

export default fetchMultiNeighbors;
