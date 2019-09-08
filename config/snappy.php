<?php

return array(

    'pdf' => array(
        'enabled' => true,
        'binary'  => env("PDF_LOC", '/usr/local/bin/wkhtmltopdf'),
//        'binary'  => 'C:\\Installs\\wkhtmltopdf\\bin\\wkhtmltopdf.exe',
        'timeout' => false,
        'options' => array(),
        'env'     => array()
    ),
    'image' => array(
        'enabled' => true,
        'binary'  => '/usr/local/bin/wkhtmltoimage',
        'timeout' => false,
        'options' => array(),
        'env'     => array(),
    )

);
