<?php

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Model;

class TillDetails extends Model
{

    protected $connection = "tilldb";

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "till_details";


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
        'tillno'
    ];

}
