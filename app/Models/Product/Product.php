<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    const CREATED_AT = 'created';
    const UPDATED_AT = 'lstUpdate';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "product";

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
        'unit',
        'pack',
        'soh',
        'suply',
        'sp1',
        'sp2',
        'sp3',
        'sp4',
        'sp5',
        'sp6',
        'sp7',
        'sp8',
        'sp9',
        'sp10',
        'pprice',
        'promnow',
        'promoStart',
        'promoEnd',
        'cpe',
        'cpi',
        'acp',
        'link',
        'vati',
        'loc',
        'dept',
        'entpi',
        'idate',
        'rqty',
        'qytd',
        'valytd',
        'qmtd',
        'valmtd',
        'skunum',
        'mdate',
        'weight',
        'area',
        'agentCom',
        'noDisc',
        'altStock',
        'altItem',
        'blkQty',
        'blkSP',
        'LstPurPrice1',
        'LstPurPrice2',
        'LstPurPrice3',
        'blkSOH',
        'blkLoc',
        'minQty',
        'descr2',
        'type',
        'category',
        'extra1',
        'extra2',
        'extra3',
        'extra4',
        'extra5',
        'suplyCode',
        'itemType',
        'altPrinter',
        'salesVat',
        'purVat',
        'backOrder',
        'maxQty',
        'sizes',
        'clr',
        'groupCode',
        'itemCode',
        'seasonCode',
        'sourceCode',
        'classCode',
        'linkCode',
        'active',
        'impLoc',
        'maxDisc',
        'grvDate',
        'imageLocation',
        'cellType',
        'class1',
        'class2',
        'class3',
        'chkstk',
        'packawayf',
        'sequence',
        'grvqty',
        'lbqoh',
        'appqoh',
        'stkTakeDate',
        'choosePrice'
    ];

}
