<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DailyTransaction extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "dlymtdtemp";


    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = "id";

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

    public $fillable = [
        'ID',
        'BRNO',
        'DOCNO',
        'TILLNO',
        'LINENO',
        'DOCTYPE',
        'STYLE',
        'SIZES',
        'CLR',
        'SUP',
        'STYPE',
        'BDATE',
        'BTIME',
        'AMT',
        'VATAMT',
        'QTY',
        'SP',
        'SPX',
        'CP',
        'DTYPE',
        'LPROMPT',
        'DISCPERC',
        'MARKUP',
        'DISCAMT',
        'SMAN',
        'UPDFLAG',
        'LSLTYPE',
        'APPNO',
        'IBTDLNO',
        'DLNO',
        'UPDNO',
        'INVREF',
        'PERIOD',
        'COMMENT',
        'RESCODE',
        'BUSER',
        'AUSER',
        'FWCNO',
        'SERIALNO',
    ];

}
