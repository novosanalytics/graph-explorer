import { atom } from "recoil";
import mapDateStr from "../../connector/gremlin/mappers/mapDateStr";

const now = new Date()


export const overDateAtom = atom<string>({
    key: "over-date-string",
    default: mapDateStr(now.toLocaleDateString())
});