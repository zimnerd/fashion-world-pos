<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Laybye extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "lbmast";


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
        'no',
        'name',
        'email',
        'cell',
        'idNo',
        'line1',
        'line2',
        'line3',
        'appDate',
        'balance',
        'current'
    ];
}
