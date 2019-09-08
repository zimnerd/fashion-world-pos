<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AirtimeDetails extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "airtimemaster";

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
    protected $primaryKey = "code";

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
        'descr',
        'netname',
        'vtype',
        'vval',
        'rechargeStr',
        'customercare',
        'note',
        'sp',
        'cp'
    ];
}
