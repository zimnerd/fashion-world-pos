<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "refunds";


    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = "invNo";

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    public $fillable = [
        'invNo',
        'invType',
        'invDate',
        'idNo',
        'cell',
        'brNo'
    ];

}
