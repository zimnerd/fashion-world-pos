<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "heldsales";


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
        'id',
        'docnum',
        'type',
        'code',
        'clrcode',
        'colour',
        'cost',
        'description',
        'disc',
        'markdown',
        'price',
        'qty',
        'size',
        'subtotal',
        'total'
    ];

}
