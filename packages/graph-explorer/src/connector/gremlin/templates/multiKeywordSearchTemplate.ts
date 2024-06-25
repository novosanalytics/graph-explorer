import uniq from "lodash/uniq";
import type {KeywordSearchRequest, MultiKeywordSearchRequest } from "../../useGEFetchTypes";
import { escapeString } from "../../../utils";


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
    multiKeywordSearch: MultiKeywordSearchRequest | any): string => {
    const mksqs = multiKeywordSearch.multiKeywordSearch;
    let template = "g.V()";
    let firstSearch = mksqs[0];
    if (firstSearch.vertexTypes) { 
        //Adjust this later for _all option
        /*const hasLabelContent = firstSearch.vertexTypes
            .flatMap(type => type.split("::"))
            .map(type => `"${type}"`)
            .join(",");*/
        const  hasLabelContent = firstSearch.vertexTypes;
        template += `.hasLabel("${hasLabelContent}")`;
    }
    multiKeywordSearch.clusiver ? template += `.or(` : template += `.and(`;
    mksqs.forEach((subKey: KeywordSearchRequest) => {
        const escapedSearchTerm = escapeString(subKey.searchTerm)

        let multiContent = ``;
        if (subKey.searchByAttributes === "__id") {
            if (subKey.exactMatch === true) {
              multiContent += `has(id,"${escapedSearchTerm}")`;
            }
            multiContent += `has(id,containing("${escapedSearchTerm}"))`;
          }
          if (subKey.exactMatch === true) {
            multiContent += `has("${subKey.searchByAttributes}","${escapedSearchTerm}")`;
          } else {
            multiContent += `has("${subKey.searchByAttributes}",TextP.regex("(?i)${escapedSearchTerm}."))`
        };
        /*const multiContent = uniq(
        subKey.searchByAttributes.includes("__all")
            ? ["__id", ...subKey.searchByAttributes]
            : subKey.searchByAttributes
        )*/ // Find a way to use the uniq
        //`has("${subKey.searchByAttributes}","${subKey.searchTerm}")`
        /*(subKey.searchByAttributes.includes("__all")
        ? ["__id", ...subKey.searchByAttributes]
        : subKey.searchByAttributes)

        multiContent += 
        .filter((attr: string) => attr !== "__all")
        .map((attr: string) => {
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
      .join(",");*/
      console.log(multiContent);
      template += `${multiContent},`;
    });
    template = template.substring(0, template.length -1)  + `)`;
    
    //template += `${fullSearch})`

  template += `.range(${firstSearch.offset},${firstSearch.offset + firstSearch.limit})`;
  console.log(`Template: ${template}`)
  return template;
};

export default multiKeywordSearchTemplate;
