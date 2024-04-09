import type { Criterion, NeighborsRequest } from "../../AbstractConnector";

const criterionNumberTemplate = ({
  name,
  operator,
  value,
}: Omit<Criterion, "dataType">): string => {
  switch (operator.toLowerCase()) {
    case "eq":
    case "==":
    default:
      return `has("${name}",eq(${value}))`;
    case "gt":
    case ">":
      return `has("${name}",gt(${value}))`;
    case "gte":
    case ">=":
      return `has("${name}",gte(${value}))`;
    case "lt":
    case "<":
      return `has("${name}",lt(${value}))`;
    case "lte":
    case "<=":
      return `has("${name}",lte(${value}))`;
    case "neq":
    case "!=":
      return `has("${name}",neq(${value}))`;
  }
};

const criterionStringTemplate = ({
  name,
  operator,
  value,
}: Omit<Criterion, "dataType">, searchType: boolean): string => {
  switch (operator.toLowerCase()) {
    case "eq":
    case "==":
    default:
      return `has("${name}","${value}")`;
    case "neq":
    case "!=":
      return `has("${name}",neq("${value}"))`;
    case "like":
      return `has("${name}", containing("${value}"))`;
  }
};

const criterionDateTemplate = ({
  name,
  operator,
  value,
}: Omit<Criterion, "dataType">): string => {
  switch (operator.toLowerCase()) {
    case "eq":
    case "==":
    default:
      return `has("${name}",eq(datetime(${value})))`;
    case "gt":
    case ">":
      return `has("${name}",gt(datetime(${value})))`;
    case "gte":
    case ">=":
      return `has("${name}",gte(datetime(${value})))`;
    case "lt":
    case "<":
      return `has("${name}",lt(datetime(${value})))`;
    case "lte":
    case "<=":
      return `has("${name}",lte(datetime(${value})))`;
    case "neq":
    case "!=":
      return `has("${name}",neq(datetime(${value})))`;
  }
};

const criterionTemplate = (criterion: Criterion, neighborsRequest:NeighborsRequest): string => {
  switch (criterion.dataType) {
    case "Number":
      return criterionNumberTemplate(criterion);
    case "Date":
      return criterionDateTemplate(criterion);
    case "String":
    default:
      return criterionStringTemplate(criterion, neighborsRequest.searchType);
  }
};

/**
 * @example
 * sourceId = "124"
 * vertexTypes = ["airport"]
 * edgeTypes = ["route"]
 * limit = 10
 * offset = 0
 *
 * g.V("124")
 *  .project("vertices", "edges")
 *  .by(
 *    both().hasLabel("airport").dedup().range(0,10).fold()
 *  )
 *  .by(
 *    bothE("route").dedup().range(0,10).fold()
 *  )
 *
 *  @example
 * sourceId = "124"
 * vertexTypes = ["airport"]
 * filterCriteria = [
 *   { name: "longest", dataType: "Int", operator: "gt", value: 10000 },
 *   { name: "country", dataType: "String", operator: "like", value: "ES" }
 * ]
 * limit = 10
 * offset = 0
 *
 * g.V("124")
 *  .project("vertices", "edges")
 *  .by(
 *    both().hasLabel("airport").and(
 *      has("longest", gt(10000)),
 *      has("country", containing("ES"))
 *    ).dedup().range(0,10).fold()
 *  )
 *  .by(
 *    bothE("route").dedup().fold()
 *  )
 */
const oneHopTemplate = ({
  multiVertexId,
  vertexId,
  odFlag,
  overdate,
  filterByVertexTypes = [],
  edgeTypes = [],
  filterCriteria = [],
  limit = 10,
  offset = 0,
  idType = "string",
  searchType,
}: Omit<NeighborsRequest, "vertexType"> & {
  idType?: "string" | "number";
}): string => {
  const range = `.range(${offset}, ${offset + limit})`;
  let template = "";
  if (idType === "number") {
    template = `g.V(${vertexId}L)`;
  } else {
    template = `g.V("${vertexId}")`;
  }

  template += `.project("vertices", "edges")`;

  const hasLabelContent = filterByVertexTypes
    .flatMap(type => type.split("::"))
    .map(type => `"${type}"`)
    .join(",");
  const bothEContent = edgeTypes.map(type => `"${type}"`).join(",");

  let filterCriteriaTemplate = ".and(";
  filterCriteriaTemplate += filterCriteria?.map(criterionTemplate).join(",");
  if (odFlag) {
    filterByVertexTypes.forEach(element => {
      filterCriteriaTemplate += `, has("${element}_Record_Active_Date__c", lte("${overdate}"))`;
      filterCriteriaTemplate += `, has("${element}_Record_Expiration_Date__c", gte("${overdate}"))`;
      filterCriteriaTemplate += ")";
    });
  }
  filterCriteriaTemplate += ")";

  if (filterByVertexTypes.length > 0) {
    if (filterCriteria.length > 0) {
      template += `.by(both().hasLabel(${hasLabelContent})${filterCriteriaTemplate}.dedup()${range}.fold())`;
    } else {
      template += `.by(both().hasLabel(${hasLabelContent}).dedup()${range}.fold())`;
    }
  } else {
    if (filterCriteria.length > 0) {
      template += `.by(both()${filterCriteriaTemplate}.dedup()${range}.fold())`;
    } else {
      template += `.by(both().dedup()${range}.fold())`;
    }
  }

  if (edgeTypes.length > 0) {
    if (filterByVertexTypes.length > 0) {
      template += `.by(bothE(${bothEContent}).where(otherV().hasLabel(${hasLabelContent})).dedup()${range}.fold())`;
    } else {
      template += `.by(bothE(${bothEContent}).dedup()${range}.fold())`;
    }
  } else {
    if (filterByVertexTypes.length > 0) {
      template += `.by(bothE().where(otherV().hasLabel(${hasLabelContent})).dedup().fold())`;
    } else {
      template += `.by(bothE().dedup().fold())`;
    }
  }


  /**
   * 
   * g.V(\"a0X1Q00000WmYDGUA3\", \"a0X1Q00000WmYD1UAN\", \"a0XPm000000NqCPMA0\").project(\"vertices\").by(both().hasLabel(\"client\").range(0, 18).fold())
   * 
   */

  if(multiVertexId){
    template = `g.V(${multiVertexId}).project("vertices", "edges").by(both().hasLabel(${hasLabelContent})${range}.fold()).by(bothE().where(otherV().hasLabel(${hasLabelContent})).fold())`
  }

  return template;
};

export default oneHopTemplate;