<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAirtimeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('airtimemaster');
        Schema::create('airtimemaster', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('descr');
            $table->string('netname');
            $table->string('vtype');
            $table->double('vval');
            $table->string('rechargeStr');
            $table->string('customercare');
            $table->string('note');
            $table->double('cp');
            $table->double('sp');
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
        Schema::dropIfExists('airtimemaster');
    }
}
