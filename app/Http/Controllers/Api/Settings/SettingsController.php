<?php

namespace App\Http\Controllers\Api\Settings;

use App\Branch;
use App\ComboPrice;
use App\Haddith;
use App\Http\Controllers\Controller;
use App\Reason;
use App\Shop;
use App\Tax;
use App\Till;
use App\TillRefs;
use App\TillControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class SettingsController extends Controller
{

    public $successStatus = 200;
    public $notFoundStatus = 404;
    public $errorStatus = 500;

    /**
     * Retrieve the shop settings
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveShopDetails()
    {
        $shopInfo = Shop::all();

        $details = array();
        foreach ($shopInfo as $info) {
            $details[$info->ColName] = $info->ColValue;
        }

        return response()->json(['shop' => $details], $this->successStatus);
    }

    /**
     * Save the shop settings
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function saveShop(Request $request)
    {
        $this->validate($request, [
            'nextLaybyeNo' => 'required'
        ]);

        $shop = $request->all();

        $shopInfo = Shop::query()
            ->where('ColName', 'nextLaybyeNo')
            ->first();

        $shopInfo->ColValue = $shop['nextLaybyeNo'];
        $shopInfo->save();

        return response()->json(["shop" => $shopInfo], $this->successStatus);
    }

    /**
     * Retrieve the till settings
     *
     * @param integer $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveTillDetails($id)
    {
        $tillInfo = Till::query()->where('tillno', $id)->get();

        if (count($tillInfo) === 0) {
            return response()->json([], $this->notFoundStatus);
        }

        $details = array();
        foreach ($tillInfo as $info) {
            $details[$info->ColName] = $info->ColValue;
        }

        $details['tillno'] = $id;

        return response()->json(['till' => $details], $this->successStatus);
    }

    /**
     * Retrieve the till settings
     *
     * @param integer $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveHaddith()
    {
        /**
         * @var Shop $rotateDate
         */
        $rotateDate = Shop::query()->where('ColName', 'LastHaddithRotatedDate')->first();

        if (!$rotateDate) {
            return response()->json([], $this->notFoundStatus);
        }

        $nowDateTime = \date('Y-m-d');

        /**
         * @var Haddith $haddith
         */
        $haddith = Haddith::query()->where('active', true)->first();

        if ($nowDateTime > $rotateDate['ColValue']) {
            $haddith->active = false;
            $haddith->save();

            $haddith = Haddith::query()->where('id', $haddith->id + 1)->first();
            if (empty($haddith)) {
                $haddith = Haddith::query()->where('id', 1)->first();
            }

            $haddith->active = true;
            $haddith->save();

            $rotateDate->ColValue = $nowDateTime;
            $rotateDate->save();
        }

        return response()->json(['haddith' => $haddith], $this->successStatus);
    }

    /**
     * Retrieve the tills
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveTills()
    {
        $tills = TillRefs::all();

        return response()->json(['tills' => $tills], $this->successStatus);
    }


    /**
     * Save the till settings.
     *
     * @param string $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function saveTill($id, Request $request)
    {
        $this->validate($request, [
            'InvNo' => 'required',
            'DepNo' => 'required',
            'CredInvNo' => 'required',
            'LbNo' => 'required',
            'CrnNo' => 'required',
            'tillno' => 'required'
        ]);

        $till = $request->all();

        $tillInfo = Till::query()
            ->where('tillno', $id)
            ->get();

        if (!$tillInfo) {
            return response()->json([], $this->notFoundStatus);
        }

        try {
            DB::beginTransaction();

            /**
             * @var Till $info
             */
            foreach ($tillInfo as $info) {
                switch ($info->ColName) {
                    case "InvNo":
                        $info->ColValue = $request['InvNo'];
                        break;
                    case "DepNo":
                        $info->ColValue = $request['DepNo'];
                        break;
                    case "CredInvNo":
                        $info->ColValue = $request['CredInvNo'];
                        break;
                    case "CrnNo":
                        $info->ColValue = $request['CrnNo'];
                        break;
                    case "LbNo":
                        $info->ColValue = $request['LbNo'];
                        break;
                }

                $info->save();
            }

            DB::commit();
            return response()->json(['till' => $till], $this->successStatus);
        } catch (\PDOException $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Retrieve all running combos
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveCombos()
    {
        $now = date('Y-m-d');
        $combos = ComboPrice::query()
            ->select('comboprice.code', 'comboprice.style', 'comboprice.rp', 'comboprice.qty', 'combostyle.description')
            ->join('combostyle', 'combostyle.code', '=', 'comboprice.code')
            ->where('combostyle.active', 1)
            ->where('combostyle.startdate', '<=', $now)
            ->where('combostyle.enddate', '>=', $now)
            ->get();

        if (!$combos) {
            return response()->json(['error' => 'The combo cannot be found.'], $this->notFoundStatus);
        }

        return response()->json(['combos' => $combos], $this->successStatus);
    }

    /**
     * Retrieve all branch codes
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveBranches()
    {
        $branches = Branch::all(["code"]);
        if (count($branches) === 0) {
            return response()->json(['error' => 'The branches cannot be found.'], $this->notFoundStatus);
        }

        return response()->json(['branches' => $branches], $this->successStatus);
    }

    /**
     * Retrieve tax rate
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveTax()
    {
        $tax = Tax::query()
            ->select(["rate"])
            ->where("taxcode", 1)
            ->first();

        if (!$tax) {
            return response()->json(['error' => 'The branches cannot be found.'], $this->notFoundStatus);
        }

        return response()->json(['tax' => $tax->rate], $this->successStatus);
    }

    /**
     * Retrieves the list of all refund reasons.
     *
     * @return \Illuminate\Http\Response
     */
    public function refundReasons()
    {
        $reasons = Reason::all();
        return response()->json(["reasons" => $reasons], $this->successStatus);
    }

    /**
     * Retrieves the active till number.
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveTillNumber(Request $request)
    {
        $number = app("tillno");
        return response()->json(["number" => $number], $this->successStatus);
    }

    /**
     * Retrieves the controls for a specific till number.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveControls($id)
    {
        $tillControl = TillControl::query()
            ->where("tillno", $id)
            ->first();

        if (!$tillControl) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(["control" => $tillControl], $this->successStatus);
    }

    /**
     * Updates the controls for a specific till number.
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function updateControls($id, Request $request)
    {
        $tillControl = TillControl::query()
            ->where("tillno", $id)
            ->first();

        if (!$tillControl) {
            return response()->json([], $this->notFoundStatus);
        }

        $control = $request->all();

        $control['lastlogin_at'] = \date('Y-m-d H:i:s');
        $tillControl->update($control);

        return response()->json(["control" => $tillControl], $this->successStatus);
    }

}
