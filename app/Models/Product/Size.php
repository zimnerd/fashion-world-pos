<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "sizecodes";


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
        'sizeCode',
        'sequence',
        'codeKey',
        'allocation',
        'sizeCodeDesc'
    ];

}
