<?php

namespace App\Http\Controllers\Api\Product;

use App\Airtime;
use App\AirtimeDetails;
use App\Http\Controllers\Controller;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\View;

class AirtimeController extends Controller
{
    public $successStatus = 200;
    public $notFoundStatus = 404;

    /**
     * Print airtime vouchers
     *
     * @param $code
     * @param $serialNo
     * @return Response
     */
    public function printVoucher($code, $serialNo)
    {
        $voucher = AirtimeDetails::query()
            ->where("code", $code)
            ->first();

        if (!$voucher) {
            return response()->json([], $this->notFoundStatus);
        }

        $airtime = Airtime::query()
            ->where("code", $code)
            ->where("serialno", $serialNo)
            ->first();

        if (!$airtime) {
            return response()->json([], $this->notFoundStatus);
        }

        $date = \date('Y-m-d');

        /**
         * @var SnappyPdf $snappy
         */
        $snappy = App::make('snappy.pdf');
        $html = View::make('airtime', [
            "description" => $voucher['descr'],
            "network" => $voucher['netname'],
            "vtype" => $voucher['vtype'],
            "pin" => $airtime['pin'],
            "recharge" => $voucher['rechargeStr'],
            "customerCare" => $voucher['customercare'],
            "serialNo" => $serialNo,
            "batch" => $airtime['batch'],
            "date" => $date
        ]);
        return new Response(
            $snappy->getOutputFromHtml($html),
            200,
            array(
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="airtime.pdf"'
            )
        );

    }

}
