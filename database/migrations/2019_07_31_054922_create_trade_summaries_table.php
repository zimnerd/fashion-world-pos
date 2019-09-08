<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTradeSummariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('dslssum');
        Schema::create('dslssum', function (Blueprint $table) {
            $table->bigIncrements('ID');
            $table->string("brno");
            $table->date("bdate");
            $table->integer("TILLNO");
            $table->integer("PERIOD");
            $table->decimal("SLS")->default(0.00);
            $table->decimal("PDCS")->default(0.00);
            $table->decimal("CREDITS")->default(0.00);
            $table->decimal("CASHS")->default(0.00);
            $table->decimal("CODS")->default(0.00);
            $table->decimal("CHQS")->default(0.00);
            $table->decimal("CCARDS")->default(0.00);
            $table->decimal("CCC")->default(0.00);
            $table->decimal("CREDITC")->default(0.00);
            $table->decimal("CASHC")->default(0.00);
            $table->decimal("REFUNDC")->default(0.00);
            $table->decimal("CODC")->default(0.00);
            $table->decimal("LAYBYES")->default(0.00);
            $table->decimal("LAYBYEC")->default(0.00);
            $table->decimal("PDCC")->default(0.00);
            $table->decimal("OTHER")->default(0.00);
            $table->decimal("DEBPAY")->default(0.00);
            $table->decimal("STFPAY")->default(0.00);
            $table->decimal("STFRECS")->default(0.00);
            $table->decimal("LOANPAID")->default(0.00);
            $table->decimal("LOANRECV")->default(0.00);
            $table->decimal("PDCPAY")->default(0.00);
            $table->decimal("CODPAY")->default(0.00);
            $table->decimal("CSHREF")->default(0.00);
            $table->decimal("CHQDEP")->default(0.00);
            $table->decimal("LBPAY")->default(0.00);
            $table->decimal("OTHER2")->default(0.00);
            $table->decimal("CSEXINV")->default(0.00);
            $table->decimal("CREXINV")->default(0.00);
            $table->decimal("CELLP")->default(0.00);
            $table->decimal("SPACK")->default(0.00);
            $table->decimal("AIRTIME")->default(0.00);
            $table->decimal("CXCESS")->default(0.00);
            $table->decimal("TOTBANK")->default(0.00);
            $table->decimal("TOTRFDS")->default(0.00);
            $table->decimal("RDS")->default(0.00);
            $table->decimal("TOTCSHBNK")->default(0.00);
            $table->decimal("TOTCCS")->default(0.00);
            $table->decimal("LBCRS")->default(0.00);
            $table->decimal("TOTCP")->default(0.00);
            $table->decimal("TOTSP")->default(0.00);
            $table->integer("USLS")->default(0);
            $table->integer("URET")->default(0);
            $table->integer("TINVS")->default(0);
            $table->integer("TCRNS")->default(0);
            $table->decimal("TOTDISC")->default(0.00);
            $table->decimal("CASHPAY")->default(0.00);
            $table->decimal("CASHRET")->default(0.00);
            $table->decimal("CASHREC")->default(0.00);
            $table->decimal("CCPAY")->default(0.00);
            $table->decimal("CCRET")->default(0.00);
            $table->decimal("CCREC")->default(0.00);
            $table->decimal("CHQPAY")->default(0.00);
            $table->decimal("CHQRET")->default(0.00);
            $table->decimal("CHQREC")->default(0.00);
            $table->decimal("EFTPAY")->default(0.00);
            $table->decimal("EFTRET")->default(0.00);
            $table->decimal("EFTREC")->default(0.00);
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
        Schema::dropIfExists('dslssum');
    }
}
