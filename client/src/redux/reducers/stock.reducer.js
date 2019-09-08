import { RETRIEVE_PRODUCT, RETRIEVE_PRODUCTS } from "../constants/stock.constants";

export default function stockReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case RETRIEVE_PRODUCTS:
            return { ...state, page: action.page };
        case RETRIEVE_PRODUCT:
            return { ...state, product: action.product };
        default:
            return state;
    }
}
