import {
    CLOSE_AUTH_MODAL,
    CLOSE_CARD_MODAL,
    CLOSE_CASH_MODAL,
    CLOSE_COMBO_MODAL,
    CLOSE_COMPLETE_EXCHANGE_MODAL,
    CLOSE_COMPLETE_REFUND_MODAL,
    CLOSE_COMPLETE_SALE_MODAL,
    CLOSE_CREDIT_MODAL,
    CLOSE_DEBTOR_MODAL,
    CLOSE_DEBTOR_RECEIPTS, CLOSE_EXCHANGE_SEARCH,
    CLOSE_LAY_BYE_CREDITOR,
    CLOSE_OTHERS_MODAL,
    CLOSE_PAYMENTS_MODAL,
    CLOSE_PRODUCT_STYLE_MODAL,
    CLOSE_REASON_MODAL,
    CLOSE_RECEIPTS_MODAL,
    CLOSE_REFUND_DETAILS_MODAL,
    CLOSE_REFUND_MODAL,
    CLOSE_RETRIEVE_HELD_MODAL,
    CLOSE_RETURNS_MODAL,
    CLOSE_SALES_MODAL,
    CLOSE_TRANSACTION_COMPLETE,
    CLOSE_TRANSACTION_MODAL,
    OPEN_AUTH_MODAL,
    OPEN_CARD_MODAL,
    OPEN_CASH_MODAL,
    OPEN_COMBO_MODAL,
    OPEN_COMPLETE_EXCHANGE_MODAL,
    OPEN_COMPLETE_REFUND_MODAL,
    OPEN_COMPLETE_SALE_MODAL,
    OPEN_CREDIT_MODAL,
    OPEN_DEBTOR_MODAL,
    OPEN_DEBTOR_RECEIPTS, OPEN_EXCHANGE_SEARCH,
    OPEN_LAY_BYE_CREDITOR,
    OPEN_OTHERS_MODAL,
    OPEN_PAYMENTS_MODAL,
    OPEN_PRODUCT_STYLE_MODAL,
    OPEN_REASON_MODAL,
    OPEN_RECEIPTS_MODAL,
    OPEN_REFUND_DETAILS_MODAL,
    OPEN_REFUND_MODAL,
    OPEN_RETRIEVE_HELD_MODAL,
    OPEN_RETURNS_MODAL,
    OPEN_SALES_MODAL,
    OPEN_TRANSACTION_COMPLETE,
    OPEN_TRANSACTION_MODAL
} from "../constants/modal.constants";

export function openCompleteSale(complete = true) {
    return { type: OPEN_COMPLETE_SALE_MODAL, complete }
}

export function closeCompleteSale(complete = false) {
    return { type: CLOSE_COMPLETE_SALE_MODAL, complete }
}

export function openReturns(returns = true) {
    return { type: OPEN_RETURNS_MODAL, returns }
}

export function closeReturns(returns = false) {
    return { type: CLOSE_RETURNS_MODAL, returns }
}

export function openSales(sales = true) {
    return { type: OPEN_SALES_MODAL, sales }
}

export function closeSales(sales = false) {
    return { type: CLOSE_SALES_MODAL, sales }
}

export function openCredit(credit = true) {
    return { type: OPEN_CREDIT_MODAL, credit }
}

export function closeCredit(credit = false) {
    return { type: CLOSE_CREDIT_MODAL, credit }
}

export function openPayments(payments = true) {
    return { type: OPEN_PAYMENTS_MODAL, payments }
}

export function closePayments(payments = false) {
    return { type: CLOSE_PAYMENTS_MODAL, payments }
}

export function openProductStyles(styles = true) {
    return { type: OPEN_PRODUCT_STYLE_MODAL, styles }
}

export function closeProductStyles(styles = false) {
    return { type: CLOSE_PRODUCT_STYLE_MODAL, styles }
}

export function openAuthentication(auth = true) {
    return { type: OPEN_AUTH_MODAL, auth }
}

export function closeAuthentication(auth = false) {
    return { type: CLOSE_AUTH_MODAL, auth }
}

export function openOthers(others = true) {
    return { type: OPEN_OTHERS_MODAL, others }
}

