"""Static file server for local preview.

Identical to `python -m http.server` except responses carry Cache-Control:
no-store, so edits to app.js/index.html show up on a plain reload.
"""
import functools, http.server, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      '.avif': 'image/avif', '.webp': 'image/webp', '.svg': 'image/svg+xml'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    http.server.test(HandlerClass=functools.partial(Handler, directory=ROOT),
                     ServerClass=http.server.ThreadingHTTPServer, port=port, bind='127.0.0.1')
