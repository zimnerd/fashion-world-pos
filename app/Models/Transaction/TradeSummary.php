<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TradeSummary extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "dslssum";

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = "ID";

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    protected $fillable = [
        "ID",
        "brno",
        "bdate",
        "TILLNO",
        "PERIOD",
        "SLS",
        "PDCS",
        "CASHS",
        "CODS",
        "CHQS",
        "CCARDS",
        "CCC",
        "CREDIT",
        "CASHC",
        "REFUND",
        "CODC",
        "LAYBYEC",
        "LAYBYES",
        "PDCC",
        "OTHER",
        "DEBPAY",
        "STFPAY",
        "STFRECS",
        "LOANPAI",
        "LOANREC",
        "PDCPAY",
        "CODPAY",
        "CSHREF",
        "CHQDEP",
        "LBPAY",
        "OTHER2",
        "CSEXINV",
        "CREXINV",
        "CELLP",
        "SPACK",
        "AIRTIME",
        "CXCESS",
        "TOTBANK",
        "TOTRFDS",
        "RDS",
        "TOTCSHB",
        "TOTCCS",
        "LBCRS",
        "TOTCP",
        "TOTSP",
        "USLS",
        "URET",
        "TINVS",
        "TCRNS",
        "TOTDISC",
        "CASHPAY",
        "CASHRET",
        "CASHREC",
        "CCPAY",
        "CCRET",
        "CCREC",
        "CHQPAY",
        "CHQRET",
        "CHQREC",
        "EFTPAY",
        "EFTRET",
        "EFTREC"
    ];

}