export function closeOthers(others = false) {
    return { type: CLOSE_OTHERS_MODAL, others }
}

export function openCash(cash = true) {
    return { type: OPEN_CASH_MODAL, cash }
}

export function closeCash(cash = false) {
    return { type: CLOSE_CASH_MODAL, cash }
}

export function openCard(card = true) {
    return { type: OPEN_CARD_MODAL, card }
}

export function closeCard(card = false) {
    return { type: CLOSE_CARD_MODAL, card }
}

export function openTransaction(transaction = true) {
    return { type: OPEN_TRANSACTION_MODAL, transaction }
}

export function closeTransaction(transaction = false) {
    return { type: CLOSE_TRANSACTION_MODAL, transaction }
}

export function openRetrieveHeld(retrieveHeld = true) {
    return { type: OPEN_RETRIEVE_HELD_MODAL, retrieveHeld }
}

export function closeRetrieveHeld(retrieveHeld = false) {
    return { type: CLOSE_RETRIEVE_HELD_MODAL, retrieveHeld }
}

export function openCombo(combo = true) {
    return { type: OPEN_COMBO_MODAL, combo }
}

export function closeCombo(combo = false) {
    return { type: CLOSE_COMBO_MODAL, combo }
}

export function openRefund(refund = true) {
    return { type: OPEN_REFUND_MODAL, refund }
}

export function closeRefund(refund = false) {
    return { type: CLOSE_REFUND_MODAL, refund }
}

export function openRefundDetails(refundDetails = true) {
    return { type: OPEN_REFUND_DETAILS_MODAL, refundDetails }
}

export function closeRefundDetails(refundDetails = false) {
    return { type: CLOSE_REFUND_DETAILS_MODAL, refundDetails }
}

export function openCompleteRefund(refundComplete = true) {
    return { type: OPEN_COMPLETE_REFUND_MODAL, refundComplete }
}

export function closeCompleteRefund(refundComplete = false) {
    return { type: CLOSE_COMPLETE_REFUND_MODAL, refundComplete }
}

export function openCompleteExchange(exchangeComplete = true) {
    return { type: OPEN_COMPLETE_EXCHANGE_MODAL, exchangeComplete }
}

export function closeCompleteExchange(exchangeComplete = false) {
    return { type: CLOSE_COMPLETE_EXCHANGE_MODAL, exchangeComplete }
}

export function openTransactionComplete(transactionComplete = true) {
    return { type: OPEN_TRANSACTION_COMPLETE, transactionComplete }
}

export function closeTransactionComplete(transactionComplete = false) {
    return { type: CLOSE_TRANSACTION_COMPLETE, transactionComplete }
}

export function openReasonModal(refundReason = true) {
    return { type: OPEN_REASON_MODAL, refundReason }
}

export function closeReasonModal(refundReason = false) {
    return { type: CLOSE_REASON_MODAL, refundReason }
}

export function openDebtorModal(debtor = true) {
    return { type: OPEN_DEBTOR_MODAL, debtor }
}

export function closeDebtorModal(debtor = false) {
    return { type: CLOSE_DEBTOR_MODAL, debtor }
}

export function openLayByeCreditor(creditor = true) {
    return { type: OPEN_LAY_BYE_CREDITOR, creditor }
}

export function closeLayByeCreditor(creditor = false) {
    return { type: CLOSE_LAY_BYE_CREDITOR, creditor }
}

export function openReceiptsModal(receipts = true) {
    return { type: OPEN_RECEIPTS_MODAL, receipts }
}

export function closeReceiptsModal(receipts = false) {
    return { type: CLOSE_RECEIPTS_MODAL, receipts }
}

export function openDebtorReceipts(debtorReceipts = true) {
    return { type: OPEN_DEBTOR_RECEIPTS, debtorReceipts }
}

export function closeDebtorReceipts(debtorReceipts = false) {
    return { type: CLOSE_DEBTOR_RECEIPTS, debtorReceipts }
}

export function openExchangeSearch(exchangeSearch = true) {
    return { type: OPEN_EXCHANGE_SEARCH, exchangeSearch }
}

export function closeExchangeSearch(exchangeSearch = false) {
    return { type: CLOSE_EXCHANGE_SEARCH, exchangeSearch }
}
