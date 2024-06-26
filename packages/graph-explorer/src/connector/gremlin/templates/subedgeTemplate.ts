/**
 * Creates a pseudo-subgraph and allows for interaction with the subgraph in other templates
 */
import { forEach } from "lodash";
import { SubGraphRequest } from "../../useGEFetchTypes";
import mapDateStr from "../mappers/mapDateStr";


const subgraphTemplate = ({
    date = "string", 
    canV,
    canE,
}: SubGraphRequest): string => {
    let eString = `(`;
    if(canE.length <= 0){
        return ""
    }
    canE.forEach(function (edge){
        eString += `"${edge.data.id}",`
    })
    eString = eString.substring(0, eString.length - 1)
    eString += ")"
    console.log(eString)
    /**
     *  This is is going to do a filter for EVERY edge/node for Record_Active_Date-ish
     * 
     * */

    let createSubGraph = `g.E${eString}`;
    //createSubGraph += `has("Drug_Record_Active_Date__c", lte("${mapDateStr(date)}")),`;
    //createSubGraph += `has("Drug_Record_Expiration_Date__c", gte("${mapDateStr(date)}"))`;
    
    let edges = []
    for (let i = 1; i <= 10; i++) {
        let edgeFilter = `and(`;
        edgeFilter += `has("J${i}_Record_Active_Date__c", lte("${mapDateStr(date)}"))`;
        edgeFilter += `, has("J${i}_Record_Expiration_Date__c", gte("${mapDateStr(date)}"))`;
        edgeFilter +=  `)`
        edges.push(edgeFilter)
    }

    let netPart = `and(`;
        netPart += `has("Network_Participation_Record_Active_Da__c", lte("${mapDateStr(date)}"))`;
        netPart += `, has("Network_Participation_Record_Expiratio__c", gte("${mapDateStr(date)}"))`;
        netPart +=  `)`
        edges.push(netPart)

    let cliDruPart = `and(`;
        cliDruPart += `has("Drug_Record_Active_Date__c", lte("${mapDateStr(date)}"))`;
        cliDruPart += `, has("Drug_Record_Expiration_Date__c", gte("${mapDateStr(date)}"))`;
        cliDruPart +=  `)`
        edges.push(cliDruPart) 

    let cliCamPart = `and(`;
        cliCamPart += `has("Campaign_Record_Active_Date__c", lte("${mapDateStr(date)}"))`;
        cliCamPart += `, has("Campaign_Record_Expiration_Date__c", gte("${mapDateStr(date)}"))`;
        cliCamPart +=  `)`
        edges.push(cliCamPart) 

    let cliNetPart = `and(`;
        cliNetPart += `has("Benefit_Net_Rate_Record_Active_Date__c", lte("${mapDateStr(date)}"))`;
        cliNetPart += `, has("Benefit_Net_Rate_Record_Expiration_Dat__c", gte("${mapDateStr(date)}"))`;
        cliNetPart +=  `)`
        edges.push(cliNetPart)
        
    let offCCPart = `and(`;
        offCCPart += `has("Offer_Record_Active_Date__c", lte("${mapDateStr(date)}"))`;
        offCCPart += `, has("Offer_Record_Expiration_Date__c", gte("${mapDateStr(date)}"))`;
        offCCPart +=  `)`
        edges.push(offCCPart)

    let worRatPart = `and(`;
        worRatPart += `has("Network_Record_Active_Date__c", lte("${mapDateStr(date)}"))`;
        worRatPart += `, has("Network_Record_Expiration_Date__c", gte("${mapDateStr(date)}"))`;
        worRatPart +=  `)`
        edges.push(worRatPart) 
    
        
    let filters: string = edges.join(",")

    createSubGraph += `.or(${filters})`
    //createSubGraph += ".dedup().bothV().fold()";
    console.log(createSubGraph)

    return createSubGraph;
};

export default subgraphTemplate