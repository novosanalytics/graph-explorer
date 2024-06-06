export interface SubQueryData {
    /**
     * Unqiue Identifier for Multiquery objects 
     * Currently for PG only
     */
    selectedVertexType: string;
    /**
     * Selected Vertex Type for the query
     * For vertex type of (__all) then apply all vertex types to the overall query
     */
    attribute: string;
    /**
     * Attribute for the query
     */
    searchTerm: string;
    /**
     * Search term for the query
     */
}

export interface SubQuery<T = Record<string, unknown>> {
    data:SubQueryData & T;
}