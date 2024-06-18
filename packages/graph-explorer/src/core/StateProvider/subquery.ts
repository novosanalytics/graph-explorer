import { atom, selector} from "recoil";
import type { SubQuery } from "../../@types/subqueries";
import { KeywordSearchResponse } from "../../connector/useGEFetchTypes";

export const subQueriesAtom = atom<Set<SubQuery>>({
    key: "sub-queries",
    default: new Set()
});

export const queryTriggerAtom = atom({
    key: 'queryTrigger',
    default: false,
});

export const multiQueriesResultAtom = atom<KeywordSearchResponse | any>({
    key: "sub-queries-result",
})

/*export const subQuerySelector = selector<Array<SubQuery>>({
    key: "sub-query-selector",
    get: ({ get }) => {
        return get(subQueriesAtom);
    }
});*/