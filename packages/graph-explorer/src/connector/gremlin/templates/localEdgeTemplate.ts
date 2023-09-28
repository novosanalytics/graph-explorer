/**
 * It returns all the local edges connected to a given node
 */

const localEdgeTemplate = (vertexId: string) => {
    return `g.V("${vertexId}").bothE().union(label()).dedup()`
};

export default localEdgeTemplate;