<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHandsetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('handsetstk');
        Schema::create('handsetstk', function (Blueprint $table) {
            $table->string('code');
            $table->string('batch');
            $table->string('serialno')->primary();
            $table->date('bdate');
            $table->string('brno');
            $table->double('cp')->nullable();
            $table->double('sp')->nullable();
            $table->double('gp')->nullable();
            $table->string('till');
            $table->string('user');
            $table->dateTime('receiveddate');
            $table->dateTime('solddate')->nullable();
            $table->string('csvpath');
            $table->integer('dlno')->nullable();
            $table->string('invnum')->nullable();
            $table->integer('itmnum')->nullable();
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
        Schema::dropIfExists('handsetstk');
    }
}
