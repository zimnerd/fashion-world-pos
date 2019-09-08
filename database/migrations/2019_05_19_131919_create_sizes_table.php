<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSizesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('sizecodes');
        Schema::create('sizecodes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('sizeCode');
            $table->integer('sequence');
            $table->string('codeKey');
            $table->float('allocation');
            $table->string('sizeCodeDesc');
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
        Schema::dropIfExists('sizecodes');
    }
}
