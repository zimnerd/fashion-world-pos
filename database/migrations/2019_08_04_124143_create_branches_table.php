<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBranchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('branch');
        Schema::create('branch', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code');
            $table->string('name');
            $table->string('add1')->default("");
            $table->string('add2')->default("");
            $table->string('add3')->default("");
            $table->string('postalCode')->default("");
            $table->string('tel1')->default("");
            $table->string('tel2')->default("");
            $table->string('email');
            $table->string('brMngCode');
            $table->string('brAssMngCode');
            $table->string('companyCode');
            $table->string('regionCode');
            $table->boolean('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('branches');
    }
}
