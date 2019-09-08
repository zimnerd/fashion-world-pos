import { RETRIEVE_PRODUCT, RETRIEVE_PRODUCTS } from "../constants/stock.constants";

export function retrieveProducts(page = {}) {
    return { type: RETRIEVE_PRODUCTS, page }
}

export function retrieveProduct(product = {}) {
    return { type: RETRIEVE_PRODUCT, product }
}
