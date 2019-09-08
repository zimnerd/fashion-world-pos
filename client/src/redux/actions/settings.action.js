import {
    RETRIEVE_BRANCHES,
    RETRIEVE_HADDITH,
    RETRIEVE_REASONS,
    RETRIEVE_SHOP_DETAILS, RETRIEVE_TAX,
    RETRIEVE_TILL_CONTROLS,
    RETRIEVE_TILL_DETAILS,
    RETRIEVE_TILL_NUMBER,
    SAVE_TILL_DETAILS,
    RETRIEVE_TILLS,
    SET_COMBOS
} from "../constants/settings.constants";

export function retrieveShop(shop = {}) {
    return { type: RETRIEVE_SHOP_DETAILS, shop };
}

export function retrieveTill(till = {}) {
    return { type: RETRIEVE_TILL_DETAILS, till };
}

export function saveTill(till = {}) {
    return { type: SAVE_TILL_DETAILS, till };
}

export function retrieveHaddith(haddith = {}) {
    return { type: RETRIEVE_HADDITH, haddith };
}

export function setCombos(combos = []) {
    return { type: SET_COMBOS, combos };
}

export function retrieveReasons(reasons = []) {
    return { type: RETRIEVE_REASONS, reasons };
}

export function retrieveTillNumber(number = []) {
    return { type: RETRIEVE_TILL_NUMBER, number };
}

export function retrieveTillControls(controls = {}) {
    return { type: RETRIEVE_TILL_CONTROLS, controls };
}

export function retrieveBranchCodes(codes = {}) {
    return { type: RETRIEVE_BRANCHES, codes };
}

export function retrieveTills(tills = {}) {
    return { type: RETRIEVE_TILLS, tills };
}
export function retrieveTax(tax = "15") {
    return { type: RETRIEVE_TAX, tax };
}
