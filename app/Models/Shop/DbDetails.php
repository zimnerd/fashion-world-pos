<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DbDetails extends Model
{

    protected $connection = "maindb";

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "posdbs";


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
    public $timestamps = false;

    public $fillable = [
        'dbname',
        'dbtype'
    ];
}
