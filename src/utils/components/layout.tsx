import Html from '@kitajs/html';

export function Layout({ children }: Html.PropsWithChildren) {
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
        </head>
        <body style={{ maxWidth: '900px', margin: '0 auto' }}>{children}</body>
      </html>
    </>
  );
}
