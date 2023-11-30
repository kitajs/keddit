import Html from '@kitajs/html';
import { Nav } from './nav';

export interface LayoutProps extends Html.PropsWithChildren {
  user?: { name: string };
}

export function Layout({ children, user }: LayoutProps) {
  return (
    <>
      {'<!DOCTYPE html>'}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Keddit</title>

          <script src="https://unpkg.com/htmx.org@1.9.8"></script>
          <script>htmx.config.withCredentials = true;</script>

          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
          ></link>

          <link rel="icon" href="https://kita.js.org/logo.svg" />

          <link rel="stylesheet" href="/index.css"></link>
        </head>
        <body>
          <header class="container">
            <Nav user={user} />
          </header>

          <main class="container">{children}</main>

          <footer class="container">
            <small>
              Made with <span style={{ color: 'red' }}>❤</span> by{' '}
              <a href="https://arthur.place/">Arthur Fiorette</a>
            </small>
          </footer>
        </body>
      </html>
    </>
  );
}
