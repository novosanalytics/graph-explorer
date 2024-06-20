import { atom, selector} from "recoil";
import type { SubQuery } from "../../@types/subqueries";
import { KeywordSearchResponse } from "../../connector/useGEFetchTypes";
import isDefaultValue from "./isDefaultValue";
import { Vertex } from "../../@types/entities";

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
    default: {
        vertices:[],
    }
})

export const multiQuerySelector = selector<Array<Vertex>>({
    key: "multi-query-selector",
    get:({ get }) =>{
        return get(multiQueriesResultAtom);
    },
    set: ({ get, set }, newValue) =>{
        if (isDefaultValue(newValue)) {
            set(multiQueriesResultAtom, newValue);
            return;
        }
    }
})


/*export const subQuerySelector = selector<Array<SubQuery>>({
    key: "sub-query-selector",
    get: ({ get }) => {
        return get(subQueriesAtom);
    }
});*/