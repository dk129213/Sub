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
 *   3. Without PHPMailer this uses PHP's mail(), which works on most shared
 *      hosting. To send over authenticated SMTP instead (better deliverability),
 *      upload PHPMailer to vendor/ and fill in the SMTP block in config.php.
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

$sent = sendMail($config, $subject, $body, $email, $applicant, $cvBytes, $cvName, $mime);

if (!$sent) {
    fail(502, 'Could not send the application.');
}
echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);


/**
 * Sends via PHPMailer over SMTP when it is installed and configured,
 * otherwise falls back to PHP's mail() with a hand-built MIME message.
 */
function sendMail(
    array $config, string $subject, string $body,
    string $replyTo, string $replyName,
    string $cvBytes, string $cvName, string $cvMime
): bool {
    $to   = $config['to'];
    $from = $config['from'];

    $autoload = __DIR__ . '/vendor/autoload.php';
    if (!empty($config['smtp']['host']) && is_file($autoload)) {
        require_once $autoload;
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = $config['smtp']['host'];
            $mail->Port       = (int)$config['smtp']['port'];
            $mail->SMTPAuth   = true;
            $mail->Username   = $config['smtp']['username'];
            $mail->Password   = $config['smtp']['password'];
            $mail->SMTPSecure = $config['smtp']['encryption'];   // 'tls' or 'ssl'
            $mail->CharSet    = 'UTF-8';
            $mail->setFrom($from, $config['fromName']);
            $mail->addAddress($to);
            $mail->addReplyTo($replyTo, $replyName);
            $mail->Subject = $subject;
            $mail->Body    = $body;
            $mail->addStringAttachment($cvBytes, $cvName, 'base64', $cvMime);
            return $mail->send();
        } catch (Throwable $e) {
            error_log('[apply.php] SMTP send failed: ' . $e->getMessage());
            return false;
        }
    }

    $boundary = '=_' . bin2hex(random_bytes(16));
    $headers  = implode("\r\n", [
        'MIME-Version: 1.0',
        'From: ' . sprintf('%s <%s>', $config['fromName'], $from),
        'Reply-To: ' . sprintf('%s <%s>', $replyName, $replyTo),
        'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
    ]);

    $payload = implode("\r\n", [
        '--' . $boundary,
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        $body,
        '',
        '--' . $boundary,
        'Content-Type: ' . $cvMime . '; name="' . $cvName . '"',
        'Content-Transfer-Encoding: base64',
        'Content-Disposition: attachment; filename="' . $cvName . '"',
        '',
        chunk_split(base64_encode($cvBytes)),
        '--' . $boundary . '--',
        '',
    ]);

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    return mail($to, $encodedSubject, $payload, $headers);
}
