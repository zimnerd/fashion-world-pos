<?php


namespace App\Http\Controllers\Api\Product;

use App\Airtime;
use App\ColourCode;
use App\Colours;
use App\ComboPrice;
use App\Handset;
use App\Http\Controllers\Controller;
use App\Prices;
use App\Product;
use App\Stock;
use ErrorException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public $successStatus = 200;
    public $notFoundStatus = 404;

    /**
     * Retrieve the products in the application
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function retrieveStock(Request $request)
    {
        $search = $request->input('search');
        $limit = $request->input('limit');
        if (!$limit) {
            $limit = 25;
        }

        if (!$search) {
            $products = Product::paginate($limit);
        } else {
            $products = Product::query()
                ->where('code', 'LIKE', "%{$search}%")
                ->orWhere('descr', 'LIKE', "%{$search}%")
                ->paginate($limit);
        }

        return response()->json(['products' => $products], $this->successStatus);
    }


    /**
     * Retrieve a product
     *
     * @param string $code
     * @return \Illuminate\Http\Response
     */
    public function retrieveProduct($code)
    {
        /**
         * @var Product $product
         */
        $product = Product::find($code);
        if (!$product) {
            return response()->json(['error' => 'The product style code applied cannot be found.'], $this->notFoundStatus);
        }

        $queryBuilder = ColourCode::query();
        $queryBuilder->where('productCode', $product->code);
        $codes = $queryBuilder->get();

        $colours = array();
        foreach ($codes as $code) {
            $queryBuilder = Colours::query();
            $queryBuilder->where('code', $code->codeKey);
            $colour = $queryBuilder->get();
            if ($colour) {
                $colours[] = $colour[0];
            }
        }

        $queryBuilder = Prices::query();
        $queryBuilder->where('style', $product->code);
        $prices = $queryBuilder->get();

        // the product is either a handset or airtime
        $items = array();
        $serial = false;
        if (count($prices) === 0) {
            $queryBuilder = Handset::query();
            $queryBuilder->where('code', $product->code)
                ->whereNull('solddate');
            $items = $queryBuilder->get();
            $serial = true;

            if (count($items) === 0) {
                $queryBuilder = Airtime::query();
                $queryBuilder->where('code', $product->code)
                    ->whereNull('solddate')
                    ->orderBy('receiveddate', 'asc');
                $items[] = $queryBuilder->first();
                $serial = false;
            }
        }

        $queryBuilder = Stock::query();
        $queryBuilder->where('style', $product->code);
        $quantities = $queryBuilder->get();

        $location = env("PICS_LOCATION");
        $name = $location . strtolower($product->code) . ".jpg";
        $image = "";

        try {
            $file = file_get_contents($name);
            if ($file !== FALSE) {
                $image = "" . base64_encode($file) . "";
            }
        } catch (ErrorException $exception) {
            Log::debug("The following image cannot be found: " . $name);
        }

        $response = array(
            "code" => $product->code,
            "description" => $product->descr,
            "colours" => $colours,
            "prices" => $prices,
            "info" => $quantities,
            "items" => $items,
            "image" => $image,
            "serial" => $serial
        );

        return response()->json(['product' => $response], $this->successStatus);
    }

    /**
     * Retrieve a product with a style and serial number
     *
     * @param string $code
     * @param $serialno
     * @return \Illuminate\Http\Response
     */
    public function retrieveItem($code, $serialno)
    {
        /**
         * @var Product $product
         */
        $product = Product::query()
            ->join('handsetstk', 'handsetstk.code', '=', 'product.code')
            ->where('product.code', $code)
            ->where('handsetstk.serialno', $serialno)
            ->whereNull('handsetstk.solddate')
            ->first();

        if (!$product) {
            return $this->retrieveAirtime($code, $serialno);
        }

        /**
         * @var Product $product
         */
        $product = Product::query()
            ->select('handsetstk.serialno', 'product.code', 'product.descr', 'sizecodes.codeKey', 'colours.code AS clrcode',
                'colours.colour', 'handsetstk.sp', 'handsetstk.cp')
            ->join('clrcode', 'clrcode.productCode', '=', 'product.code')
            ->join('colours', 'colours.code', '=', 'clrcode.codeKey')
            ->join('sizecodes', 'sizecodes.sizeCode', '=', 'product.sizes')
            ->join('handsetstk', 'handsetstk.code', '=', 'product.code')
            ->where('product.code', $code)
            ->where('handsetstk.serialno', $serialno)
            ->first();

        $product['rp'] = $product['sp'];
        $product['stfp'] = $product['sp'];
        $product['mdp'] = 0;

        return response()->json(['product' => $product], $this->successStatus);
    }

    private function retrieveAirtime($code, $serialno)
    {
        /**
         * @var Product $product
         */
        $product = Product::query()
            ->join('airtime', 'airtime.code', '=', 'product.code')
            ->where('product.code', $code)
            ->where('airtime.serialno', $serialno)
            ->whereNull('airtime.solddate')
            ->first();

        if (!$product) {
            return response()->json(['error' => 'The product style code applied cannot be found.'], $this->notFoundStatus);
        }

        /**
         * @var Product $product
         */
        $product = Product::query()
            ->select('airtime.serialno', 'product.code', 'product.descr', 'sizecodes.codeKey', 'colours.code AS clrcode',
                'colours.colour', 'airtime.sp', 'airtime.cp')
            ->join('clrcode', 'clrcode.productCode', '=', 'product.code')
            ->join('colours', 'colours.code', '=', 'clrcode.codeKey')
            ->join('sizecodes', 'sizecodes.sizeCode', '=', 'product.sizes')
            ->join('airtime', 'airtime.code', '=', 'product.code')
            ->where('product.code', $code)
            ->where('airtime.serialno', $serialno)
            ->first();

        $product['rp'] = $product['sp'];
        $product['stfp'] = $product['sp'];
        $product['mdp'] = 0;

        return response()->json(['product' => $product], $this->successStatus);
    }

    /**
     * Retrieve a product with a style, size and colour code
     *
     * @param string $code
     * @param $size
     * @param $colour
     * @return \Illuminate\Http\Response
     */
    public function retrieveProductWithCode($code, $size, $colour)
    {
        /**
         * @var Product $product
         */
        $product = Product::query()
            ->select('product.code', 'product.descr', 'sizecodes.codeKey', 'pricefil.sp', 'colours.code AS clrcode',
                'colours.colour', 'pricefil.rp', 'pricefil.mdp', 'pricefil.stfp', 'stkmast.QOH')
            ->join('clrcode', 'clrcode.productCode', '=', 'product.code')
            ->join('colours', 'colours.code', '=', 'clrcode.codeKey')
            ->join('sizecodes', 'sizecodes.sizeCode', '=', 'product.sizes')
            ->join('pricefil', 'pricefil.style', '=', 'product.code')
            ->join('stkmast', 'stkmast.STYLE', '=', 'product.code')
            ->where('product.code', $code)
            ->where('sizecodes.codeKey', $size)
            ->where('colours.code', $colour)
            ->where('pricefil.sizes', $size)
            ->where('stkmast.SIZES', $size)
            ->where('stkmast.CLR', $colour)
            ->first();

        if (!$product) {
            return response()->json(['error' => 'The product style code applied cannot be found.'], $this->notFoundStatus);
        }

        if ($product->QOH < 1) {
            return response()->json(['error' => 'The product style applied does not have any stock on hand.'],
                $this->notFoundStatus);
        }

        return response()->json(['product' => $product], $this->successStatus);
    }

    /**
     * Retrieve combos for a style code
     *
     * @param string $code
     * @return \Illuminate\Http\Response
     */
    public function retrieveCombos($code)
    {
        $now = date('Y-m-d');
        $combo = ComboPrice::query()
            ->select('comboprice.code', 'comboprice.style', 'comboprice.rp', 'comboprice.qty', 'comboprice.qty',
                'combostyle.description')
            ->join('combostyle', 'combostyle.code', '=', 'comboprice.code')
            ->where('comboprice.style', $code)
            ->where('combostyle.active', 1)
            ->where('combostyle.startdate', '<=', $now)
            ->where('combostyle.enddate', '>=', $now)
            ->first();

        if (!$combo) {
            return response()->json(['error' => 'The combo cannot be found.'], $this->notFoundStatus);
        }

        $combos = ComboPrice::query()
            ->select('comboprice.code', 'comboprice.style', 'comboprice.rp', 'comboprice.qty', 'comboprice.qty',
                'combostyle.description')
            ->join('combostyle', 'combostyle.code', '=', 'comboprice.code')
            ->where('comboprice.code', $combo['code'])
            ->where('combostyle.active', 1)
            ->where('combostyle.startdate', '<=', $now)
            ->where('combostyle.enddate', '>=', $now)
            ->get();

        return response()->json(['combo' => $combos], $this->successStatus);
    }

}
