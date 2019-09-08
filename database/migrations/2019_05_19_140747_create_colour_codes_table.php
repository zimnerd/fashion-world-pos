<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateColourCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('clrcode');
        Schema::create('clrcode', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('productCode');
            $table->integer('sequence');
            $table->string('codeKey');
            $table->float('allocation');
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
        Schema::dropIfExists('clrcode');
    }
}
