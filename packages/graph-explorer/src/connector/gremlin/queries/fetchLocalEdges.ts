/**
 * Add necessary imports here
 */

import { EdgesRequest, EdgesResponse } from "../../AbstractConnector";
import localEdgeTemplate from "../templates/localEdgeTemplate";
import mapApiEdge from "../mappers/mapApiEdge";
import { GEdgeList, GremlinFetch } from "../types";

const fetchLocalEdges = async (
    gremlinFetch: GremlinFetch,
    req: EdgesRequest
): Promise<Array<string>> => {
    const localTemplate = localEdgeTemplate(req.vertexId) ?? "string ";
    console.log(localTemplate)
    const result = await gremlinFetch<any>(localTemplate);
    console.log(`Result: ${result}`)
    const localEdges = result["result"]["data"]["@value"];
    console.log(localEdges)
    return localEdges
};

export default fetchLocalEdges;

