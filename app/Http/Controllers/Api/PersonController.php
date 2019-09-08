<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Laybye;
use App\Person;

class PersonController extends Controller
{
    public $successStatus = 200;
    public $notFoundStatus = 404;

    /**
     * Retrieve a person
     *
     * @param $cell
     * @return \Illuminate\Http\Response
     */
    public function retrievePerson($cell)
    {
        $person = Laybye::query()
            ->where("cell", $cell)
            ->first();

        if (!$person) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(["person" => $person], $this->successStatus);
    }

}
