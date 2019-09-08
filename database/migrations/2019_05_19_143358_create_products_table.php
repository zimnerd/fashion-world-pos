<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('product');
        Schema::create('product', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('descr')->nullable();
            $table->string('unit')->nullable();
            $table->integer('pack')->nullable();
            $table->double('soh')->nullable();
            $table->string('suply')->nullable();
            $table->double('sp1')->nullable();
            $table->double('sp2')->nullable();
            $table->double('sp3')->nullable();
            $table->double('sp4')->nullable();
            $table->double('sp5')->nullable();
            $table->double('sp6')->nullable();
            $table->double('sp7')->nullable();
            $table->double('sp8')->nullable();
            $table->double('sp9')->nullable();
            $table->double('sp10')->nullable();
            $table->double('pprice')->nullable();
            $table->char('promnow')->nullable();
            $table->date('promoStart')->nullable();
            $table->date('promoEnd')->nullable();
            $table->double('cpe')->nullable();
            $table->double('cpi')->nullable();
            $table->double('acp')->nullable();
            $table->string('link')->nullable();
            $table->char('vati')->nullable();
            $table->string('loc')->nullable();
            $table->string('dept')->nullable();
            $table->char('entpi')->nullable();
            $table->date('idate')->nullable();
            $table->double('rqty')->nullable();
            $table->double('qytd')->nullable();
            $table->double('valytd')->nullable();
            $table->double('qmtd')->nullable();
            $table->double('valmtd')->nullable();
            $table->string('skunum')->nullable();
            $table->date('mdate')->nullable();
            $table->double('weight')->nullable();
            $table->double('area')->nullable();
            $table->string('agentCom')->nullable();
            $table->char('noDisc')->nullable();
            $table->char('altStock')->nullable();
            $table->char('altItem')->nullable();
            $table->string('blkQty')->nullable();
            $table->string('blkSP')->nullable();
            $table->double('LstPurPrice1')->nullable();
            $table->double('LstPurPrice2')->nullable();
            $table->double('LstPurPrice3')->nullable();
            $table->double('blkSOH')->nullable();
            $table->string('blkLoc')->nullable();
            $table->double('minQty')->nullable();
            $table->string('descr2')->nullable();
            $table->string('type')->nullable();
            $table->string('category')->nullable();
            $table->string('extra1')->nullable();
            $table->string('extra2')->nullable();
            $table->string('extra3')->nullable();
            $table->string('extra4')->nullable();
            $table->string('extra5')->nullable();
            $table->string('suplyCode')->nullable();
            $table->string('itemType')->nullable();
            $table->string('altPrinter')->nullable();
            $table->double('salesVat')->nullable();
            $table->double('purVat')->nullable();
            $table->double('backOrder')->nullable();
            $table->double('maxQty')->nullable();
            $table->string('sizes')->nullable();
            $table->string('clr')->nullable();
            $table->string('groupCode')->nullable();
            $table->string('itemCode')->nullable();
            $table->string('seasonCode')->nullable();
            $table->string('sourceCode')->nullable();
            $table->string('classCode')->nullable();
            $table->string('linkCode')->nullable();
            $table->integer('active')->nullable();
            $table->string('impLoc')->nullable();
            $table->double('maxDisc')->nullable();
            $table->date('grvDate')->nullable();
            $table->string('imageLocation')->nullable();
            $table->string('cellType')->nullable();
            $table->string('class1')->nullable();
            $table->string('class2')->nullable();
            $table->string('class3')->nullable();
            $table->string('chkstk')->nullable();
            $table->integer('packawayf')->nullable();
            $table->integer('sequence')->nullable();
            $table->double('grvqty')->nullable();
            $table->double('lbqoh')->nullable();
            $table->double('appqoh')->nullable();
            $table->dateTime('stkTakeDate')->nullable();
            $table->string('choosePrice')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product');
    }
}
