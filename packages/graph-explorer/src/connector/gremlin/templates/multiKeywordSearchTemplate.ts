import uniq from "lodash/uniq";
import type {KeywordSearchRequest, MultiKeywordSearchRequest } from "../../useGEFetchTypes";
import { escapeString } from "../../../utils";
import multiKeywordSearch from "../queries/multiKeywordSearch";


/**
 * @example
 * searchTerm = "JFK"
 * vertexTypes = ["airport"]
 * searchById = false
 * searchByAttributes = ["city", "code"]
 * limit = 100
 * offset = 0
 * exactMatch = false
 *
 * g.V()
 *  .hasLabel("airport")
 *  .or(
 *    has("city", containing("JFK"),
 *    has("code", containing("JFK")
 *  )
 *  .range(0, 100)
 */

const multiKeywordSearchTemplate = (
    multiKeywordSearch: MultiKeywordSearchRequest): string => {
    //console.log(`Input sub ${multiKeywordSearch[0];
    console.log(`Input: ${multiKeywordSearch}`);
    let template = "g.V()";
    let firstSearch = multiKeywordSearch[0];
    console.log(firstSearch)
    if (firstSearch.vertexTypes) { 
        //Adjust this later for _all option
        /*const hasLabelContent = firstSearch.vertexTypes
            .flatMap(type => type.split("::"))
            .map(type => `"${type}"`)
            .join(",");*/
        const  hasLabelContent = firstSearch.vertexTypes;
        template += `.hasLabel(${hasLabelContent})`;
    }
    template += `.and(`
    console.log(`So far: ${template}`)
    let fullSearch = multiKeywordSearch.forEach((subKey) => {
        console.log(`${subkey.vertexType} :: ${subkey.searchByAttributes}} :: ${subkey.searchTerm}`)
        const escapedSearchTerm = escapeString(subKey.searchTerm)
        const multiContent = uniq(
        subKey.searchByAttributes.includes("__all")
            ? ["__id", ...subKey.searchByAttributes]
            : subKey.searchByAttributes
        )
        .filter(attr => attr !== "__all")
        .map(attr => {
        if (attr === "__id") {
          if (subKey.exactMatch === true) {
            return `has(id,"${escapedSearchTerm}")`;
          }
          return `has(id,containing("${escapedSearchTerm}"))`;
        }
        if (subKey.exactMatch === true) {
          return `has("${attr}","${escapedSearchTerm}")`;
        }
        return `has("${attr}",TextP.regex("(?i)${escapedSearchTerm}."))`;
      })
      .join(",");
      template += `${multiContent}`;
    });
    //template += `${fullSearch})`

  template += `.range(${firstSearch.offset},${firstSearch.offset + firstSearch.limit})`;
  console.log(template)
  //return template;
  return `g.V().hasLabel("drug").range(0,10)`
};

export default multiKeywordSearchTemplate;
