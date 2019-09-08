import {
    RETRIEVE_BRANCHES,
    RETRIEVE_HADDITH,
    RETRIEVE_REASONS,
    RETRIEVE_SHOP_DETAILS,
    RETRIEVE_TAX,
    RETRIEVE_TILL_CONTROLS,
    RETRIEVE_TILL_DETAILS,
    RETRIEVE_TILL_NUMBER,
    SAVE_TILL_DETAILS,
    SET_COMBOS
} from "../constants/settings.constants";

export default function settingsReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case RETRIEVE_SHOP_DETAILS:
            return { ...state, shop: action.shop };
        case RETRIEVE_TILL_DETAILS:
            return { ...state, till: action.till };
        case SAVE_TILL_DETAILS:
            return { ...state, till: action.till };
        case RETRIEVE_HADDITH:
            return { ...state, haddith: action.haddith };
        case SET_COMBOS:
            return { ...state, combos: action.combos };
        case RETRIEVE_REASONS:
            return { ...state, reasons: action.reasons };
        case RETRIEVE_TILL_NUMBER:
            return { ...state, number: action.number };
        case RETRIEVE_TILL_CONTROLS:
            return { ...state, controls: action.controls };
        case RETRIEVE_BRANCHES:
            return { ...state, codes: action.codes };
        case RETRIEVE_TAX:
            return { ...state, tax: action.tax };
        default:
            return state;
    }
}
