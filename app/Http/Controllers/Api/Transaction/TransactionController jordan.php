<?php

namespace App\Http\Controllers\Api\Transaction;

use App\Airtime;
use App\Branch;
use App\Colours;
use App\DailyControl;
use App\DailySummary;
use App\DailyTransaction;
use App\Debtor;
use App\DebtorTransaction;
use App\Handset;
use App\Http\Controllers\Controller;
use App\Laybye;
use App\LaybyeTransaction;
use App\Models\Transaction\StockTransaction;
use App\Person;
use App\Product;
use App\Refund;
use App\Shop;
use App\Stock;
use App\Summary;
use App\Tax;
use App\Till;
use App\TradeSummary;
use App\Transaction;
use App\User;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class TransactionController extends Controller
{
    public $successStatus = 200;
    public $createdStatus = 201;
    public $notFoundStatus = 404;
    public $validationStatus = 422;
    public $errorStatus = 500;

    /**
     * Create a transaction
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createTransaction(Request $request)
    {
        $transaction = $request->all();
        if ($transaction["type"] === "L/B") {
            $this->validate($request, [
                'shop' => 'required',
                'till' => 'required',
                'transactions' => 'required',
                'totals' => 'required',
                'person.name' => 'required',
                'person.email' => 'nullable | email',
                'person.cell' => 'required | max:10 | min:10',
                'person.idNo' => 'required'
            ]);
        } else {
            $this->validate($request, [
                'shop' => 'required',
                'till' => 'required',
                'transactions' => 'required',
                'totals' => 'required',
                'person.email' => 'nullable | email',
                'person.cell' => 'nullable | max:10 | min:10'
            ]);
        }

        try {
            DB::beginTransaction();

            $shop = $transaction["shop"];
            /**
             * @var Till $till
             */
            $till = $transaction["till"];
            /**
             * @var DailyTransaction[] $transaction
             */
            $lineItems = $transaction["transactions"];
            $totals = $transaction["totals"];

            $nextLb = false;
            if (isset($shop['oneLaybyeNo']) && $shop['oneLaybyeNo'] === "Yes") {
                $nextLb = true;
            }

            /**
             * @var User $user
             */
            $user = Auth::user();

            $docNo = $till['tillno'] . $till["InvNo"];
            $refund = false;
            switch ($transaction["type"]) {
                case "INV":
                    $docNo = $till['tillno'] . $till["InvNo"];
                    if (isset($transaction['debtor'])) {
                        $debtorObj = $transaction['debtor'];
                        $debtorNo = $transaction['debtor']['no'];
                    }
                    break;
                case "CRN":
                    $docNo = $till['tillno'] . $till["CrnNo"];
                    $refund = true;
                    if (isset($transaction['debtor'])) {
                        $debtorNo = $transaction['debtor']['no'];
                        $laybyeNo = $debtorNo;
                    }
                    break;
                case "L/B":
                    if ($nextLb) {
                        $docNo = $till['tillno'] . $shop["nextLaybyeNo"];
                    } else {
                        $docNo = $till['tillno'] . $till["LbNo"];
                    }

                    $depNo = $till['tillno'] . $till["DepNo"];
                    $laybyeNo = $docNo;
                    break;
                case "LBC":
                    $docNo = $till['tillno'] . $till["CrnNo"];
                    if (isset($transaction['debtor'])) {
                        $itemDebtor = $transaction['debtor'];
                        $laybyeNo = $transaction['debtor']['no'];
                        $debtorNo = $transaction['debtor']['no'];

                        if (isset($transaction['debtor']['balance'])) {
                            $balance = $transaction['debtor']['balance'];
                        }
                    }
                    break;
            }

            $count = 1;
            foreach ($lineItems as $item) {
                if (!isset($item['markdown'])) {
                    $item['markdown'] = false;
                }
                if (!isset($item['combo'])) {
                    $item['combo'] = false;
                }
                if (!isset($item['isStaff'])) {
                    $item['isStaff'] = false;
                }

                $dailyTransaction = new DailyTransaction();
                $dailyTransaction->BRNO = $shop['BrNo'];
                $dailyTransaction->TILLNO = $till['tillno'];
                $dailyTransaction->STYLE = $item['code'];
                $dailyTransaction->SIZES = $item['size'];
                $dailyTransaction->CLR = $item['clrcode'];

                if (isset($item['serialno'])) {
                    $dailyTransaction->SERIALNO = $item['serialno'];
                } else {
                    $dailyTransaction->SERIALNO = '';
                }

                $dailyTransaction->LINENO = $count;
                $dailyTransaction->DOCNO = $docNo;
                $dailyTransaction->DOCTYPE = $transaction["type"];
                $dailyTransaction->SUP = isset($debtorObj) ? $debtorObj['no'] : $transaction["method"];

                if (isset($transaction['stype'])) {
                    if ($transaction['stype'] === "Refund") {
                        $refund = true;
                    }

                    if ($refund && $transaction["type"] === "LBC") {
                        $dailyTransaction->STYPE = "Laybye";
                        $dailyTransaction->DOCTYPE = "CRN";
                    } else {
                        $dailyTransaction->STYPE = $transaction['stype'];
                    }
                } else {
                    $dailyTransaction->STYPE = $transaction["method"];
                }

                $dailyTransaction->BDATE = \date("Y-m-d");
                $dailyTransaction->BTIME = \date("H:i:s");

                $vat = $item['total'] - ($item['total'] / (100 + (int) $transaction['tax']) * 100);
                $dailyTransaction->AMT = $item['total'];
                $dailyTransaction->VATAMT = $vat;
                $dailyTransaction->QTY = $item['qty'];

                if ($item['markdown'] === true) {
                    $dailyTransaction->SP = $item['total'];
                } else {
                    $dailyTransaction->SP = $item['subtotal'];
                }

                $dailyTransaction->SPX = $item['subtotal'];
                $dailyTransaction->CP = $item['cost'];
                $dailyTransaction->DTYPE = '';
                $dailyTransaction->LPROMPT = "Enter";
                $dailyTransaction->DISCPERC = $item['disc'];
                $dailyTransaction->MARKUP = 0.00;
                $dailyTransaction->DISCAMT = $item['subtotal'] - $item['total'];
                $dailyTransaction->SMAN = "1";
                $dailyTransaction->UPDFLAG = 0;

                if ($item['markdown'] === true) {
                    $saleType = 'M';
                } elseif ($item['combo'] === true) {
                    $saleType = 'D';
                } elseif ($item['isStaff'] === true) {
                    $saleType = 'S';
                    $dailyTransaction->STYPE = "Cash";
                } else {
                    $saleType = 'R';
                }

                $dailyTransaction->LSLTYPE = $saleType;

                $dailyTransaction->APPNO = 0;
                $dailyTransaction->IBTDLNO = 0;
                $dailyTransaction->DLNO = 0;
                $dailyTransaction->UPDNO = 0;
                $dailyTransaction->UPDFLAG = 0;

                if ($refund && $transaction["type"] === "LBC") {
                    $dailyTransaction->INVREF = isset($laybyeNo) ? $laybyeNo : $docNo;;
                } elseif ($refund) {
                    $dailyTransaction->INVREF = $docNo;
                } else {
                    $dailyTransaction->INVREF = isset($laybyeNo) ? $laybyeNo : null;
                }

                if (isset($transaction["oldDocNo"])) {
                    $dailyTransaction->INVREF = $transaction["oldDocNo"];
                }

                $dailyTransaction->PERIOD = $shop['Period'];
                $dailyTransaction->COMMENT = "";
                $dailyTransaction->RESCODE = null;
                $dailyTransaction->BUSER = $user->username;
                $dailyTransaction->AUSER = $transaction["auth"];
                $dailyTransaction->FWCNO = null;

                if (isset($item['rescode'])) {
                    $dailyTransaction->RESCODE = $item['rescode'];
                }

                if (isset($item['comments'])) {
                    $dailyTransaction->COMMENT = $item['comments'];
                }

                $count++;

                $monthlyTransaction = new Transaction($dailyTransaction->attributesToArray());
                $dailyTransaction->save();
                $monthlyTransaction->save();

                $this->tradeSummaryEntries($shop, $monthlyTransaction, $transaction);

                $colour = Colours::query()
                    ->where("code", $item['clrcode'])
                    ->first();

                /**
                 * @var Stock $stock
                 */
                $stock = Stock::query()
                    ->where("STYLE", $item['code'])
                    ->where("SIZES", $item['size'])
                    ->where("CLR", $colour->code)
                    ->first();

                if ($refund) {
                    $stock->QOH = $stock->QOH + 1;
                } else {
                    $stock->QOH = $stock->QOH - 1;
                }

                $stock->save();

                if (isset($item['serialno'])) {

                    $queryBuilder = Handset::query();
                    $queryBuilder->where('code', $dailyTransaction->STYLE)
                        ->where('serialno', $dailyTransaction->SERIALNO);
                    /**
                     * @var Handset $serialObject
                     */
                    $serialObject = $queryBuilder->first();

                    if (!$serialObject) {
                        $queryBuilder = Airtime::query();
                        $queryBuilder->where('code', $dailyTransaction->STYLE)
                            ->where('serialno', $dailyTransaction->SERIALNO);
                        /**
                         * @var Airtime $serialObject
                         */
                        $serialObject = $queryBuilder->first();
                    }

                    $serialObject->solddate = new \DateTime();
                    $serialObject->save();
                }

                $stockTransaction = new StockTransaction();
                $stockTransaction->STYLE = $item['code'];
                $stockTransaction->SIZES = $item['size'];
                $stockTransaction->CLR = $item['clrcode'];
                $stockTransaction->BRNO = $shop['BrNo'];
                $stockTransaction->CSTREF = null;
                $stockTransaction->BDATE = \date("Y-m-d");
                $stockTransaction->REF = $docNo;
                $stockTransaction->QOH = $stock->QOH;
                $stockTransaction->QTY = $item['qty'];
                $stockTransaction->SP = $item['subtotal'];
                $stockTransaction->CP = $item['cost'];
                $stockTransaction->DLNO = "0";
                $stockTransaction->ASSNO = 0;
                $stockTransaction->LBTAKEN = "";
                $stockTransaction->SMAN = "";
                $stockTransaction->SLTYPE = $saleType;
                $stockTransaction->BTYPE = $transaction["type"];
                $stockTransaction->VATAMT = $vat;
                $stockTransaction->DISCAMT = $item['subtotal'] - $item['total'];
                $stockTransaction->AMT = $item['total'];
                $stockTransaction->REASONCODE = null;
                $stockTransaction->REASONCOMMENTS = "";

                if (isset($item['rescode'])) {
                    $stockTransaction->REASONCODE = $item['rescode'];
                }

                if (isset($item['comments'])) {
                    $stockTransaction->REASONCOMMENTS = $item['comments'];
                }

                $stockTransaction->save();
            }

            if (isset($transaction["stype"])) {
                $stype = $transaction["stype"];
            } else {
                $stype = "";
            }

            $credit = false;
            if (isset($transaction["credit"])) {
                $credit = $transaction["credit"];
            }

            if ($transaction["type"] === "LBC" && $transaction['tendered'] == 0) {
                $summary = new DailySummary();
                $summary->BTYPE = "LBC";
                $summary->TRANNO = $till['tillno'] . $till["PayNo"];

                $summary->BDATE = \date("Y-m-d");
                $summary->BRNO = $shop['BrNo'];
                $summary->TAXCODE = null;
                $summary->VATAMT = $totals["vat"];
                $summary->AMT = $balance * -1;
                $summary->GLCODE = 0;
                $summary->REMARKS = "Sale";
                $summary->COB = $transaction["method"];

                if (isset($transaction['stype'])) {
                    $summary->STYPE = "Laybye";
                } else {
                    $summary->STYPE = $transaction["method"];
                }

                $summary->UPDFLAG = 0;
                $summary->TILLNO = $till['tillno'];
                $summary->DLNO = 0;
                $summary->UPDNO = 0;
                $summary->OTTYPE = "CRN";
                $summary->OTRANNO = $docNo;
                $summary->ODATE = \date("Y-m-d");

                if (isset($debtorNo)) {
                    $summary->DEBTOR = $debtorNo;
                } else {
                    $summary->DEBTOR = "Cash";
                }

                $summary->BUSER = $user->username;
                $summary->AUSER = $transaction["auth"];
                $summary->PERIOD = $shop['Period'];
                $summary->CCQNUM = "";

                if (isset($laybyeNo) && isset($depNo)) {
                    $summary->TRANNO = $depNo;
                    $summary->VATAMT = 0;
                    $summary->AMT = $transaction['tendered'];
                }

                $monthlySummary = new Summary($summary->attributesToArray());
                $summary->save();
                $monthlySummary->save();

                $this->tradeSummary($shop, $monthlySummary);
            } elseif (!(($transaction["type"] === "LBC" && $transaction['tendered'] == 0)
                || ($transaction["type"] === "INV" && $credit)
                || ($transaction["type"] === "INV" && $stype === "Exchng"))
            ) {
                $summary = new DailySummary();
                if ($transaction["type"] !== "CRN" && $transaction["type"] !== "LBC") {
                    $summary->BTYPE = "DEP";
                    $summary->TRANNO = $till['tillno'] . $till["DepNo"];
                } else {
                    $summary->BTYPE = "PAY";
                    $summary->TRANNO = $till['tillno'] . $till["PayNo"];
                }

                $summary->BDATE = \date("Y-m-d");
                $summary->BRNO = $shop['BrNo'];
                $summary->TAXCODE = null;
                $summary->VATAMT = $totals["vat"];
                $summary->AMT = $transaction["type"] === "LBC" || $transaction["type"] === "DCS" || $transaction["type"] === "Credit"
                    ? $transaction['tendered'] : $totals["total"];
                $summary->GLCODE = 0;
                $summary->REMARKS = "Sale";
                $summary->COB = $transaction["method"];

                if (isset($transaction['stype'])) {
                    if ($refund && $transaction["type"] === "LBC") {
                        $summary->STYPE = "Laybye";
                    } else {
                        $summary->STYPE = $transaction['stype'];
                    }
                } else {
                    $summary->STYPE = $transaction["method"];
                }

                if ($transaction["type"] === "CRN" && $transaction["stype"] === "Exchng") {
                    $summary->AMT = 0;
                }

                $summary->UPDFLAG = 0;
                $summary->TILLNO = $till['tillno'];
                $summary->DLNO = 0;
                $summary->UPDNO = 0;
                $summary->OTTYPE = $transaction["type"];
                $summary->OTRANNO = isset($transaction["oldDocNo"]) ? $transaction["oldDocNo"] : $docNo;
                $summary->ODATE = \date("Y-m-d");

                if ($refund && $transaction["type"] === "LBC") {
                    $summary->OTTYPE = "CRN";
                }

                if (isset($debtorNo)) {
                    $summary->DEBTOR = $debtorNo;
                } elseif ($transaction["type"] === "L/B" && isset($laybyeNo)) {
                    $summary->DEBTOR = $laybyeNo;
                } else {
                    $summary->DEBTOR = "Cash";
                }

                $summary->BUSER = $user->username;
                $summary->AUSER = $transaction["auth"];
                $summary->PERIOD = $shop['Period'];
                $summary->CCQNUM = "";

                if (isset($laybyeNo) && isset($depNo)) {
                    $summary->TRANNO = $depNo;
                    $summary->VATAMT = 0;
                    $summary->AMT = $transaction['tendered'];
                }

                $monthlySummary = new Summary($summary->attributesToArray());
                $summary->save();
                $monthlySummary->save();

                $this->tradeSummary($shop, $monthlySummary);
            }

            if (!($transaction["type"] === "L/B" && $transaction['stype'] === "Refund")) {
                $control = new DailyControl();

                $control->docnum = $docNo;
                $control->transtype = $transaction["type"];

                $control->save();
            }

            $request = new Request();
            if (!isset($transaction['person'])) {
                if (isset($itemDebtor)) {
                    $request->replace($itemDebtor);
                } else {
                    $request->replace([]);
                }
            } else {
                /**
                 * @var mixed $person
                 */
                $person = $transaction['person'];
                $request->replace($person);
            }

            $this->savePerson($request, $docNo, $transaction["type"]);

            if (isset($laybyeNo)) {
                if ($transaction["type"] === "LBC" || $transaction["type"] === "CRN") {
                    $laybye = Laybye::query()->where("no", $laybyeNo)->first();
                    if ($transaction["tendered"] > 0) {
                        $depAmt = 0;
                        $laybye->balance = $laybye->balance - ($totals["total"] - $transaction["tendered"]);
                        $laybye->current = $laybye->current - ($totals["total"] - $transaction["tendered"]);
                    } else {
                        $depAmt = $totals["total"] - $laybye->balance;
                        $laybye->balance -= $laybye->balance;
                        $laybye->current -= $laybye->current;
                    }
                } else {
                    $depAmt = 0;
                    $laybye = new Laybye();
                    $laybye->balance = $totals["total"] - $transaction["tendered"];
                    $laybye->current = $totals["total"] - $transaction["tendered"];
                }

                if ($transaction["type"] === "CRN") {
                    unset($debtorNo);
                }

                $laybye->no = $laybyeNo;

                if (isset($person)) {
                    $laybye->name = $person["name"];
                    $laybye->idNo = $person["idNo"];
                    $laybye->cell = $person["cell"];
                    $laybye->email = $person["email"];
                    $laybye->line1 = $person["line1"];
                    $laybye->line2 = $person["line2"];
                    $laybye->line3 = $person["line3"];
                }

                $laybye->appDate = \date("Y-m-d");

                $laybye->save();

                if ($transaction['stype'] !== "Refund") {
                    $laybyeTransaction = new LaybyeTransaction();

                    $laybyeTransaction->accNo = $laybyeNo;
                    $laybyeTransaction->invNo = $docNo;
                    $laybyeTransaction->invDate = \date("Y-m-d");
                    $laybyeTransaction->dueDate = \date("Y-m-d");
                    $laybyeTransaction->invAmt = $totals["total"];
                    $laybyeTransaction->type = $transaction["type"];
                    $laybyeTransaction->remarks = "Laybye";
                    $laybyeTransaction->period = $shop['Period'];
                    $laybyeTransaction->vatPer = $shop['Period'];
                    $laybyeTransaction->crnref = $docNo;
                    $laybyeTransaction->dts = new \DateTime();

                    $laybyeTransaction->save();
                }

                if ($transaction["tendered"] != 0) {
                    $tenderedLaybyeTransaction = new LaybyeTransaction();

                    $tenderedLaybyeTransaction->accNo = $laybyeNo;
                    $tenderedLaybyeTransaction->invNo = isset($depNo) ? $depNo : $docNo;
                    $tenderedLaybyeTransaction->invDate = \date("Y-m-d");
                    $tenderedLaybyeTransaction->dueDate = \date("Y-m-d");
                    $tenderedLaybyeTransaction->invAmt = $transaction["tendered"];
                    $tenderedLaybyeTransaction->type = $transaction['stype'] === "Refund" ? "CRN" : "DEP";
                    $tenderedLaybyeTransaction->remarks = $transaction['stype'] === "Refund" ? "Refund" : "Deposit";
                    $tenderedLaybyeTransaction->period = $shop['Period'];
                    $tenderedLaybyeTransaction->vatPer = $shop['Period'];
                    $tenderedLaybyeTransaction->crnref = $docNo;
                    $tenderedLaybyeTransaction->dts = new \DateTime();

                    $tenderedLaybyeTransaction->save();
                    unset($itemDebtor);
                    unset($debtorNo);
                } else {
                    $tenderedLaybyeTransaction = new LaybyeTransaction();

                    $tenderedLaybyeTransaction->accNo = $laybyeNo;
                    $tenderedLaybyeTransaction->invNo = isset($depNo) ? $depNo : $docNo;
                    $tenderedLaybyeTransaction->invDate = \date("Y-m-d");
                    $tenderedLaybyeTransaction->dueDate = \date("Y-m-d");
                    $tenderedLaybyeTransaction->invAmt = $depAmt;
                    $tenderedLaybyeTransaction->type = $transaction['stype'] === "Refund" ? "LBC" : "DEP";
                    $tenderedLaybyeTransaction->remarks = $transaction['stype'] === "Refund" ? "Refund" : "Deposit";
                    $tenderedLaybyeTransaction->period = $shop['Period'];
                    $tenderedLaybyeTransaction->vatPer = $shop['Period'];
                    $tenderedLaybyeTransaction->crnref = $docNo;
                    $tenderedLaybyeTransaction->dts = new \DateTime();

                    $tenderedLaybyeTransaction->save();
                }

                if (isset($itemDebtor)) {
                    $debtorTransaction = new DebtorTransaction();

                    $debtorTransaction->accNo = "LB" . $itemDebtor['no'];
                    $debtorTransaction->invNo = $docNo;
                    $debtorTransaction->invAmt = (float)number_format((float)$itemDebtor["balance"], 2, '.', '');
                    $debtorTransaction->invDate = \date("Y-m-d");
                    $debtorTransaction->dueDate = \date("Y-m-d");
                    $debtorTransaction->type = "LBC";
                    $debtorTransaction->remarks = "Lay-Bye Return Credit";
                    $debtorTransaction->period = $shop['Period'];
                    $debtorTransaction->vatPer = $shop['Period'];
                    $debtorTransaction->crnref = $docNo;
                    $debtorTransaction->dts = new \DateTime();

                    $debtorTransaction->save();

                    unset($debtorNo);
                }
            }

            if (isset($debtorNo)) {
                $debtorTransaction = new DebtorTransaction();

                $debtorTransaction->accNo = $debtorNo;
                $debtorTransaction->invNo = $docNo;
                $debtorTransaction->invAmt = $totals["total"];
                $debtorTransaction->invDate = \date("Y-m-d");
                $debtorTransaction->dueDate = \date("Y-m-d");
                $debtorTransaction->type = $transaction["type"] === "LBC" ? "CRN" : $transaction["type"];
                $debtorTransaction->remarks = "Credit Sale";
                $debtorTransaction->period = $shop['Period'];
                $debtorTransaction->vatPer = $shop['Period'];
                $debtorTransaction->crnref = $docNo;
                $debtorTransaction->dts = new \DateTime();

                /**
                 * @var Debtor $debtor
                 */
                $debtor = Debtor::query()->where("no", $debtorNo)->first();
                if (!$debtor) {
                    DB::rollBack();
                    Log::info("Debtor was not found for the following accNo: " . $debtorNo);
                    return response()->json([], $this->notFoundStatus);
                }

                if ($transaction['type'] === "LBC") {
                    $debtor->balance = $debtor->balance - ($totals["total"] - $transaction["tendered"]);
                    $debtor->current = $debtor->current - ($totals["total"] - $transaction["tendered"]);
                } else {
                    $debtor->balance = $debtor->balance + $totals["total"];
                    $debtor->current = $debtor->current + $totals["total"];
                }

                if ($debtor->stype === 'Staff') {
                    $debtorTransaction->remarks = 'Staff Sale';
                }

                $dno = $debtor->no;

                $debtor->save();
                $debtorTransaction->save();

                if ($transaction["tendered"] != 0) {
                    $tenderedDebtorTransaction = new DebtorTransaction();

                    $tenderedDebtorTransaction->accNo = $dno;
                    $tenderedDebtorTransaction->invNo = $docNo;
                    $tenderedDebtorTransaction->invAmt = $transaction["tendered"];
                    $tenderedDebtorTransaction->invDate = \date("Y-m-d");
                    $tenderedDebtorTransaction->dueDate = \date("Y-m-d");
                    $tenderedDebtorTransaction->type = "DEP";
                    $tenderedDebtorTransaction->remarks = $debtor->stype === "Staff" ? "Staff Sale" : "Credit Sale Deposit";
                    $tenderedDebtorTransaction->period = $shop['Period'];
                    $tenderedDebtorTransaction->vatPer = $shop['Period'];
                    $tenderedDebtorTransaction->crnref = $docNo;
                    $tenderedDebtorTransaction->dts = new \DateTime();

                    $tenderedDebtorTransaction->save();
                }
            }

            DB::commit();
            return response()->json(["number" => $docNo], $this->createdStatus);
        } catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Retrieve all line items for a document number
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveTransaction($id)
    {
        $transactions = DailyTransaction::query()
            ->where('DOCNO', $id)
            ->get();

        if (count($transactions) === 0) {
            return response()->json([], $this->notFoundStatus);
        }

        $lineItems = array("type" => "", "branch" => "", "till" => "", "method" => "",
            "transactions" => array(), "totals" => array("vat" => 0, "total" => 0, "qty" => 0));

        $vat = 0;
        $total = 0;
        $qty = 0;
        $disc = 0;

        /**
         * @var DailyTransaction $item
         */
        foreach ($transactions as $item) {
            $qty++;

            $transaction = array();
            $transaction['code'] = $item->STYLE;
            $transaction['colour'] = $item->CLR;
            $transaction['clrcode'] = $item->CLR;
            $transaction['size'] = $item->SIZES;
            $transaction['cost'] = $item->CP;
            $transaction['type'] = $item->DOCTYPE;

            /**
             * @var Product $product
             */
            $product = Product::query()->where('code', $item->STYLE)->first();
            $transaction['description'] = $product->descr;

            $transaction['disc'] = $item->DISCAMT;
            $transaction['markdown'] = $item->LSLTYPE === 'M' ? true : false;
            $transaction['price'] = $item->SP;
            $transaction['qty'] = $item->QTY;
            $transaction['subtotal'] = $item->QTY * $item->SP;
            $transaction['total'] = $item->AMT;
            $total += $item->AMT;
            $vat += $item->VATAMT;
            $disc += $item->DISCAMT;

            $lineItems["transactions"][] = $transaction;
            $lineItems["method"] = $item->SUP;
            $lineItems["type"] = $item->DOCTYPE;
            $lineItems["branch"] = $item->BRNO;
            $lineItems["till"] = $item->TILLNO;
            $lineItems['stype'] = $item->STYPE;
            $lineItems['rescode'] = $item->RESCODE;
            $lineItems['comments'] = $item->COMMENTS;
        }

        $lineItems["totals"]["vat"] = $vat;
        $lineItems["totals"]["qty"] = $qty;
        $lineItems["totals"]["total"] = $total;
        $lineItems["totals"]["disc"] = $disc;

        return response()->json(['lineItems' => $lineItems], $this->successStatus);
    }

    /**
     * Retrieve all line items for a document number from a completed stock transaction
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveStock($id)
    {
        $transactions = StockTransaction::query()
            ->where('REF', $id)
            ->get();

        if (count($transactions) === 0) {
            return response()->json([], $this->notFoundStatus);
        }

        $lineItems = array("type" => "", "branch" => "", "till" => "",
            "transactions" => array(), "totals" => array("vat" => 0, "total" => 0, "qty" => 0));

        $vat = 0;
        $total = 0;
        $qty = 0;

        /**
         * @var StockTransaction $item
         */
        foreach ($transactions as $item) {
            $qty++;

            $transaction = array();
            $transaction['code'] = $item->STYLE;
            $transaction['colour'] = $item->CLR;
            $transaction['clrcode'] = $item->CLR;
            $transaction['size'] = $item->SIZES;
            $transaction['cost'] = $item->CP;
            $transaction['type'] = $item->BTYPE;

            /**
             * @var Product $product
             */
            $product = Product::query()->where('code', $item->STYLE)->first();
            $transaction['description'] = $product->descr;

            $transaction['disc'] = $item->DISCAMT;
            $transaction['markdown'] = $item->SLTYPE === 'M' ? true : false;
            $transaction['isStaff'] = $item->SLTYPE === 'S' ? true : false;
            $transaction['combo'] = $item->SLTYPE === 'D' ? true : false;
            $transaction['price'] = $item->SP;
            $transaction['qty'] = $item->QTY;
            $transaction['subtotal'] = $item->QTY * $item->SP;
            $transaction['total'] = $item->AMT;
            $total += $item->AMT;
            $vat += $item->VATAMT;

            $lineItems["transactions"][] = $transaction;
            $lineItems["type"] = $item->BTYPE;
            $lineItems["branch"] = $item->BRNO;
            $lineItems["date"] = $item->BDATE;
        }

        $lineItems["totals"]["vat"] = $vat;
        $lineItems["totals"]["qty"] = $qty;
        $lineItems["totals"]["total"] = $total;

        return response()->json(['lineItems' => $lineItems], $this->successStatus);
    }

    /**
     * Print transaction debtor receipt.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function printDebtorReceipt($id)
    {
        $isDebtor = false;
        $debtorTransaction = LaybyeTransaction::query()
            ->where("invNo", $id)
            ->first();

        if (!$debtorTransaction) {
            $debtorTransaction = DebtorTransaction::query()
                ->where("invNo", $id)
                ->first();

            if (!$debtorTransaction) {
                return response()->json([], $this->notFoundStatus);
            }

            $isDebtor = true;
            $accNo = $debtorTransaction['accNo'];

            $debtor = Debtor::query()
                ->where("no", $accNo)
                ->first();
        } else {
            $accNo = $debtorTransaction['accNo'];
            $debtor = Laybye::query()
                ->where("no", $accNo)
                ->first();
        }

        $depNo = $debtorTransaction['invNo'];
        $name = $debtor['name'];
        $amt = $debtorTransaction['invAmt'];
        $balance = $debtor['balance'];
        $date = \date('Y-m-d');

        /**
         * @var SnappyPdf $snappy
         */
        $snappy = App::make('snappy.pdf');
        $html = View::make('debtor', [
            "date" => $date,
            "accNo" => $accNo,
            "depNo" => $depNo,
            "isDebtor" => $isDebtor,
            "name" => $name,
            "amt" => $amt,
            "balance" => $balance
        ]);
        return new Response(
            $snappy->getOutputFromHtml($html),
            200,
            array(
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="receipt.pdf"'
            )
        );

    }

    /**
     * Print transaction receipt.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function printReceipt($id)
    {
        /**
         * @var Response $response
         */
        $response = $this->retrieveTransaction($id);
        if (!$response->isOk()) {
            return response()->json([], $response->getStatusCode());
        }

        $transaction = $response->getOriginalContent()['lineItems'];

        $branchCode = $transaction["branch"];
        $branch = Branch::query()
            ->where("code", $branchCode)
            ->first();

        /**
         * @var DailyTransaction[] $lineItems
         */
        $lineItems = $transaction["transactions"];
        $totals = $transaction["totals"];

        $date = \date('Y-m-d');
        $time = \date("H:i:s");

        switch ($transaction['type']) {
            case "L/B":
            case "INV":
                $type = "Invoice";
                break;
            case "CRN":
                $type = "Credit";
                break;
            default:
                $type = "Invoice";
        }

        switch ($transaction['stype']) {
            case "CC":
                $method = "Card";
                break;
            case "Refund":
                $method = "Refund";
                $refundAmt = $totals['total'];
                $originalDocNo = $id;
                $reason = $transaction['rescode'];
                $comments = $transaction['comments'];
                break;
            case "Laybye":
                $method = "Laybye";
                break;
            case "Credit":
                $method = "Credit";
                break;
            case "Exchng":
                $method = "Exchng";
                break;
            default:
                $method = "Cash";
        }

        $laybyeRemarks = Shop::query()
            ->select(['ColValue'])
            ->where('ColName', 'LaybyeRemarks')
            ->first();

        /**
         * @var SnappyPdf $snappy
         */
        return view('receipt', [
            "transaction_id" => $id,
            "date" => $date,
            "time" => $time,
            "transactions" => $lineItems,
            "totals" => $totals,
            "branch" => $branch,
            "till" => $transaction['till'],
            "method" => $method,
            "type" => $type,
            "tendered" => $totals['total'],
            "change" => 0,
            "discount" => $totals['disc'],
            "refundAmt" => isset($refundAmt) ? $refundAmt : null,
            "originalDocNo" => isset($originalDocNo) ? $originalDocNo : null,
            "reason" => isset($reason) ? $reason : null,
            "comments" => isset($comments) ? $comments : null,
            "remarks" => $laybyeRemarks ? $laybyeRemarks->ColValue : null
        ]);

    }

    /**
     * Save the person details associated with a transaction
     *
     * @param Request $request
     * @param $id
     * @param $docType
     * @return Response
     */
    public function savePerson(Request $request, $id, $docType)
    {
        $this->validate($request, [
            'email' => 'nullable | email',
            'cell' => 'nullable | max:10 | min:10'
        ]);

        $data = $request->all();

        try {
            DB::beginTransaction();

            $person = new Person($data);
            $person['docNo'] = $id;
            $person['docType'] = $docType;
            $person->save();

            DB::commit();
            return response()->json(["person" => $person], $this->createdStatus);
        } catch (\PDOException $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Save the refund details for an invoice number that was not found
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function saveRefund(Request $request)
    {
        $this->validate($request, [
            'invNo' => 'required',
            'invType' => 'required',
            'invDate' => 'required',
            'idNo' => 'required',
            'email' => 'nullable | email',
            'cell' => 'required | max:10 | min:10',
            'brNo' => 'required'
        ]);

        $data = $request->all();
        try {
            DB::beginTransaction();

            $refund = new Refund($data);
            $refund->save();

            DB::commit();
            return response()->json([], $this->createdStatus);
        } catch (\PDOException $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Retrieve a refund
     *
     * @param $id
     * @param $type
     * @return \Illuminate\Http\Response
     */
    public function retrieveRefund($id, $type)
    {
        if ($type === "LB") {
            $type = "L/B";
        }

        $refund = Refund::query()
            ->where('invNo', $id)
            ->where('invType', $type)
            ->first();

        if ($refund) {
            return response()->json(["error" => "This document has already been refunded!"], $this->validationStatus);
        }

        if ($type === "LB") {
            $laybye = Laybye::query()
                ->where("accNo", $id)
                ->first();

            if ($laybye->balance <= 0) {
                return response()->json([], $this->validationStatus);
            }
        }

        $transactions = StockTransaction::query()
            ->where('REF', $id)
            ->get();

        if (count($transactions) === 0) {
            return response()->json([], $this->notFoundStatus);
        }

        $lineItems = array("type" => "", "branch" => "", "till" => "", "method" => "",
            "transactions" => array(), "totals" => array("vat" => 0, "total" => 0, "qty" => 0));

        $vat = 0;
        $total = 0;
        $qty = 0;

        /**
         * @var StockTransaction $item
         */
        foreach ($transactions as $item) {
            if ($item->BTYPE !== $type) {
                return response()->json(["error" => "The document number supplied is not the correct type to perform a refund"],
                    $this->validationStatus);
            }

            $qty++;

            $transaction = array();
            $transaction['code'] = $item->STYLE;
            $transaction['colour'] = $item->CLR;
            $transaction['clrcode'] = $item->CLR;
            $transaction['size'] = $item->SIZES;
            $transaction['cost'] = $item->CP;
            $transaction['type'] = $item->BTYPE;

            /**
             * @var Product $product
             */
            $product = Product::query()->where('code', $item->STYLE)->first();
            $transaction['description'] = $product->descr;

            $transaction['disc'] = $item->DISCAMT;
            $transaction['markdown'] = $item->SLTYPE === 'M' ? true : false;
            $transaction['isStaff'] = $item->SLTYPE === 'S' ? true : false;
            $transaction['combo'] = $item->SLTYPE === 'D' ? true : false;
            $transaction['price'] = $item->SP;
            $transaction['qty'] = $item->QTY;
            $transaction['subtotal'] = $item->QTY * $item->SP;
            $transaction['total'] = $item->AMT;
            $total += $item->AMT;
            $vat += $item->VATAMT;

            $lineItems["transactions"][] = $transaction;
            $lineItems["type"] = $item->BTYPE;
            $lineItems["branch"] = $item->BRNO;
            $lineItems["date"] = $item->BDATE;
        }

        $person = Person::query()->where('docNo', $id)->first();
        $lineItems["person"] = $person;

        $lineItems["totals"]["vat"] = $vat;
        $lineItems["totals"]["qty"] = $qty;
        $lineItems["totals"]["total"] = $total;

        return response()->json(['lineItems' => $lineItems], $this->successStatus);

    }

    /**
     * Validates authentication for activating staff prices.
     *
     * @return \Illuminate\Http\Response
     */
    public function activateStaff()
    {
        return response()->json([], $this->successStatus);
    }

    /**
     * Validates authentication for activating exchanges.
     *
     * @return \Illuminate\Http\Response
     */
    public function activateExchange()
    {
        return response()->json([], $this->successStatus);
    }

    /**
     * Validates authentication for activating credit sales.
     *
     * @return \Illuminate\Http\Response
     */
    public function activateCreditSales()
    {
        return response()->json([], $this->successStatus);
    }

    /**
     * Validates authentication for activating refunds.
     *
     * @return \Illuminate\Http\Response
     */
    public function activateRefund()
    {
        return response()->json([], $this->successStatus);
    }

    private function tradeSummaryEntries($shop, Transaction $transaction, $actual)
    {
        $taxRate = Tax::query()
            ->where('taxcode', 1)
            ->first();

        $docType = $transaction->DOCTYPE;
        $stype = $transaction->STYPE;
        $lslType = $transaction->LSLTYPE;
        $docNo = $transaction->OTRANNO;
        $otType = $transaction->OTTYPE;
        $lslType = $transaction->LSLTYPE;
        $branchCode = $transaction->BRNO;
        $date = $transaction->BDATE;
        $tillNo = $transaction->TILLNO;
        $cob = $transaction->SUP;
        $period = $transaction->PERIOD;
        $style = $transaction->STYLE;

        $cp = $transaction->CP;
        $sp = $transaction->SP;
        $qty = $transaction->QTY;
        $disc = $transaction->DISCAMT;
        $vat = $transaction->VATAMT;
        $amt = $transaction->AMT;

        $product = Product::query()
            ->where("code", $style)
            ->first();

        $tradeSummary = TradeSummary::query()
            ->where("brno", $branchCode)
            ->where("bdate", $date)
            ->where("TILLNO", $tillNo)
            ->where("PERIOD", $period)
            ->first();

        if (!$tradeSummary) {
            $tradeSummary = new TradeSummary();
            $tradeSummary->brno = $branchCode;
            $tradeSummary->bdate = $date;
            $tradeSummary->TILLNO = $tillNo;
            $tradeSummary->PERIOD = $period;
            $tradeSummary->CASHS = 0.00;
            $tradeSummary->CCARDS = 0.00;
            $tradeSummary->PDCS = 0.00;
            $tradeSummary->CHQS = 0.00;
            $tradeSummary->SLS = 0.00;
            $tradeSummary->TOTDISC = 0.00;
            $tradeSummary->TOTCP = 0.00;
            $tradeSummary->TOTSP = 0.00;
            $tradeSummary->LAYBYES = 0.00;
            $tradeSummary->CREDITS = 0.00;
            $tradeSummary->USLS = 0;
            $tradeSummary->URET = 0;
            $tradeSummary->REFUNDC = 0;
            $tradeSummary->CASHC = 0;
            $tradeSummary->CODC = 0;
            $tradeSummary->CCC = 0;
            $tradeSummary->PDCC = 0;
            $tradeSummary->CREDITC = 0;
            $tradeSummary->CELLP = 0;
            $tradeSummary->SPACK = 0;
            $tradeSummary->AIRTIME = 0;
            $tradeSummary->CXCESS = 0;
            $tradeSummary->TOTRFDS = 0;
            $tradeSummary->LOANPAID = 0;
            $tradeSummary->STFPAY = 0;
            $tradeSummary->CSHREF = 0;
            $tradeSummary->LBCRS = 0;
            $tradeSummary->TCRNS = 0;
            $tradeSummary->TINVS = 0;
            $tradeSummary->CODPAY = 0;
            $tradeSummary->DEBPAY = 0;
            $tradeSummary->PDCPAY = 0;
            $tradeSummary->STFRECS = 0;
            $tradeSummary->LOANRECV = 0;
            $tradeSummary->TOTCSHBNK = 0;
            $tradeSummary->TOTCCS = 0;
            $tradeSummary->OTHER = 0;
            $tradeSummary->RDS = 0;
            $tradeSummary->CHQDEP = 0;
            $tradeSummary->LBPAY = 0;
            $tradeSummary->CREXINV = 0;
            $tradeSummary->CSEXINV = 0;
        }

        //INV/L/B entry
        if (($docType === "L/B" || $docType === "INV") && $lslType !== "E") {
            $amount = ($sp * $qty) - $disc;
            $totalCp = $cp * $qty;
            $totalSp = (($sp * $qty) - $disc) - $vat;

            if ($product->category === $shop['CellCat'] && $product->groupCode === $shop['CellGrp']) {
                switch ($product->cellType) {
                    case "H":
                        $tradeSummary->CELLP += $amount;
                        break;
                    case "S":
                        $tradeSummary->SPACK += $amount;
                        break;
                    case "A":
                        $tradeSummary->AIRTIME += $amount;
                        break;
                    case "X":
                        $tradeSummary->CXCESS += $amount;
                        break;
                }
            } else {
                if (isset($actual['splitCard']) && isset($actual['splitCash'])) {
                    $tradeSummary->CASHS += floatval($amount);
                    $tradeSummary->CCARDS += floatval($amount);
                } else {
                    switch ($cob) {
                        case "Cash":
                            $tradeSummary->CASHS += $amount;
                            break;
                        case "CC":
                            $tradeSummary->CCARDS += $amount;
                            break;
                        case "PDC":
                            $tradeSummary->PDCS += $amount;
                            break;
                        case "Cheque":
                            $tradeSummary->CHQS += $amount;
                            break;
                    }
                }

                $tradeSummary->USLS += $qty * 1;
                $tradeSummary->SLS += $amount;
                $tradeSummary->TOTDISC += $disc;
                $tradeSummary->TOTCP += $totalCp;
                $tradeSummary->TOTSP += $totalSp;

                switch ($stype) {
                    case "Laybye":
                        $tradeSummary->LAYBYES += $amount;
                        break;
                    case "COD":
                    case "DCS":
                        $tradeSummary->CODS += $amount;
                        break;
                    case "Credit":
                        $tradeSummary->CREDITS += $amount;
                        break;
                }
            }
        }

        //CRN entry
        if ($docType === "CRN" && $lslType !== "E") {
            $amount = ($sp * $qty * -1) + $disc;
            $totalCp = ($cp * $qty) * -1;
            $totalSp = (($sp * $qty * -1) + $disc) - ($vat * -1);

            if ($product->category === $shop['CellCat'] && $product->groupCode === $shop['CellGrp']) {
                switch ($product->cellType) {
                    case "H":
                        $tradeSummary->CELLP += $amount;
                        break;
                    case "S":
                        $tradeSummary->SPACK += $amount;
                        break;
                    case "A":
                        $tradeSummary->AIRTIME += $amount;
                        break;
                    case "X":
                        $tradeSummary->CXCESS += $amount;
                        break;
                }
            } else {
                switch ($cob) {
                    case "Cash":
                        $tradeSummary->CASHC += $amount;
                        break;
                    case "CC":
                        $tradeSummary->CCC += $amount;
                        break;
                    case "PDC":
                        $tradeSummary->PDCC += $amount;
                        break;
                    case "Cheque":
                        $tradeSummary->CHQC += $amount;
                        break;
                }

                $tradeSummary->URET += $qty * 1;
                $tradeSummary->SLS += $amount;
                $tradeSummary->TOTDISC -= $disc;
                $tradeSummary->TOTCP += $totalCp;
                $tradeSummary->TOTSP += $totalSp;

                switch ($stype) {
                    case "Refund":
                        $tradeSummary->REFUNDC += $amount;
                        break;
                    case "Cash":
                    case "Exchng":
                        break;
                    case "DCS":
                    case "COD":
                        $tradeSummary->CODC += $amount;
                        break;
                    case "PDC":
                        $tradeSummary->PDCC += $amount;
                        break;
                    case "Laybye":
                        $tradeSummary->LAYBYEC += $amount;
                        break;
                    case "Credit":
                        $tradeSummary->CREDITC += $amount;
                        break;
                }
            }
        }

        if ($docType === "CRN" && $lslType === "E") {
            if ($stype === "Cash") {
                $tradeSummary->CSEXINV += $amt * -1;
            } else {
                $tradeSummary->CREXINV += $amt * -1;
            }
        }

        if (($docType === "L/B" || $docType === "INV") && $lslType === "E") {
            if ($stype === "Cash") {
                $tradeSummary->CSEXINV += $amt;
            } else {
                $tradeSummary->CREXINV += $amt;
            }
        }

        $tradeSummary->save();
    }

    private function tradeSummary($shop, Summary $summary)
    {
        $stype = $summary->STYPE;
        $docNo = $summary->TRANNO;
        $docType = $summary->BTYPE;
        $oDocNo = $summary->OTRANNO;
        $otType = $summary->OTTYPE;
        $branchCode = $summary->BRNO;
        $date = $summary->BDATE;
        $tillNo = $summary->TILLNO;
        $cob = $summary->COB;
        $period = $summary->PERIOD;
        $btype = $summary->BTYPE;

        $amt = $summary->AMT;
        $vat = $summary->VATAMT;

        $tradeSummary = TradeSummary::query()
            ->where("brno", $branchCode)
            ->where("bdate", $date)
            ->where("TILLNO", $tillNo)
            ->where("PERIOD", $period)
            ->first();

        if (!$tradeSummary) {
            $tradeSummary = new TradeSummary();
            $tradeSummary->brno = $branchCode;
            $tradeSummary->bdate = $date;
            $tradeSummary->TILLNO = $tillNo;
            $tradeSummary->PERIOD = $period;
            $tradeSummary->CASHS = 0.00;
            $tradeSummary->CCARDS = 0.00;
            $tradeSummary->PDCS = 0.00;
            $tradeSummary->CHQS = 0.00;
            $tradeSummary->SLS = 0.00;
            $tradeSummary->TOTDISC = 0.00;
            $tradeSummary->TOTCP = 0.00;
            $tradeSummary->TOTSP = 0.00;
            $tradeSummary->LAYBYES = 0.00;
            $tradeSummary->CREDITS = 0.00;
            $tradeSummary->USLS = 0;
            $tradeSummary->URET = 0;
            $tradeSummary->REFUNDC = 0;
            $tradeSummary->CASHC = 0;
            $tradeSummary->CODC = 0;
            $tradeSummary->CCC = 0;
            $tradeSummary->PDCC = 0;
            $tradeSummary->CREDITC = 0;
            $tradeSummary->CELLP = 0;
            $tradeSummary->SPACK = 0;
            $tradeSummary->AIRTIME = 0;
            $tradeSummary->CXCESS = 0;
            $tradeSummary->TOTRFDS = 0;
            $tradeSummary->LOANPAID = 0;
            $tradeSummary->STFPAY = 0;
            $tradeSummary->CSHREF = 0;
            $tradeSummary->LBCRS = 0;
            $tradeSummary->TCRNS = 0;
            $tradeSummary->TINVS = 0;
            $tradeSummary->CODPAY = 0;
            $tradeSummary->DEBPAY = 0;
            $tradeSummary->PDCPAY = 0;
            $tradeSummary->STFRECS = 0;
            $tradeSummary->LOANRECV = 0;
            $tradeSummary->TOTCSHBNK = 0;
            $tradeSummary->TOTCCS = 0;
            $tradeSummary->OTHER = 0;
            $tradeSummary->RDS = 0;
            $tradeSummary->CHQDEP = 0;
            $tradeSummary->LBPAY = 0;
            $tradeSummary->CREXINV = 0;
            $tradeSummary->CSEXINV = 0;
        }

        if ($btype === "PAY") {
            switch ($stype) {
                case "Refund":
                    $tradeSummary->TOTRFDS += $amt;
                    break;
                case "Loan":
                    $tradeSummary->LOANPAID += $amt;
                    break;
                case "Staff":
                    $tradeSummary->STFPAY += $amt;
                    break;
                case "CC":
                case "Cash":
                    break;
                default:
                    if ($otType === "CRN") {
                        $tradeSummary->CSHREF += $amt;
                    }
            }

        } elseif ($btype === "LBC") {
            $tradeSummary->LBCRS += $amt;
        } elseif ($btype === "DEP") {
            if ($cob !== "PDC") {
                switch ($otType) {
                    case "ADP":
                        $tradeSummary->TOTCSHBNK += $amt;
                        break;
                    case "CCD":
                        $tradeSummary->TOTCCS += $amt;
                        break;
                    case "ReD":
                        if ($stype === "ReD") {
                            $tradeSummary->OTHER += $amt;
                        }
                        break;
                    case "PDC":
                        if ($stype === "ReD") {
                            $tradeSummary->OTHER += $amt;
                            $tradeSummary->CHQDEP += $amt;
                        } elseif ($stype === "RD") {
                            $tradeSummary->RDS += $amt;
                        } else {
                            $tradeSummary->CHQDEP += $amt;
                        }
                        break;
                    case "L/B":
                        $tradeSummary->TINVS += 1;
                        $tradeSummary->LBPAY += $amt;
                        break;

                }
            }


            if ($otType === "INV" && $cob !== "PDC") {
                $tradeSummary->TINVS += 1;
                switch ($stype) {
                    case "DCS":
                    case "COD":
                        $tradeSummary->CODPAY += $amt;
                        break;
                    case "Credit":
                        $tradeSummary->DEBPAY += $amt;
                        break;
                    case "PDC":
                        $tradeSummary->PDCPAY += $amt;
                        break;
                    case "Staff":
                        $tradeSummary->STFRECS += $amt;
                        break;
                    case "Loan":
                        $tradeSummary->LOANRECV += $amt;
                        break;
                }
            } elseif ($otType === "D/P" && $cob !== "PDC") {
                switch ($stype) {
                    case "COD":
                        $tradeSummary->CODPAY += $amt;
                        break;
                    case "Cash":
                    case "Credit":
                        $tradeSummary->DEBPAY += $amt;
                        break;
                    case "PDC":
                        $tradeSummary->PDCPAY += $amt;
                        break;
                    case "Staff":
                        $tradeSummary->STFRECS += $amt;
                        break;
                    case "Loan":
                        $tradeSummary->LOANRECV += $amt;
                        break;
                }
            }
        }

        if ($otType === "CRN") {
            $tradeSummary->TCRNS += 1;
        }

        $tradeSummary->save();
    }

}
