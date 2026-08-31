<?php
/**
 * Copy this file to config.php and fill in the real values.
 *
 * config.php is gitignored on purpose: it holds the mailbox password. Never
 * commit it and never link to it from a page.
 */
return [
    // Where applications are delivered.
    'to'       => 'info@subgourmet.hr',

    // Envelope sender. Use an address on your own domain, otherwise the mail
    // is likely to be rejected or land in spam.
    'from'     => 'info@subgourmet.hr',
    'fromName' => 'Sub Gourmet — Prijave',

    // Leave 'host' empty to send with PHP's mail(), which works out of the box
    // on most shared hosting. Fill it in (and upload PHPMailer to vendor/) to
    // send over authenticated SMTP, which usually lands in the inbox more
    // reliably. Your hosting provider supplies these values.
    'smtp' => [
        'host'       => '',            // e.g. 'mail.subgourmet.hr'
        'port'       => 587,           // 587 for TLS, 465 for SSL
        'username'   => 'info@subgourmet.hr',
        'password'   => '',            // mailbox password
        'encryption' => 'tls',         // 'tls' or 'ssl'
    ],
];
