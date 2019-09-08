<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLaybyeTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('lbdet');
        Schema::create('lbdet', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('accNo');
            $table->string('invNo');
            $table->decimal('invAmt');
            $table->string('cheqNo')->nullable();
            $table->date('invDate');
            $table->date('dueDate');
            $table->string('type');
            $table->string('remarks');
            $table->integer('period');
            $table->string('vatPer');
            $table->string('crnref')->nullable();
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
        Schema::dropIfExists('lbdet');
    }
}
