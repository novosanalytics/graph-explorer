import { capitalize, toUpper } from "lodash";
import type { Criterion, NeighborsRequest } from "../../useGEFetchTypes";

const now = new Date();

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
  }: Omit<Criterion, "dataType">): string => {
    switch (operator.toLowerCase()) {
      case "eq":
      case "==":
      default:
        return `has("${name}","${value}")`;
      case "neq":
      case "!=":
        return `has("${name}",neq("${value}"))`;
      case "like":
        return `has("${name}", "${value}")`;
      case "less than":
      case "<":
        return `has("${name}", lt("${value}"))`;
      case "greater than":
      case ">":
        return `has("${name}", gt("${value}"))`;
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
  
const criterionTemplate = (criterion: Criterion): string => {
    switch (criterion.dataType) {
      case "Number":
        return criterionNumberTemplate(criterion);
      case "Date":
        return criterionDateTemplate(criterion);
      case "String":
      default:
        return criterionStringTemplate(criterion);
    }
};

/**
 * @example
      g.V("125")
      .project("vertices", "edges")
      .by(
        bothE({edgeType})
        .has({filterCriteria K}, {filterCriteria V]})
        .inV().hasLabel({hasLabelContent})
      ).dedup().fold()
 * 
 */

const edgeVertHopTemplate = ({
    vertexId,
    odFlag,
    overdate,
    filterByVertexTypes = [],
    edgeTypes = [],
    filterCriteria = [],
    limit = 10,
    offset = 0,
    idType = "string",
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

    console.log(`vertexId:`, vertexId)
    console.log(`filterByVertexTypes:`, filterByVertexTypes)
    console.log(`edgeTypes:`, edgeTypes)
    console.log(`filters:`, filterCriteria)

    template += `.project("vertices", "edges")`;

    const bothEContent = edgeTypes.map(type => `"${type}"`).join(",");

    //let activeDate = filterCriteria[0]['value'];
    let activeDate = ""
    //activeDate += filterCriteria[0]['value']
    if (filterCriteria.length > 0){
      activeDate += filterCriteria[0]['value'];
    } else {
      activeDate += overdate;
    }
    console.log(filterCriteria)
    let filterCriteriaTemplate = ".and(";
    let edgePrefix =  /^[0-9]*$/.test(edgeTypes[0][1]) ? toUpper(edgeTypes[0].slice(0,2)): capitalize(edgeTypes[0]);
    if (edgeTypes[0] == "network_participation"){
      filterCriteriaTemplate += `has("Network_Participation_Record_Active_Da__c", lte("${activeDate}"))`;
      filterCriteriaTemplate += `, has("Network_Participation_Record_Expiratio__c", gte("${activeDate}"))`;
      filterCriteriaTemplate += ")";
    } else {
      filterCriteriaTemplate += `has("${edgePrefix}_Record_Active_Date__c", lte("${activeDate}"))`;
      filterCriteriaTemplate += `, has("${edgePrefix}_Record_Expiration_Date__c", gte("${activeDate}"))`;
      filterCriteriaTemplate += ")";
    }

    /*let filterCriteriaTemplate = ".and(";
    filterCriteriaTemplate += filterCriteria?.map(criterionTemplate).join(",");
    filterCriteriaTemplate += ")";*/

    const hasLabelContent = filterByVertexTypes
    .flatMap(type => type.split("::"))
    .map(type => `"${type}"`)
    .join(",");
    template += `.by(bothE(${bothEContent})${filterCriteriaTemplate}.dedup().bothV().range(0,500).fold())`;
    /*
      if (edgeTypes.length > 0){
        if (filterCriteria.length > 0) {
            template += `.by(bothE(${bothEContent}).and(has("${edgeTypes[0]}_Record_Active_Date__c", gt("4000-12-31")), has("${edgeTypes[0]}_Record_Expiration_Date__c", lt("4000-12-31"))).dedup().outV()${range}.fold())`;
          } else {
            template += `.by(bothE(${bothEContent}).dedup().outV()s${range}.fold())`;
        }
      } else {
        if (filterCriteria.length > 0) {
          template += `.by(bothE(${bothEContent}).and(has("${edgeTypes[0]}_Record_Active_Date__c", gt("4000-12-31")), has("${edgeTypes[0]}_Record_Expiration_Date__c", lt("4000-12-31"))).dedup().fold())`;
        } else {
          template += `.by(bothE().dedup().fold())`;
        }
      }
    */
      return template;
};
    
export default edgeVertHopTemplate;