<?php

namespace App\Http\Controllers\Api;

use App\Salesman;

class SalesmanController
{
    public $successStatus = 200;
    public $notFoundStatus = 404;

    /**
     * Retrieve all salesmen
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveSalesmen()
    {
        $salesmen = Salesman::all();

        if (!$salesmen) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(["salesmen" => $salesmen], $this->successStatus);
    }

}
