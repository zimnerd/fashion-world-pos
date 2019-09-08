<?php

namespace App\Http\Controllers\Api\Authentication;

use App\Http\Controllers\Controller;
use App\Permissions;
use App\Role;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public $successStatus = 200;
    public $createStatus = 201;
    public $unauthorizedStatus = 401;
    public $errorStatus = 500;

    /**
     * Login to the application.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $this->validate($request, [
            'username' => 'required',
            'password' => 'required'
        ]);

        $credentials = $request->all();
            if (array_key_exists("till",$credentials))
            { 
                unset($credentials["till"]);
            }

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            $token = $user->createToken($credentials['username'], ['user'])->accessToken;
            $success['token'] = $token;
            $user['api_token'] = $token;

            $user->save();

            return response()->json(['success' => $success], $this->successStatus);
        } else {
            return response()->json(['error' => 'Unauthorised'], $this->unauthorizedStatus);
        }
    }

    /**
     * Register for the application.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'username' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'confirm' => 'required|same:password',
            'role' => 'required'
        ]);

        $input = $request->all();

        try {
            DB::beginTransaction();

            $input['password'] = bcrypt($input['password']);

            $user = User::create($input);

            $success['token'] = $user->createToken($user->username, ['user'])->accessToken;
            $success['name'] = $user->name;

            DB::commit();

            return response()->json(['success' => $success], $this->createStatus);
        } catch (\PDOException $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Retrieve the details of the supplied user.
     *
     * @return \Illuminate\Http\Response
     */
    public function details()
    {
        /** @var User $user */
        $user = Auth::user();

        /** @var Role $role */
        $role = Role::query()->where('code', $user->role)->first();
        $user->role = $role;

        return response()->json(['user' => $user], $this->successStatus);
    }

    /**
     * Check the supplied details as an admin user.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function adminLogin(Request $request)
    {
        $this->validate($request, [
            'username' => 'required',
            'password' => 'required'
        ]);

        $credentials = $request->all();

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            $roles = $this->mapPermissions($user['role']);

            $token = $user->createToken($credentials['username'], $roles)->accessToken;
            $success['token'] = $token;
            $user['api_token'] = $token;

            $user->save();

            return response()->json(['success' => $success], $this->successStatus);
        } else {
            return response()->json(['error' => 'Unauthorised'], 401);
        }
    }

    private function mapPermissions($role)
    {
        $roles = ["user"];

        /** @var Permissions $permissions */
        $permissions = Permissions::query()
            ->where('code', $role)
            ->first();

        if ($permissions->staffPrices) {
            $roles[] = 'staff';
        }

        if ($permissions->priceAmendments) {
            $roles[] = 'amendments';
        }

        if ($permissions->creditSales) {
            $roles[] = 'sales';
        }

        if ($permissions->creditNotes) {
            $roles[] = 'notes';
        }

        return $roles;
    }

}
