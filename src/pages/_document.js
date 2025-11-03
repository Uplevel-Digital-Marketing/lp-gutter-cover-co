import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Northeast Ohio's Trusted Gutter Protection Specialists Since 1998" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&loading=async&libraries=places`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 