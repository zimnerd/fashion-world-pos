<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateComboPricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('comboprice');
        Schema::create('comboprice', function (Blueprint $table) {
            $table->string('code');
            $table->string('style')->primary();
            $table->decimal('rp');
            $table->decimal('qty');
            $table->integer('dlno');
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
        Schema::dropIfExists('comboprice');
    }
}
