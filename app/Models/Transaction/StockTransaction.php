<?php

namespace App\Models\Transaction;

use Illuminate\Database\Eloquent\Model;

class StockTransaction extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "stktran";


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

    public $fillable = [
        'ID',
        'STYLE',
        'BRNO',
        'SIZES',
        'CLR',
        'BDATE',
        'REF',
        'BTYPE',
        'QTY',
        'QOH',
        'SP',
        'CP',
        'CSTREF',
        'DLNO',
        'LBTAKEN',
        'SMAN',
        'SLTYPE',
        'AMT',
        'VATAMT',
        'DISCAMT',
        'ASSNO',
        'REASONCODE',
        'REASONCOMMENTS'
    ];

}
