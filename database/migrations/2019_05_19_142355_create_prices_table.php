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
            $table->decimal('cp');
            $table->decimal('sp');
            $table->decimal('rp');
            $table->decimal('hp');
            $table->decimal('stfp');
            $table->decimal('cmtp');
            $table->decimal('mdp');
            $table->decimal('outprice');
            $table->string('style');
            $table->string('sizes');
            $table->integer('codeseq');
            $table->tinyInteger('deflag');
            $table->string('costcode');
            $table->char('dtype');
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
