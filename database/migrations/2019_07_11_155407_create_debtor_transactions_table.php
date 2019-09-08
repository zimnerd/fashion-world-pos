<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDebtorTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('debdet');
        Schema::create('debdet', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('accNo');
            $table->string('invNo');
            $table->string('invAmt');
            $table->date('invDate');
            $table->date('dueDate');
            $table->string('type');
            $table->string('remarks');
            $table->integer('period');
            $table->string('vatPer');
            $table->string('crnref');
            $table->dateTime('dts');
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
        Schema::dropIfExists('debtor_transactions');
    }
}
