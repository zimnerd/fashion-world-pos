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
<body style="width: 225px">
<header>
    <header>
        <h4>Fashion World</h4>
    </header>
    <section style="text-align: right; display: flex; flex-wrap: wrap;">
        @if ($isDebtor)
        <p>Debtor Receipt</p>
        @else
        <p>Laybye Receipt</p>
        @endif
    </section>
</header>
<br/>
<main>
    <header style="display: flex;">
        <p>{{ $date }}</p>
    </header>
    <section>
        <table>
            <tbody>
            <tr>
                <td colspan="4">Account Number:</td>
                <td colspan="4">{{ $accNo }}</td>
            </tr>
            <tr>
                <td colspan="4">Deposit Number:</td>
                <td colspan="4">{{ $depNo }}</td>
            </tr>
            <tr>
                <td colspan="4">Name:</td>
                <td colspan="4">{{ $name }}</td>
            </tr>
            <tr>
                <td rowspan="1" colspan="4"></td>
            </tr>
            <tr>
                <td colspan="4">Amount Paid:</td>
                <td colspan="4">{{ $amt }}</td>
            </tr>
            <tr>
                <td rowspan="1" colspan="4"></td>
            </tr>
            <tr>
                <td colspan="4">Balance:</td>
                <td colspan="4">{{ $balance }}</td>
            </tr>
            </tbody>
        </table>
    </section>
</main>
</body>
</html>
