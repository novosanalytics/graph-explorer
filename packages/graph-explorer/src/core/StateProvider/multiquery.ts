import { atom, selector} from "recoil";
import type { SubQuery } from "../../@types/subqueries";

export const subQueriesAtom = atom<Array<SubQuery>>({
    key: "multi-queries",
    default: [],
});

export const subQuerySelector = selector<Array<SubQuery>>({
    key: "multi-query-selector",
});



