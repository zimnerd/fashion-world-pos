<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('stktran');
        Schema::create('stktran', function (Blueprint $table) {
            $table->bigIncrements('ID');
            $table->string('STYLE');
            $table->string('BRNO');
            $table->string('SIZES');
            $table->string('CLR');
            $table->date('BDATE');
            $table->string('REF');
            $table->decimal('VATAMT');
            $table->decimal('DISCAMT');
            $table->decimal('AMT');
            $table->decimal('QTY');
            $table->decimal('QOH');
            $table->decimal('SP');
            $table->decimal('CP');
            $table->string('BTYPE');
            $table->string('CSTREF')->nullable();
            $table->integer('DLNO');
            $table->string('LBTAKEN')->nullable();
            $table->char('SLTYPE');
            $table->string('SMAN')->nullable();
            $table->integer('ASSNO');
            $table->string('REASONCODE')->nullable();
            $table->string('REASONCOMMENTS')->nullable();
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
        Schema::dropIfExists('stktran');
    }
}
