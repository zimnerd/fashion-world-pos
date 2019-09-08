import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "axios";
import toastr from "toastr";
import $ from "jquery";

import * as modalActions from "../../../redux/actions/modal.action";
import * as tillActions from "../../../redux/actions/till.action";
import * as stockActions from "../../../redux/actions/stock.action";
import * as settingsActions from "../../../redux/actions/settings.action";
import * as authActions from "../../../redux/actions/auth.action";

import './Till.scss';

import ActionBar from "./ActionBar";
import Alerts from "./Alerts";
import ReturnsModal from "./modals/ReturnsModal";
import OtherModal from "./modals/OtherModal";
import SalesOptionsModal from "./modals/SalesOptionsModal";
import CompleteSaleModal from "./modals/CompleteSaleModal";
import CreditNoteOptionsModal from "./modals/CreditNoteOptionsModal";
import PaymentOptionsModal from "./modals/PaymentOptionsModal";
import ProductStyleModal from "./modals/ProductStyleModal";
import AuthenticationModal from "./modals/AuthenticationModal";
import Header from "../Header";
import Totals from "./Totals";
import LineItems from "./LineItems";
import TransactionBadges from "./TransactionBadges";
import InformationBar from "./InformationBar";
import CashModal from "./modals/CashModal";
import CardModal from "./modals/CardModal";
import TransactionId from "./modals/TransactionId";
import RetrieveHeldModal from "./modals/RetrieveHeldModal";
import ComboModal from "./modals/ComboModal";
import RefundModal from "./modals/RefundModal";
import RefundDetailsModal from "./modals/RefundDetailsModal";
import CompleteRefund from "./modals/CompleteRefund";
import CompleteExchange from "./modals/CompleteExchange";
import TransactionCompleteModal from "./modals/TransactionCompleteModal";
import RefundReasonModal from "./modals/RefundReasonModal";
import DebtorModal from "./modals/DebtorModal";
import LayByeCreditorModal from "./modals/LayByeCreditorModal";
import ReceiptsModal from "./modals/ReceiptsModal";
import ReceiptsPaymentModal from "./modals/receipts/ReceiptsPaymentModal";
import ExchangeInvoiceSearch from "./modals/ExchangeInvoiceSearch";

class Till extends React.Component {

    state = {
        code: ""
    };

    constructor(props) {
        super(props);
        this.props.actions.till.setTransactions();
        this.props.actions.till.setCombos();
        this.props.actions.auth.setAuth();
    }

    componentDidMount = () => {
        document.addEventListener("keydown", this.keydownFunction, false);

        this.props.actions.till.resetTotals();
        this.retrieveHaddiths();
        this.retrieveBranchCodes();
        this.retrieveSalesmen();
    };


