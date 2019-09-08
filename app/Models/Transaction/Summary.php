<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Summary extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "poscb";


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
        'ID',
        'BDATE',
        'BRNO',
        'BTYPE',
        'TRANNO',
        'TAXCODE',
        'VATAMT',
        'AMT',
        'GLCODE',
        'REMARKS',
        'COB',
        'STYPE',
        'UPDFLAG',
        'TILLNO',
        'DLNO',
        'UPDNO',
        'OTTYPE',
        'OTRANNO',
        'ODATE',
        'DEBTOR',
        'BUSER',
        'AUSER',
        'PERIOD',
        'CCQNUM',
    ];
}
