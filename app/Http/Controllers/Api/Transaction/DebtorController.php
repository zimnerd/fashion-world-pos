<?php

namespace App\Http\Controllers\Api\Transaction;

use App\DailySummary;
use App\Debtor;
use App\DebtorTransaction;
use App\Http\Controllers\Controller;
use App\Till;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Log;

class DebtorController extends Controller
{
    public $successStatus = 200;
    public $createdStatus = 201;
    public $notFoundStatus = 404;
    public $errorStatus = 500;

    /**
     * Retrieves all debtors
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveDebtors()
    {
        $type = Input::get('stype');
        $types = preg_split("/,/", $type);
        $debtorsQuery = Debtor::query();

        $index = 0;
        foreach ($types as $newType) {
            if ($index === 0) {
                $debtorsQuery->where('stype', $newType);
            } else {
                $debtorsQuery->orWhere('stype', $newType);
            }

            $index++;
        }

        $debtors = $debtorsQuery->get();

        $count = Debtor::all()->count();

        if (count($debtors) === 0) {
            return response()->json(["next" => $count + 1], $this->notFoundStatus);
        }

        return response()->json(['debtors' => $debtors, "next" => $count + 1], $this->successStatus);
    }

    /**
     * Retrieves a debtor
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveDebtor($id)
    {
        $type = Input::get('stype');
        $debtor = Debtor::query()
            ->where('stype', $type)
            ->where('no', $id)
            ->first();

        if (!$debtor) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(['debtor' => $debtor], $this->successStatus);
    }

    /**
     * Pays the account of a debtor
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function payDebtor($id, Request $request)
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
             * @var Debtor $debtorValues
             */
            $debtorValues = $request->all();

            $debtor = Debtor::query()
                ->where('no', $id)
                ->first();

            if (!$debtor) {
                return response()->json([], $this->notFoundStatus);
            }

            $account = $debtorValues['account'];

            $debtor->current = $account['current'];
            $debtor->balance = $account['balance'];
            $debtor->save();

            $till = $debtorValues['till'];

            $tillInfo = Till::query()
                ->where('tillno', $till['tillno'])
                ->where('ColName', 'CrnNo')
                ->first();

            if (!$tillInfo) {
                return response()->json([], $this->notFoundStatus);
            }

            $docNo = (string)(((int)$tillInfo->ColValue) + 1);

            $tillInfo->ColValue = $docNo;
            $tillInfo->save();

            $docNo = '1' . $docNo;

            $shop = $debtorValues['shop'];

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

            $debtorTransaction = new DebtorTransaction();

            $debtorTransaction->accNo = $id;
            $debtorTransaction->invNo = $docNo;
            $debtorTransaction->invAmt = $debtorValues["tendered"];
            $debtorTransaction->invDate = \date("Y-m-d");
            $debtorTransaction->dueDate = \date("Y-m-d");
            $debtorTransaction->type = "DEP";
            $debtorTransaction->remarks = $debtorValues["type"];
            $debtorTransaction->period = $shop['Period'];
            $debtorTransaction->vatPer = $shop['Period'];
            $debtorTransaction->crnref = $docNo;
            $debtorTransaction->dts = new \DateTime();

            $debtorTransaction->save();

            $summmary = new DailySummary();
            $summmary->BDATE = \date("Y-m-d");
            $summmary->BRNO = $shop['BrNo'];
            $summmary->BTYPE = "DEP";
            $summmary->TRANNO = $depNo;
            $summmary->TAXCODE = null;
            $summmary->VATAMT = 0;
            $summmary->AMT = $debtorValues["tendered"];
            $summmary->GLCODE = 0;
            $summmary->REMARKS = $debtorValues["type"];
            $summmary->COB = $debtorValues["method"];
            $summmary->STYPE = $debtorValues["method"];

            $summmary->UPDFLAG = 0;
            $summmary->TILLNO = $till['tillno'];
            $summmary->DLNO = 0;
            $summmary->UPDNO = 0;
            $summmary->OTTYPE = "CRN";
            $summmary->OTRANNO = $docNo;
            $summmary->ODATE = \date("Y-m-d");
            $summmary->DEBTOR = $id;

            $summmary->BUSER = $user->username;
            $summmary->PERIOD = $shop['Period'];
            $summmary->CCQNUM = "";

            $summmary->save();

            DB::commit();
            return response()->json(['debtor' => $debtor, 'docNo' => $docNo], $this->successStatus);
        } catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Saves a debtor
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function saveDebtor(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'cell' => 'required',
            'type' => 'required'
        ]);

        /**
         * @var Debtor $debtor
         */
        $debtor = $request->all();
        switch ($debtor['type']) {
            case "Credit":
                $debtor['stype'] = "Credit";
                break;
            case "Staff":
                $debtor['stype'] = "Staff";
                break;
            case "DCS":
                $debtor['stype'] = "DCS";
                break;
        }

        $debNo = "LB" . $debtor["no"];
        $debtor["no"] = $debNo;

        $debtor = new Debtor($debtor);
        $debtor->appDate = \date('Y-m-d');

        if ($debtor->balance === null) {
            $debtor->balance = 0.0;
            $debtor->current = 0.0;
        }

        $debtor->save();

        return response()->json(['debtor' => $debtor], $this->createdStatus);
    }

}
