<?php

namespace App\Http\Controllers\Api\Authentication;

use App\Http\Controllers\Controller;
use App\Role;

class AuthenticationController extends Controller
{
    public $successStatus = 200;

    /**
     * Retrieve all available roles.
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveRoles()
    {
        $roles = Role::all();
        return response()->json(["roles" => $roles], $this->successStatus);
    }

}
