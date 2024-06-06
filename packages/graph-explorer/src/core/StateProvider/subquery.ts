import { atom, selector} from "recoil";
import type { SubQuery } from "../../@types/subqueries";

export const subQueriesAtom = atom<Set<SubQuery>>({
    key: "sub-queries",
    default: new Set()
});

/*export const subQuerySelector = selector<Array<SubQuery>>({
    key: "sub-query-selector",
    get: ({ get }) => {
        return get(subQueriesAtom);
    }
});*/