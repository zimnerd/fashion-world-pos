<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "people";


    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = "docNo";

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
        'docNo',
        'docType',
        'name',
        'idNo',
        'email',
        'cell'
    ];
}
