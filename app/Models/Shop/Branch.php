<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "branch";


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
        'code',
        'name',
        'add1',
        'add2',
        'add3',
        'postalCode',
        'tel1',
        'tel2',
        'email',
        'brMngCode',
        'brAssMngCode',
        'companyCode',
        'regionCode',
        'active'
    ];

}