    retrieveSalesmen = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/salesmen`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Salesmen retrieved!", "Retrieve Salesmen");
                this.props.actions.till.setSalesmen(response.data.salesmen);
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("No salesmen could be found.", "Retrieve Salesmen");
                    this.props.actions.till.setSalesmen();
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    retrieveBranchCodes = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/settings/branches`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Branch codes retrieved!", "Retrieve Branch Codes");
                this.props.actions.settings.retrieveBranchCodes(response.data.branches);
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("No branch codes could be found.", "Retrieve Branch Codes");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    retrieveHaddiths = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/settings/haddith`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Haddith retrieved!", "Retrieve Haddith");
                this.props.actions.settings.retrieveHaddith(response.data.haddith);
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("The product code supplied cannot be found.", "Retrieve Product");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.keydownFunction, false);
    };

    keydownFunction = event => {
        this.openModal(event);
    };

    mapLineItem = transaction => {
        let totals = this.props.till.totals;

        const discount = transaction.price - transaction.total;
        const subtotal = transaction.total / (100 + this.props.settings.tax) * 100;
        const vat = transaction.total - subtotal;

        totals.total += Number(Number(transaction.total).toFixed(2));
        totals.discount += discount;
        totals.vat += vat;
        totals.subtotal += subtotal;

        this.props.actions.till.setTotals(totals);
    };

    mapHeldItems = (transaction, totals) => {
        const discount = transaction.price - transaction.total;
        const subtotal = transaction.total / (100 + this.props.settings.tax) * 100;
        const vat = transaction.total - subtotal;

        totals.total += Number(Number(transaction.total).toFixed(2));
        totals.discount += discount;
        totals.vat += vat;
        totals.subtotal += subtotal;

        return totals;
    };

    openModal = (event) => {
        switch (event.keyCode) {
            case 113:
                if (event.preventDefault) {
                    event.preventDefault();
                }

                $('#product-code-line').focus();
                break;
            case 114:
                if (event.preventDefault) {
                    event.preventDefault();
                }

                if (this.props.till.exchange) {
                    toastr.error('You are not allowed to complete a sale on an exchange!', 'Invalid Action');
                    return;
                }

                if (this.props.till.refund) {
                    toastr.error('You are not allowed to complete a sale on an refund!', 'Invalid Action');
                    return;
                }

                this.props.actions.modal.openCompleteSale();
                $('#salesmen').focus();
                break;
            case 115:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openCredit();
                break;
            case 119:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openPayments();
                break;
            case 120:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openSales();
                break;
            case 121:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openReceiptsModal();
                break;
            case 122:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openReturns();
                break;
            case 123:
                if (event.preventDefault) {
                    event.preventDefault();
                }
                this.props.actions.modal.openOthers();
                break;
            default:
                return;
        }
    };

    openStyles = code => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/products/${code}`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Product Retrieved!", "Retrieve Product");
                this.props.actions.stock.retrieveProduct(response.data.product);
                this.props.actions.modal.openProductStyles();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("The product code supplied cannot be found.", "Retrieve Product");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    mapTransactions = () => {
        if (typeof this.props.till.transactions === "undefined") {
            return;
        }

        let comboIndex = -1;
        for (let x = 0, len = this.props.till.transactions.length; x < len; x++) {
            let transaction = this.props.till.transactions[x];
            transaction.markdown = transaction.mdp > 0;

            if (this.props.till.staff) {
                transaction.price = transaction.retail;
                transaction.subtotal = transaction.price * transaction.qty;
                transaction.discStore = transaction.disc;
                transaction.isStaff = true;

                if (transaction.markdown) {
                    transaction.disc = (transaction.mdp / transaction.retail * 100).toFixed(2);
                } else {
                    transaction.price = transaction.staff;
                    transaction.subtotal = transaction.price * transaction.qty;
                    transaction.disc = 0.00;
                }

                if (typeof transaction.discStore !== "undefined") {
                    transaction.disc = transaction.discStore;
                    delete transaction.discStore;
                }
                transaction.total = transaction.disc > 0 ? transaction.subtotal * transaction.disc / 100 : transaction.subtotal;
            } else {
                transaction.combo = false;
                transaction.isStaff = false;

                if (transaction.markdown) {
                    transaction.price = transaction.mdp;
                    transaction.disc = (transaction.mdp / (transaction.retail ? transaction.retail : transaction.price)
                    * 100).toFixed(2);
                } else {
                    transaction.price = transaction.retail ? transaction.retail : transaction.price;
                    transaction.disc = 0.00;
                }

                let comboFromList = this.props.till.combos.find(combo => combo.style === transaction.code && !transaction.hold);
                if (comboFromList) {
                    if (comboIndex !== -1) {
                        let oldTran = this.props.till.transactions[comboIndex];
                        oldTran.price = comboFromList.rp;
                        oldTran.markdown = false;
                        oldTran.combo = true;
                        oldTran.discStore = oldTran.disc;
                        oldTran.disc = 0.00;
                        oldTran.subtotal = oldTran.price * oldTran.qty;
                        oldTran.total = oldTran.subtotal;

                        transaction.price = comboFromList.rp;
                        transaction.markdown = false;
                        transaction.combo = true;
                        transaction.disc = 0.00;
                        comboIndex = -1;
                    } else {
                        comboIndex = x;
                    }
                    transaction.subtotal = transaction.price * transaction.qty;
                    transaction.total = transaction.subtotal;
                } else {
                    transaction.price = transaction.retail ? transaction.retail : transaction.price;
                    transaction.subtotal = transaction.price * transaction.qty;

                    if (typeof transaction.discStore !== "undefined") {
                        transaction.disc = transaction.discStore;
                        delete transaction.discStore;
                    }
                    transaction.total = transaction.disc > 0 ? transaction.subtotal * transaction.disc / 100 : transaction.subtotal;
                }
            }
        }

        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0,
            items: 0
        };
        for (let transaction of this.props.till.transactions) {
            transaction.price = Number(transaction.price).toFixed(2);
            if (transaction.hold) {
                continue;
            }

            this.mapHeldItems(transaction, totals);
            totals.items++;
        }

