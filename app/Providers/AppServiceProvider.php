<?php

namespace App\Providers;

use App\DbDetails;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);
        Passport::withCookieSerialization();

        $detail = DbDetails::all()->last();

        Config::set('database.connections.mysql.database', $detail->dbname);
        DB::purge('mysql');

        App::singleton('tillno', function () {
//            $name = env("TILL_NUM_TXT");
//            $fn = fopen($name, "r");
//            $result = fgets($fn, 20);
//            fclose($fn);
            return 91;
        });
    }
}
