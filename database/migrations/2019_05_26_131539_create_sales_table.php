<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('heldsales');
        Schema::create('heldsales', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('docnum');
            $table->string('type');
            $table->string('code');
            $table->string('colour');
            $table->string('clrcode');
            $table->decimal('cost');
            $table->string('description');
            $table->decimal('disc');
            $table->boolean('markdown');
            $table->decimal('price');
            $table->integer('qty');
            $table->string('size');
            $table->decimal('subtotal');
            $table->decimal('total');
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
        Schema::dropIfExists('heldsales');
    }
}
