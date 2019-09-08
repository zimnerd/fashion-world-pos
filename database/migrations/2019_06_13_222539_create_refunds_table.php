<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefundsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('refunds');
        Schema::create('refunds', function (Blueprint $table) {
            $table->string('invNo')->primary();
            $table->string('invType');
            $table->date('invDate');
            $table->string('idNo');
            $table->string('cell');
            $table->string('brNo');
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
        Schema::dropIfExists('refunds');
    }
}
