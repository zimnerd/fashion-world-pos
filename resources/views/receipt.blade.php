<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
    <meta charset="utf-8"/>
    <title>Fashion World Receipt</title>
    <meta name="author" content="Fashion World"/>
    <meta name="subject" content="Receipt"/>
    <meta name="date" content="{{ 'now'|date('Y-m-d') }}"/>

    <style type="text/css">
        p {
            margin: 0;
        }
    </style>
</head>
<body style="width: 225px" id="invoice">
<header>
    <header>
        <h4>Fashion World</h4>
    </header>
    <section style="text-align: right; display: flex; flex-wrap: wrap;">
        <p>Tax {{ $type }}</p>
        <p>{{ $method }}</p>
    </section>
    <footer>
        <article>
            <address style="flex-wrap: wrap; display: flex;">
                <p>Shop {{ $branch['code'] }} {{ $branch['name'] }}</p>
                <p>{{ $branch['add1'] }}</p>
                <p>{{ $branch['add2'] }}</p>
                <p>{{ $branch['add3'] }}</p>
                <p>{{ $branch['postalCode'] }} Tel: {{ $branch['tel1'] }}</p>
            </address>
            <br/>
            <p>Vat Reg Number: 215165111</p>
        </article>
    </footer>
</header>
<br/>
<main>
    <header style="display: flex;">
        <p>{{ $transaction_id }}</p>
        <p>{{ $date }}</p>
        <p>{{ $time }}</p>
        <p>{{ $branch['code'] }}</p>
        <p style="float: right;">Till No: {{ $till }}</p>
    </header>
    <section>
        <table>
            <thead>
            <tr>
                <th style="border-bottom: 1px solid black">Style</th>
                <th style="border-bottom: 1px solid black">Desc</th>
                <th style="border-bottom: 1px solid black">Qty</th>
                <th style="border-bottom: 1px solid black">Price</th>
                <th style="border-bottom: 1px solid black">Value</th>
            </tr>
            </thead>
            <tbody>
            @foreach ($transactions as $transaction)
                <tr>
                    <td>{{ $transaction['code'] }} {{ $transaction['size'] }} {{ $transaction['colour'] }}</td>
                    <td>{{ $transaction['description'] }}</td>
                    <td>{{ $transaction['qty'] }}</td>
                    <td>{{ $transaction['price'] }}</td>
                    <td>{{ $transaction['total'] }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="5" style="border-bottom: 1px solid black"></td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="4">Total Quantity:</td>
                <td colspan="4">{{ $totals['qty'] }}</td>
            </tr>
            <tr>
                <td colspan="4">Total VAT (15.00%):</td>
                <td colspan="4">{{ $totals['vat'] }}</td>
            </tr>
            <tr>
                <td rowspan="1" colspan="4"></td>
            </tr>
            <tr>
                <td colspan="4">Total Value:</td>
                <td colspan="4">{{ $totals['total'] }}</td>
            </tr>
            <tr>
                <td rowspan="1" colspan="4"></td>
            </tr>
            <tr>
                <td colspan="4">Amount Due:</td>
                <td colspan="4">{{ $totals['total'] }}</td>
            </tr>
            <tr>
                <td colspan="4">Total Savings:</td>
                <td colspan="4">{{ $discount }}</td>
            </tr>
            <tr>
                <td colspan="4">Payment Method: {{ $method }}</td>
                <td colspan="4">{{ $tendered }}</td>
            </tr>
            <tr>
                <td rowspan="1" colspan="4"></td>
            </tr>
            <tr>
                <td colspan="4">Change:</td>
                <td colspan="4">{{ $change }}</td>
            </tr>
            </tfoot>
        </table>
    </section>
</main>
<footer>
    @if ($refundAmt !== null)
        <section style="display: flex; flex-wrap: wrap; margin-top: 15px; width: 100%">
            <p>Refund Details:-</p>
            <p>Refund Amount: <span style="margin-left: 50px">{{ $refundAmt }}</span></p>
            <p>Org Doc No: <span style="margin-left: 50px">{{ $originalDocNo }}</span></p>
            <p>Date: <span style="margin-left: 50px">{{ $date }}</span></p>
            <p>Reason: <span style="margin-left: 50px">{{ $reason }}</span></p>
            <p>Comments: <span style="margin-left: 50px">{{ $comments }}</span></p>
        </section>
        <br/>
    @endif
    @if ($remarks !== null)
        <h5 style="text-transform: uppercase">
            {{ $remarks }}
        </h5>
    @endif
    <h5 style="text-transform: uppercase">
        Refunds and exchanges accepted as per refund and exchange policy in store. Terms and conditions apply. No
        exchange
        on underwear, leggings and bodysuits
    </h5>
    <script>
        window.addEventListener("load", function(){
            // ....
            printDiv("invoice");
        });
        function printDiv(divName) {

            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.close();
        }
    </script>
</footer>
</body>
</html>


