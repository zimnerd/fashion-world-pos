<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAirtimesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('airtime');
        Schema::create('airtime', function (Blueprint $table) {
            $table->string('code');
            $table->string('batch');
            $table->string('pin');
            $table->string('serialno')->primary();
            $table->date('expiry')->nullable();
            $table->string('description');
            $table->string('Brno');
            $table->double('cp')->nullable();
            $table->double('sp')->nullable();
            $table->double('gp')->nullable();
            $table->string('till')->nullable();
            $table->string('user');
            $table->dateTime('receiveddate')->nullable();
            $table->dateTime('solddate')->nullable();
            $table->string('csvpath');
            $table->string('dlno')->nullable();
            $table->string('transflag')->nullable();
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
        Schema::dropIfExists('airtime');
    }
}
