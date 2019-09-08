<?php

namespace App\Http\Controllers\Api\Transaction;

use App\Http\Controllers\Controller;
use App\Sale;
use App\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SaleController extends Controller
{
    public $successStatus = 200;
    public $createdStatus = 201;
    public $notFoundStatus = 404;
    public $validationStatus = 422;
    public $errorStatus = 500;

    /**
     * Retrieve all held sales
     *
     * @return \Illuminate\Http\Response
     */
    public function getSales()
    {
        $sales = Sale::all();
        if (!$sales) {
            return response()->json([], $this->notFoundStatus);
        }

        $map = array();

        /**
         * @var Sale $sale
         */
        foreach ($sales as $sale) {
            if (!isset($map[$sale->docnum])) {
                $lineItem = array("type" => "", "docnum" => "", "transactions" => array());
            } else {
                $lineItem = $map[$sale->docnum];
            }

            /**
             * @var Stock $stock
             */
            $stock = Stock::query()
                ->where("STYLE", $sale['code'])
                ->where("SIZES", $sale['size'])
                ->where("CLR", $sale['clrcode'])
                ->first();

            if (!$stock) {
                continue;
            }

            if ($stock->QOH <= 0) {
                continue;
            }

            $transaction = array();
            $transaction['code'] = $sale->code;
            $transaction['colour'] = $sale->colour;
            $transaction['clrcode'] = $sale->clrcode;
            $transaction['size'] = $sale->size;
            $transaction['cost'] = $sale->cost;
            $transaction['description'] = $sale->description;
            $transaction['disc'] = $sale->disc;
            $transaction['markdown'] = $sale->markdown;
            $transaction['price'] = $sale->price;
            $transaction['qty'] = $sale->qty;
            $transaction['subtotal'] = $sale->subtotal;
            $transaction['total'] = $sale->total;

            $lineItem["transactions"][] = $transaction;
            $lineItem["type"] = $sale->type;
            $lineItem["docnum"] = $sale->docnum;

            $map[$sale->docnum] = $lineItem;
        }

        return response()->json(['lineItems' => $map], $this->successStatus);
    }

    /**
     * Retrieve a held sale
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveSale($id)
    {
        $sales = Sale::query()
            ->where('docnum', $id)
            ->get();

        if (!$sales) {
            return response()->json([], $this->notFoundStatus);
        }

        $lineItems = array("type" => "", "transactions" => array());

        /**
         * @var Sale $sale
         */
        foreach ($sales as $sale) {
            $transaction = array();
            $transaction['code'] = $sale->code;
            $transaction['colour'] = $sale->colour;
            $transaction['clrcode'] = $sale->clrcode;
            $transaction['size'] = $sale->size;
            $transaction['cost'] = $sale->cost;
            $transaction['description'] = $sale->description;
            $transaction['disc'] = $sale->disc;
            $transaction['markdown'] = $sale->markdown;
            $transaction['price'] = $sale->price;
            $transaction['qty'] = $sale->qty;
            $transaction['subtotal'] = $sale->subtotal;
            $transaction['total'] = $sale->total;

            $lineItems["transactions"][] = $transaction;
            $lineItems["type"] = $sale->type;
        }

        return response()->json(['lineItems' => $lineItems], $this->successStatus);
    }

    /**
     * Hold a sale
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function holdSale(Request $request)
    {
        $this->validate($request, [
            'transactions' => 'required',
            'till' => 'required',
            'type' => 'required'
        ]);

        $lineItems = $request->all();

        try {
            DB::beginTransaction();
            $transactions = $lineItems['transactions'];

            $till = $lineItems['till'];
            $docNo = $till['tillno'] . $till['TempDocNo'];

            foreach ($transactions as $transaction) {
                $sale = new Sale();
                $sale->docnum = $docNo;
                $sale->type = $lineItems['type'];
                $sale->code = $transaction['code'];
                $sale->colour = $transaction['colour'];
                $sale->clrcode = $transaction['clrcode'];
                $sale->cost = $transaction['cost'];
                $sale->description = $transaction['description'];
                $sale->disc = $transaction['disc'];
                $sale->markdown = $transaction['markdown'];
                $sale->price = $transaction['price'];
                $sale->qty = $transaction['qty'];
                $sale->size = $transaction['size'];
                $sale->subtotal = $transaction['subtotal'];
                $sale->total = $transaction['total'];

                $sale->save();
            }

            DB::commit();
            return response()->json(['sale' => $docNo], $this->createdStatus);
        } catch (\PDOException $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }


    /**
     * Hold a sale
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function removeSale($id)
    {
        $sales = Sale::query()
            ->where('docnum', $id)
            ->get();

        if (!$sales) {
            return response()->json([], $this->notFoundStatus);
        }

        foreach ($sales as $sale) {
            $sale->delete();
        }

        return response()->json([], $this->successStatus);
    }

}
