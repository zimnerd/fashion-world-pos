<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Handset extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "handsetstk";

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = "serialno";

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
        'batch',
        'serialno',
        'bdate',
        'brno',
        'cp',
        'sp',
        'gp',
        'till',
        'user',
        'receiveddate',
        'solddate',
        'csvpath',
        'dlno',
        'invnum',
        'itmnum'
    ];
}
