<?php
/**
 * Copy this file to config.php and fill in the password.
 *
 * Everything is filled in except the password. Put the mailbox password for
 * info@subgourmet.hr on the marked line (the same one you use for webmail).
 */
return [
    'to'       => 'info@subgourmet.hr',
    'from'     => 'info@subgourmet.hr',
    'fromName' => 'Sub Gourmet - Prijave',

    'smtp' => [
        'host'       => 'mail.subgourmet.hr',
        'port'       => 587,
        'username'   => 'info@subgourmet.hr',
        'password'   => '',          // <-- PUT THE PASSWORD HERE
        'encryption' => 'tls',
    ],
];
