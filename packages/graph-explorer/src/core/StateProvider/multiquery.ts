import { atom } from "recoil";

export const multiQueryAtom = atom<Set<Object>>({
    key: "multi-query-atom",
    default: new Set(), 
});