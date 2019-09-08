<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Combo extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "combostyle";


    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = "code";

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

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
        'code',
        'description',
        'startdate',
        'sizes',
        'enddate',
        'active',
        'dts',
        'dlno'
    ];
}
