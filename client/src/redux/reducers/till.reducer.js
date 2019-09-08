import {
    ACTIVATE_CREDIT,
    ACTIVATE_EXCHANGE,
    ACTIVATE_LAY_BYE,
    ACTIVATE_REFUND,
    ACTIVATE_RETURNS,
    ACTIVATE_STAFF,
    DEACTIVATE_CREDIT,
    DEACTIVATE_EXCHANGE,
    DEACTIVATE_LAY_BYE,
    DEACTIVATE_REFUND,
    DEACTIVATE_RETURNS,
    DEACTIVATE_STAFF,
    NEXT_DEBTOR,
    RESET_COMPLETED_TRANSACTION,
    RESET_TOTALS,
    RESET_TRANSACTIONS,
    RETRIEVE_DEBTORS,
    SET_AUTH_COMMAND,
    SET_CODE,
    SET_COMBOS,
    SET_COMPLETED_TRANSACTION,
    SET_DEBTOR, SET_NOT_FOUND,
    SET_REFUND,
    SET_SALES,
    SET_SALESMEN,
    SET_TOTALS,
    SET_TRANSACTION_ID,
    SET_TRANSACTIONS,
    VALIDATION_ERROR
} from "../constants/till.constants";

export default function tillReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case ACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case DEACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case SET_TRANSACTIONS:
            return { ...state, transactions: action.transactions };
        case ACTIVATE_RETURNS:
            return { ...state, ...action.returns };
        case DEACTIVATE_RETURNS:
            return { ...state, returns: action.returns };
        case SET_TOTALS:
            return { ...state, totals: action.totals };
        case RESET_TOTALS:
            return { ...state, totals: action.totals };
        case RESET_TRANSACTIONS:
            return { ...state, transactions: action.transactions };
        case SET_TRANSACTION_ID:
            return { ...state, held: action.held };
        case SET_AUTH_COMMAND:
            return { ...state, command: action.command };
        case ACTIVATE_EXCHANGE:
            return { ...state, exchange: action.exchange };
        case DEACTIVATE_EXCHANGE:
            return { ...state, exchange: action.exchange };
        case ACTIVATE_STAFF:
            return { ...state, staff: action.staff };
        case DEACTIVATE_STAFF:
            return { ...state, staff: action.staff };
        case SET_CODE:
            return { ...state, code: action.code };
        case SET_COMBOS:
            return { ...state, combos: action.combos };
        case VALIDATION_ERROR:
            return { ...state, errors: action.errors };
        case ACTIVATE_REFUND:
            return { ...state, refund: action.refund };
        case DEACTIVATE_REFUND:
            return { ...state, refund: action.refund };
        case SET_REFUND:
            return { ...state, refundData: action.refundData };
        case SET_COMPLETED_TRANSACTION:
            return { ...state, completedTransaction: action.completedTransaction };
        case ACTIVATE_CREDIT:
            return { ...state, credit: action.credit };
        case DEACTIVATE_CREDIT:
            return { ...state, credit: action.credit };
        case RETRIEVE_DEBTORS:
            return { ...state, debtors: action.debtors };
        case SET_DEBTOR:
            return { ...state, debtor: action.debtor };
        case NEXT_DEBTOR:
            return { ...state, next: action.next };
        case SET_SALES:
            return { ...state, sales: action.sales };
        case SET_SALESMEN:
            return { ...state, salesmen: action.salesmen };
        case SET_NOT_FOUND:
            debugger
            return { ...state, notFound: action.notFound };
        default:
            return state;
    }
}
