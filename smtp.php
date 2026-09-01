<?php
/**
 * Minimal SMTP client: connect, STARTTLS, AUTH LOGIN, send one message with
 * one attachment.
 *
 * This exists so the site has no third-party dependency to install. It covers
 * exactly what the careers form needs and nothing else. If the project ever
 * needs more (multiple recipients, HTML bodies, inline images), swap it for
 * PHPMailer rather than growing this file.
 *
 * TLS certificates are verified. Do not turn that off to "make it work" - a
 * verification failure means the connection is not trustworthy.
 */

declare(strict_types=1);

final class SmtpException extends RuntimeException {}

final class Smtp
{
    private $fp;
    private string $host;
    private int $timeout;
    /** @var string[] transcript of the conversation, for error reporting */
    private array $log = [];

    public function __construct(string $host, int $port, int $timeout = 20)
    {
        $this->host = $host;
        $this->timeout = $timeout;

        $context = stream_context_create([
            'ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true],
        ]);
        $fp = @stream_socket_client(
            sprintf('tcp://%s:%d', $host, $port),
            $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context
        );
        if (!$fp) {
            throw new SmtpException(sprintf('Cannot reach %s:%d (%s)', $host, $port, $errstr ?: "error $errno"));
        }
        $this->fp = $fp;
        stream_set_timeout($this->fp, $timeout);
        $this->expect(220);
    }

    /** Reads one complete reply, following multi-line continuations. */
    private function read(): array
    {
        $lines = [];
        while (true) {
            $line = fgets($this->fp, 1024);
            if ($line === false) {
                $meta = stream_get_meta_data($this->fp);
                throw new SmtpException($meta['timed_out'] ? 'Server timed out.' : 'Connection closed by server.');
            }
            $this->log[] = '< ' . rtrim($line);
            $lines[] = rtrim($line, "\r\n");
            // "250-FOO" continues, "250 FOO" ends.
            if (strlen($line) < 4 || $line[3] !== '-') break;
        }
        $code = (int)substr($lines[0], 0, 3);
        return [$code, implode("\n", $lines)];
    }

    private function send(string $command, bool $secret = false): void
    {
        $this->log[] = '> ' . ($secret ? '***' : $command);
        if (fwrite($this->fp, $command . "\r\n") === false) {
            throw new SmtpException('Could not write to the server.');
        }
    }

    private function expect(int ...$codes): string
    {
        [$code, $text] = $this->read();
        if (!in_array($code, $codes, true)) {
            throw new SmtpException(sprintf('Expected %s, got: %s', implode('/', $codes), $text));
        }
        return $text;
    }

    private function command(string $command, int $expect, bool $secret = false): string
    {
        $this->send($command, $secret);
        return $this->expect($expect);
    }

    public function login(string $username, string $password, string $ehloName = 'localhost'): void
    {
        $this->command('EHLO ' . $ehloName, 250);

        $this->command('STARTTLS', 220);
        $ok = @stream_socket_enable_crypto($this->fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        if ($ok !== true) {
            $err = error_get_last()['message'] ?? 'unknown error';
            throw new SmtpException('TLS handshake failed: ' . $err);
        }
        // The capability list must be re-read once the channel is encrypted.
        $caps = $this->command('EHLO ' . $ehloName, 250);

        if (stripos($caps, 'AUTH') === false) {
            throw new SmtpException('Server does not offer authentication.');
        }
        $this->command('AUTH LOGIN', 334);
        $this->command(base64_encode($username), 334, true);
        $this->command(base64_encode($password), 235, true);
    }

    /**
     * @param array{0:string,1:string,2:string}|null $attachment [bytes, filename, mime]
     */
    public function sendMessage(
        string $fromEmail, string $fromName,
        string $toEmail,
        string $subject, string $body,
        string $replyToEmail = '', string $replyToName = '',
        ?array $attachment = null
    ): void {
        $this->command(sprintf('MAIL FROM:<%s>', $fromEmail), 250);
        $this->command(sprintf('RCPT TO:<%s>', $toEmail), 250, false);
        $this->command('DATA', 354);

        $message = $this->buildMime(
            $fromEmail, $fromName, $toEmail, $subject, $body,
            $replyToEmail, $replyToName, $attachment
        );
        // A lone "." would end the message early; SMTP escapes it by doubling.
        $message = preg_replace('/^\./m', '..', $message);

        $this->log[] = '> [message, ' . strlen($message) . ' bytes]';
        fwrite($this->fp, $message . "\r\n.\r\n");
        $this->expect(250);
    }

    private function buildMime(
        string $fromEmail, string $fromName, string $toEmail,
        string $subject, string $body,
        string $replyToEmail, string $replyToName, ?array $attachment
    ): string {
        $enc = static fn(string $s): string => '=?UTF-8?B?' . base64_encode($s) . '?=';
        $boundary = '=_' . bin2hex(random_bytes(16));

        $headers = [
            'Date: ' . date('r'),
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $this->host . '>',
            sprintf('From: %s <%s>', $enc($fromName), $fromEmail),
            sprintf('To: <%s>', $toEmail),
            'Subject: ' . $enc($subject),
            'MIME-Version: 1.0',
        ];
        if ($replyToEmail !== '') {
            $headers[] = sprintf('Reply-To: %s <%s>', $enc($replyToName), $replyToEmail);
        }

        if ($attachment === null) {
            $headers[] = 'Content-Type: text/plain; charset=UTF-8';
            $headers[] = 'Content-Transfer-Encoding: base64';
            return implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($body));
        }

        [$bytes, $filename, $mime] = $attachment;
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

        $parts = [
            '--' . $boundary,
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode($body)),
            '--' . $boundary,
            sprintf('Content-Type: %s; name="%s"', $mime, $filename),
            'Content-Transfer-Encoding: base64',
            sprintf('Content-Disposition: attachment; filename="%s"', $filename),
            '',
            chunk_split(base64_encode($bytes)),
            '--' . $boundary . '--',
        ];

        return implode("\r\n", $headers) . "\r\n\r\n" . implode("\r\n", $parts);
    }

    /** Redacted transcript, safe to write to an error log. */
    public function transcript(): string
    {
        return implode("\n", $this->log);
    }

    public function quit(): void
    {
        if (is_resource($this->fp)) {
            @fwrite($this->fp, "QUIT\r\n");
            @fclose($this->fp);
        }
    }

    public function __destruct()
    {
        $this->quit();
    }
}
