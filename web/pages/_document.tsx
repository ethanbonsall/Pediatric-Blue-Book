// File: web/pages/_document.tsx
// Next.js Document component that customizes the HTML document structure.
// Sets language attribute and applies antialiased font rendering to the body.

import { Html, Head, Main, NextScript } from "next/document";

// Function: Custom document component that wraps the entire application HTML structure
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
