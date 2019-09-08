<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('pricefil');
        Schema::create('pricefil', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->decimal('cp')->nullable();
            $table->decimal('sp')->nullable();
            $table->decimal('rp')->nullable();
            $table->decimal('hp')->nullable();
            $table->decimal('stfp')->nullable();
            $table->decimal('cmtp')->nullable();
            $table->decimal('mdp')->nullable();
            $table->decimal('outprice')->nullable();
            $table->string('style')->nullable();
            $table->string('sizes')->nullable();
            $table->integer('codeseq')->nullable();
            $table->tinyInteger('deflag')->nullable();
            $table->string('costcode')->nullable();
            $table->char('dtype')->nullable();
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
        Schema::dropIfExists('pricefil');
    }
}
