/**
 * Add necessary imports here
 */

import { EdgesRequest, EdgesResponse } from "../../AbstractConnector";
import localEdgeTemplate from "../templates/localEdgeTemplate";
import mapApiEdge from "../mappers/mapApiEdge";
import { GEdgeList, GremlinFetch } from "../types";

const fetchLocalEdges = async (
    gremlinFetch: GremlinFetch,
    req: string
): Promise<EdgesResponse> => {
    const localTemplate = localEdgeTemplate(req);
    console.log(localTemplate)
    const data = await gremlinFetch<EdgesResponse>(localTemplate);
    const localEdges = data
    return localEdges
};

export default fetchLocalEdges;

