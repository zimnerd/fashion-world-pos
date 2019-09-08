<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCombosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('combostyle');
        Schema::create('combostyle', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('description');
            $table->date('startdate');
            $table->date('enddate');
            $table->tinyInteger('active');
            $table->dateTime('dts');
            $table->string('dlno');
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
        Schema::dropIfExists('combostyle');
    }
}
