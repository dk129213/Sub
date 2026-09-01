<?php
/**
 * Receives a job application from careers.html and emails it, with the CV
 * attached, to the address configured in config.php.
 *
 * SETUP
 *   1. Copy config.example.php to config.php and fill in your details.
 *   2. config.php holds the SMTP password. It is gitignored and must never be
 *      committed or served - keep it beside this file, and never reference it
 *      from the browser.
 *   3. Sending goes over authenticated SMTP via smtp.php - no library to
 *      install. PHP's mail() is not used: it cannot authenticate on Windows
 *      hosting and tends to be filtered as spam.
 *
 * Everything the browser sends is re-validated here. Client-side checks are for
 * the applicant's convenience; they are not a security boundary.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

const MAX_CV_BYTES   = 5242880;                    // 5 MB
const ALLOWED_EXT    = ['pdf', 'doc', 'docx'];
const ALLOWED_MIME   = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const POSITIONS = [
    'konobar'       => 'Konobar / Waiter',
    'kuhar'         => 'Kuhar / Cook',
    'pomocni-kuhar' => 'Pomoćni kuhar / Assistant cook',
];

function fail(int $status, string $message): never
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

/** Strips CR/LF so user input can never inject extra mail headers. */
function headerSafe(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], ' ', $value));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'Method not allowed.');
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    fail(500, 'Server is not configured yet.');
}
$config = require $configPath;

if (empty($config['smtp']['host']) || empty($config['smtp']['password'])) {
    fail(500, 'Mail is not configured yet.');
}

// Bots fill in every field they find; a real applicant never sees this one.
if (!empty($_POST['website'] ?? '')) {
    echo json_encode(['ok' => true]);   // look successful, deliver nothing
    exit;
}

$firstName = headerSafe((string)($_POST['firstName'] ?? ''));
$lastName  = headerSafe((string)($_POST['lastName'] ?? ''));
$email     = headerSafe((string)($_POST['email'] ?? ''));
$phone     = headerSafe((string)($_POST['phone'] ?? ''));
$position  = (string)($_POST['position'] ?? '');
$message   = trim((string)($_POST['message'] ?? ''));
$consent   = ($_POST['consent'] ?? '') !== '';

if ($firstName === '' || $lastName === '' || $phone === '') {
    fail(422, 'Missing required fields.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(422, 'Invalid email address.');
}
if (!isset(POSITIONS[$position])) {
    fail(422, 'Invalid position.');
}
if (!$consent) {
    fail(422, 'Consent is required.');
}
if (mb_strlen($message) > 5000) {
    fail(422, 'Message is too long.');
}

// ─────────────── CV ───────────────
$cv = $_FILES['cv'] ?? null;
if (!$cv || ($cv['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $tooBig = $cv && in_array($cv['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
    fail(422, $tooBig ? 'CV is too large.' : 'CV is required.');
}
if ($cv['size'] > MAX_CV_BYTES) {
    fail(422, 'CV is too large.');
}
if (!is_uploaded_file($cv['tmp_name'])) {
    fail(400, 'Bad upload.');
}

$ext = strtolower(pathinfo((string)$cv['name'], PATHINFO_EXTENSION));
if (!in_array($ext, ALLOWED_EXT, true)) {
    fail(422, 'CV must be a PDF or Word document.');
}
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = (string)$finfo->file($cv['tmp_name']);
if (!in_array($mime, ALLOWED_MIME, true)) {
    fail(422, 'CV must be a PDF or Word document.');
}

$cvBytes = file_get_contents($cv['tmp_name']);
if ($cvBytes === false) {
    fail(500, 'Could not read the uploaded file.');
}
// Rebuild the filename rather than trusting what the browser sent.
$cvName = sprintf(
    '%s-%s-CV.%s',
    preg_replace('/[^A-Za-z0-9]+/u', '-', $firstName) ?: 'prijava',
    preg_replace('/[^A-Za-z0-9]+/u', '-', $lastName) ?: 'cv',
    $ext
);

// ─────────────── message ───────────────
$applicant = $firstName . ' ' . $lastName;
$subject   = 'Prijava za posao: ' . POSITIONS[$position] . ' — ' . $applicant;

$lines = [
    'Nova prijava za posao / New job application',
    '',
    'Ime i prezime : ' . $applicant,
    'Pozicija      : ' . POSITIONS[$position],
    'E-mail        : ' . $email,
    'Telefon       : ' . $phone,
    'Poslano       : ' . date('d.m.Y. H:i'),
];
if ($message !== '') {
    $lines[] = '';
    $lines[] = 'Poruka:';
    $lines[] = $message;
}
$lines[] = '';
$lines[] = 'Privola za obradu podataka: da';
$body = implode("\r\n", $lines);

require __DIR__ . '/smtp.php';

try {
    $smtp = new Smtp($config['smtp']['host'], (int)$config['smtp']['port']);
    $smtp->login($config['smtp']['username'], $config['smtp']['password']);
    $smtp->sendMessage(
        $config['from'], $config['fromName'],
        $config['to'],
        $subject, $body,
        $email, $applicant,
        [$cvBytes, $cvName, $mime]
    );
    $smtp->quit();
} catch (SmtpException $e) {
    // The transcript never contains the password - Smtp logs AUTH lines as ***.
    $detail = isset($smtp) ? PHP_EOL . $smtp->transcript() : '';
    error_log('[apply.php] ' . $e->getMessage() . $detail);
    fail(502, 'Could not send the application.');
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
