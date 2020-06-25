<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Calendar</title>
    <link rel="shortcut icon" type="image/x-icon" href="icon1.ico">

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
    <link href="https://cdn.materialdesignicons.com/5.3.45/css/materialdesignicons.min.css" rel="stylesheet">
    <!-- Styles -->
    <!-- install year-calendar -->
    <script src="https://unpkg.com/v-year-calendar@latest/dist/v-year-calendar.umd.min.js"></script>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body>

    <div id="app">
        <app></app>
    </div>
</body>
<script type="text/javascript" src="{{ asset('js/app.js') }}" defer></script>

</html>