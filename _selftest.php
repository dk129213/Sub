<?php
/**
 * Deployment self-test. Visit once after uploading, then DELETE THIS FILE.
 *
 * Checks only what the application form actually depends on. It never prints
 * the mailbox password - credentials are reported as present/absent only.
 */

declare(strict_types=1);
header('Content-Type: text/html; charset=utf-8');

$checks = [];
function check(string $name, bool $ok, string $detail = '', bool $fatal = true): void
{
    global $checks;
    $checks[] = ['name' => $name, 'ok' => $ok, 'detail' => $detail, 'fatal' => $fatal];
}

// ─── PHP ───
check('PHP 8.0 or newer', PHP_VERSION_ID >= 80000, 'running ' . PHP_VERSION);
check('openssl extension', extension_loaded('openssl'), 'needed for STARTTLS to the mail server');
check('fileinfo extension', extension_loaded('fileinfo'), 'needed to verify the uploaded CV is really a PDF');
check('mbstring extension', extension_loaded('mbstring'), 'needed for length checks on Croatian text');

$upload = (int)preg_replace('/\D/', '', (string)ini_get('upload_max_filesize'));
check('upload_max_filesize >= 5M', $upload >= 5, 'is ' . ini_get('upload_max_filesize'));
check('post_max_size >= 5M',
      (int)preg_replace('/\D/', '', (string)ini_get('post_max_size')) >= 5,
      'is ' . ini_get('post_max_size'));

// ─── files ───
foreach (['index.html', 'careers.html', 'apply.php', 'smtp.php', 'styles.css', 'app.js'] as $f) {
    check("file: $f", is_file(__DIR__ . '/' . $f));
}
check('images/opt/ derivatives present',
      is_dir(__DIR__ . '/images/opt') && count(glob(__DIR__ . '/images/opt/*.avif') ?: []) > 50,
      'AVIF versions of the photos');

// ─── config ───
$configOk = is_file(__DIR__ . '/config.php');
check('config.php present', $configOk, 'holds the mailbox password');
$config = $configOk ? require __DIR__ . '/config.php' : null;
check('mailbox password filled in',
      $configOk && !empty($config['smtp']['password']),
      $configOk && !empty($config['smtp']['password']) ? 'set (not shown here)' : 'still blank');

// ─── the real question: can this server reach the mail server? ───
$smtpOk = false;
$smtpDetail = 'skipped - config incomplete';
if ($configOk && !empty($config['smtp']['password'])) {
    $host = (string)$config['smtp']['host'];
    $port = (int)$config['smtp']['port'];
    $fp = @fsockopen($host, $port, $errno, $errstr, 10);
    if (!$fp) {
        $smtpDetail = "cannot open $host:$port - $errstr. Outbound SMTP is probably blocked; ask Plus Hosting to open it.";
    } else {
        fclose($fp);
        require_once __DIR__ . '/smtp.php';
        try {
            $s = new Smtp($host, $port);
            $s->login($config['smtp']['username'], $config['smtp']['password']);
            $s->quit();
            $smtpOk = true;
            $smtpDetail = "connected to $host:$port, STARTTLS ok, credentials accepted";
        } catch (Throwable $e) {
            $smtpDetail = $e->getMessage();
        }
    }
}
check('SMTP login from this server', $smtpOk, $smtpDetail);

$failed = array_filter($checks, fn($c) => !$c['ok'] && $c['fatal']);
?>
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Sub Gourmet — deployment self-test</title>
<style>
 body{font:15px/1.6 system-ui,sans-serif;background:#2C2620;color:#EDE3D2;margin:0;padding:40px 24px}
 .wrap{max-width:760px;margin:0 auto}
 h1{font-size:24px;margin:0 0 6px} .sub{color:#8A7C68;margin-bottom:28px}
 .verdict{padding:16px 20px;border-radius:6px;margin-bottom:28px;font-weight:600}
 .pass{background:#2f3d21;color:#cfe3a8;border:1px solid #5c7a3a}
 .fail{background:#40211c;color:#f0b6a8;border:1px solid #8a3f30}
 table{width:100%;border-collapse:collapse}
 td{padding:9px 8px;border-bottom:1px solid rgba(237,227,210,.10);vertical-align:top}
 .ok{color:#8fbf5a;font-weight:700;width:30px} .no{color:#d9694f;font-weight:700;width:30px}
 .detail{color:#8A7C68;font-size:13px}
 .warn{margin-top:30px;padding:14px 18px;border:1px solid #C9A961;color:#D4B370;border-radius:6px}
 code{background:rgba(0,0,0,.3);padding:1px 5px;border-radius:3px}
</style></head><body><div class="wrap">
<h1>Sub Gourmet — deployment self-test</h1>
<div class="sub"><?= date('d.m.Y. H:i') ?> · <?= htmlspecialchars(PHP_VERSION) ?> · <?= htmlspecialchars(PHP_OS_FAMILY) ?></div>

<div class="verdict <?= $failed ? 'fail' : 'pass' ?>">
<?= $failed
      ? count($failed) . ' check(s) failed — the form will not work until these are fixed.'
      : 'All checks passed. The application form is ready to receive applications.' ?>
</div>

<table>
<?php foreach ($checks as $c): ?>
  <tr>
    <td class="<?= $c['ok'] ? 'ok' : 'no' ?>"><?= $c['ok'] ? '✓' : '✕' ?></td>
    <td><?= htmlspecialchars($c['name']) ?>
      <?php if ($c['detail']): ?><div class="detail"><?= htmlspecialchars($c['detail']) ?></div><?php endif; ?>
    </td>
  </tr>
<?php endforeach; ?>
</table>

<div class="warn"><strong>Delete this file when you are done.</strong>
Remove <code>_selftest.php</code> from <code>httpdocs</code> — it is a diagnostic, not part of the site.</div>
</div></body></html>
