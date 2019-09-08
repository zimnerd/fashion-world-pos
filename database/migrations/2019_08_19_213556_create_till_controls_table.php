<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTillControlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('tillcontrol');
        Schema::create('tillcontrol', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('tillno');
            $table->string('user')->nullable();
            $table->timestamp('lastlogin_at')->nullable();
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
        Schema::dropIfExists('tillcontrol');
    }
}
