<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Prices extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "pricefil";


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
        'cp',
        'sp',
        'rp',
        'hp',
        'stfp',
        'cmtp',
        'mdp',
        'outprice',
        'style',
        'sizes',
        'codeseq',
        'deflag',
        'costcode',
        'dtype',
    ];

}
