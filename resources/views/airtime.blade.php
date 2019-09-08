<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
    <meta charset="utf-8"/>
    <title>Fashion World Airtime Voucher</title>
    <meta name="author" content="Fashion World"/>
    <meta name="subject" content="Airtime Voucher"/>
    <meta name="date" content="{{ 'now'|date('Y-m-d') }}"/>
</head>
<body>
<header>
    <header>
        <h4>Fashion World</h4>
        <h5><strong>Airtime Voucher</strong></h5>
    </header>
</header>
<main>
    <section>
        <div style="display: flex;">
            <label>Item: </label>
            <span>{{ $description }}</span>
        </div>
        <div style="display: flex;">
            <label>Network: </label>
            <span>{{ $network }}</span>
        </div>
        <div style="display: flex;">
            <label>Type: </label>
            <span>{{ $vtype }}</span>
        </div>
        <div style="display: flex;">
            <label style="font-size: 24px;">PIN #: </label>
            <span style="font-size: 24px; font-weight: bold;">{{ $pin }}</span>
        </div>
        <div style="display: flex;">
            <label style="font-weight: 900">||||||||||  ||| || ||||   ||||| ||| ||</label>
        </div>
        <div style="display: flex;">
            <label>To recharge dial: </label>
            <span>{{ $recharge }}</span>
        </div>
        <div style="display: flex;">
            <label>Customer Care: </label>
            <span>{{ $customerCare }}</span>
        </div>
        <div style="display: flex;">
            <label>Ref #: </label>
            <span>{{ $serialNo }}</span>
        </div>
        <div style="display: flex;">
            <label>Batch #: </label>
            <span>{{ $batch }}</span>
        </div>
    </section>
    <hr/>
    <footer>
        <section style="display: flex">
            <span>{{ $date }}</span>
        </section>
    </footer>
</main>
</body>
</html>
