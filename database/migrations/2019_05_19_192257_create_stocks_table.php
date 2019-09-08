<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('stkmast');
        Schema::create('stkmast', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('STYLE');
            $table->string('BRNO');
            $table->string('SIZES');
            $table->string('CLR');
            $table->decimal('GRVQTY');
            $table->decimal('QTY');
            $table->decimal('QOH');
            $table->decimal('LBQOH');
            $table->decimal('APPQOH');
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
        Schema::dropIfExists('stkmast');
    }
}
