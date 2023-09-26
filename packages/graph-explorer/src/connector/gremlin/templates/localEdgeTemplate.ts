/**
 * It returns all the local edges connected to a given node
 */

const localEdgeTemplate = (vertexId: string) => {
    return `g.V(${vertexId}).project("edges").bothE()`
};

export default localEdgeTemplate;