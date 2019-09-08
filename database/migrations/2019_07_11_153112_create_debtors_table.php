<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDebtorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('debmast');
        Schema::create('debmast', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('no');
            $table->string('stype');
            $table->string('name');
            $table->string('cell');
            $table->string('email')->nullable();
            $table->string('idNo');
            $table->date('appDate');
            $table->decimal('balance');
            $table->decimal('current');
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
        Schema::dropIfExists('debtors');
    }
}