        this.props.actions.till.setTotals(totals);
        this.props.actions.till.setTransactions(this.props.till.transactions);
    };

    retrieveCombo = (code) => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/products/${code}/combos`, { headers })
            .then(response => {
                console.log(response.data);
                toastr.info("Combos Found!", "Find Combo");

                let combo = this.props.till.combos.find(combo => combo.style === code);
                if (!combo) {
                    this.props.till.combos = this.props.till.combos.concat(response.data.combo);
                    this.props.actions.till.setCombos(this.props.till.combos);
                }
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    console.log("No combos found");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    createTransaction = product => {
        const markdown = product.mdp > 0;
        const disc = markdown ? product.mdp / product.rp * 100 : 0;

        let transaction = {
            code: product.code,
            description: product.descr,
            size: product.codeKey,
            colour: product.colour,
            clrcode: product.clrcode,
            price: Number(product.rp).toFixed(2),
            mdp: product.mdp,
            qty: 1,
            disc: disc.toFixed(2),
            markdown: markdown,
            cost: product.sp,
            staff: Number(product.stfp),
            retail: Number(product.rp),
            serialNo: product.serialno
        };

        transaction.subtotal = transaction.price * transaction.qty;
        transaction.total = transaction.disc > 0 ? transaction.subtotal * transaction.disc / 100 : transaction.subtotal;

        let items = this.props.till.transactions;
        if (typeof items === "undefined") {
            items = [];
        }

        items.unshift(transaction);
        this.mapLineItem(transaction);

        this.props.actions.till.setTransactions(items);
    };

    render() {
        return (
            <article>
                <Header/>
                <main className="d-flex till">
                    <div className="col-4">
                        <section className="widget text-center m-0 pt-0">
                            <img src="/assets/logo_plain.png" alt="Till Logo"/>
                        </section>
                        <InformationBar/>
                    </div>
                    <LineItems mapLineItem={this.mapLineItem} mapTransactions={this.mapTransactions}
                               openStyles={this.openStyles} retrieveCombo={this.retrieveCombo} mapHeldItem={this.mapHeldItems}
                               createTransaction={this.createTransaction}/>
                    <div className="col-2">
                        {(this.props.till.laybye || this.props.till.refund || this.props.till.exchange
                        || this.props.till.staff || this.props.till.credit || this.props.till.returns) &&
                        <TransactionBadges mapTransactions={this.mapTransactions}/>
                        }
                        <Totals openModal={this.openModal}/>
                        <ActionBar openModal={this.openModal}/>
                    </div>
                </main>
                <footer className="till-text w-100">
                    <span>Till number {this.props.settings.number} logged in as {this.props.user.username}</span>
                </footer>

                <CashModal mapLineItem={this.mapHeldItems}/>
                <CardModal mapLineItem={this.mapHeldItems}/>

                <AuthenticationModal mapTransactions={this.mapTransactions}/>
                <ProductStyleModal mapLineItem={this.mapLineItem} retrieveCombo={this.retrieveCombo}
                                   mapTransactions={this.mapTransactions}/>
                <CompleteSaleModal mapLineItem={this.mapHeldItems}/>
                <SalesOptionsModal/>
                <CreditNoteOptionsModal/>
                <ReturnsModal/>
                <OtherModal/>
                <PaymentOptionsModal/>
                <TransactionId/>
                <RetrieveHeldModal mapHeldItems={this.mapHeldItems}/>
                <ComboModal/>
                <RefundModal mapLineItem={this.mapHeldItems}/>
                <RefundDetailsModal/>
                <CompleteRefund mapLineItem={this.mapHeldItems}/>
                <CompleteExchange mapLineItem={this.mapHeldItems}/>
                <TransactionCompleteModal/>
                <RefundReasonModal/>
                <DebtorModal/>
                <LayByeCreditorModal mapLineItem={this.mapHeldItems}/>
                <ReceiptsModal/>
                <ReceiptsPaymentModal/>
                <ExchangeInvoiceSearch mapLineItem={this.mapHeldItems}/>
            </article>
        )
    }

}

function mapStateToProps(state) {
    return {
        user: state.user,
        till: state.till,
        auth: state.auth,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            settings: bindActionCreators(settingsActions, dispatch),
            stock: bindActionCreators(stockActions, dispatch),
            auth: bindActionCreators(authActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Till);
