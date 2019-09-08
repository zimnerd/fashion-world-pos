<?php

namespace App\Http\Controllers\Api\Transaction;

use App\DailySummary;
use App\Http\Controllers\Controller;
use App\Laybye;
use App\LaybyeTransaction;
use App\Till;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LaybyeController extends Controller
{
    public $successStatus = 200;
    public $createdStatus = 201;
    public $notFoundStatus = 404;
    public $errorStatus = 500;

    /**
     * Retrieves a lay-bye
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveLayBye($id)
    {
        $laybye = Laybye::query()
            ->where('no', $id)
            ->first();

        if (!$laybye) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(['laybye' => $laybye], $this->successStatus);
    }

    /**
     * Retrieves a lay-byes deposit transactions
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveLayByeTransactions($id)
    {
        $transactions = LaybyeTransaction::query()
            ->where('accNo', $id)
            ->where('type', "DEP")
            ->get();

        if (!$transactions) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(['transactions' => $transactions], $this->successStatus);
    }

    /**
     * Retrieves all lay-byes
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveLayByes()
    {
        $laybyes = Laybye::all();

        if (!$laybyes) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(['laybyes' => $laybyes], $this->successStatus);
    }

    /**
     * Pays the account of a lay-bye
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function payLayBye($id, Request $request)
    {
        $this->validate($request, [
            'till' => 'required',
            'shop' => 'required',
            'account' => 'required'
        ]);

        try {
            DB::beginTransaction();

            /**
             * @var User $user
             */
            $user = Auth::user();

            /**
             * @var Laybye $laybyeValues
             */
            $laybyeValues = $request->all();

            $laybye = Laybye::query()
                ->where('no', $id)
                ->first();

            if (!$laybye) {
                return response()->json([], $this->notFoundStatus);
            }

            $account = $laybyeValues['account'];

            $laybye->current = $account['current'];
            $laybye->balance = $account['balance'];
            $laybye->save();

            $till = $laybyeValues['till'];

            $tillInfo = Till::query()
                ->where('tillno', $till['tillno'])
                ->where('ColName', 'CrnNo')
                ->first();

            if (!$tillInfo) {
                return response()->json([], $this->notFoundStatus);
            }

            $docNo = (string)(((int)$tillInfo->ColValue) + 1);

            $docNo = '1' . $docNo;

            $shop = $laybyeValues['shop'];

            $tillInfo = Till::query()
                ->where('tillno', $till['tillno'])
                ->where('ColName', 'DepNo')
                ->first();

            if (!$tillInfo) {
                return response()->json([], $this->notFoundStatus);
            }

            $depNo = (string)(((int)$tillInfo->ColValue) + 1);
            $tillInfo->ColValue = $depNo;
            $tillInfo->save();

            $depNo = '1' . $depNo;

            $laybyeTransaction = new LaybyeTransaction();

            $laybyeTransaction->accNo = $id;
            $laybyeTransaction->invNo = $depNo;
            $laybyeTransaction->invAmt = $laybyeValues["tendered"];
            $laybyeTransaction->invDate = \date("Y-m-d");
            $laybyeTransaction->dueDate = \date("Y-m-d");
            $laybyeTransaction->type = "DEP";
            $laybyeTransaction->remarks = "Laybye";
            $laybyeTransaction->period = $shop['Period'];
            $laybyeTransaction->vatPer = $shop['Period'];
            $laybyeTransaction->crnref = $docNo;
            $laybyeTransaction->dts = new \DateTime();

            $laybyeTransaction->save();

            $summmary = new DailySummary();
            $summmary->BDATE = \date("Y-m-d");
            $summmary->BRNO = $shop['BrNo'];
            $summmary->BTYPE = "DEP";
            $summmary->TRANNO = $depNo;
            $summmary->TAXCODE = null;
            $summmary->VATAMT = 0;
            $summmary->AMT = $laybyeValues["tendered"];
            $summmary->GLCODE = 0;
            $summmary->REMARKS = "Laybye";
            $summmary->COB = $laybyeValues["method"];
            $summmary->STYPE = "Laybye";

            $summmary->UPDFLAG = 0;
            $summmary->TILLNO = $till['tillno'];
            $summmary->DLNO = 0;
            $summmary->UPDNO = 0;
            $summmary->OTTYPE = "L/B";
            $summmary->OTRANNO = $docNo;
            $summmary->ODATE = \date("Y-m-d");
            $summmary->DEBTOR = $id;

            $summmary->BUSER = $user->username;
            $summmary->PERIOD = $shop['Period'];
            $summmary->CCQNUM = "";

            $summmary->save();

            DB::commit();
            return response()->json(['laybye' => $laybye, 'docNo' => $depNo], $this->successStatus);
        } catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

}
