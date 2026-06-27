import React from 'react';

export default function Html({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* ── Poppins Font Fallback ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* ── Primary SEO Meta Tags ── */}
        <title>BULK — AI Calorie & Macro Tracker</title>
        <meta name="title" content="BULK — AI Calorie & Macro Tracker" />
        <meta name="description" content="BULK adalah aplikasi pelacak kalori dan makro berbasis AI. Scan makanan lewat foto atau barcode, hitung TDEE & BMI otomatis, dan raih target berat badan kamu." />
        <meta name="keywords" content="kalori tracker, macro tracker, AI nutrition, scan makanan, BMI, TDEE, bulking, cutting, diet, fitness app" />
        <meta name="author" content="daffs_26" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://bulk-app-daffs26.vercel.app/" />
        <meta name="google-site-verification" content="yk8gedAGB76Tmb_6Wmrv1qzKdw4ckK86hRQCGbVVx7Q" />

        {/* ── Open Graph / Facebook / WhatsApp ── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bulk-app-daffs26.vercel.app/" />
        <meta property="og:title" content="BULK — AI Calorie & Macro Tracker" />
        <meta property="og:description" content="Scan makanan, hitung kalori & makro otomatis dengan AI. Raih target berat badan ideal kamu bersama BULK." />
        <meta property="og:image" content="https://bulk-app-daffs26.vercel.app/icons/icon-512.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:site_name" content="BULK" />
        <meta property="og:locale" content="id_ID" />

        {/* ── Twitter / X Card ── */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://bulk-app-daffs26.vercel.app/" />
        <meta name="twitter:title" content="BULK — AI Calorie & Macro Tracker" />
        <meta name="twitter:description" content="Scan makanan, hitung kalori & makro otomatis dengan AI. Raih target berat badan ideal kamu bersama BULK." />
        <meta name="twitter:image" content="https://bulk-app-daffs26.vercel.app/icons/icon-512.png" />
        <meta name="twitter:creator" content="@daffs_26" />

        {/* ── PWA Manifest ── */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6B00" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* ── iOS PWA ── */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BULK" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />

        {/* ── Favicon ── */}
        <link rel="icon" href="/favicon.ico?v=3" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />

        {/* ── JSON-LD Structured Data (Google understands this) ── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "BULK",
          "description": "BULK adalah aplikasi pelacak kalori dan makro berbasis AI. Scan makanan lewat foto atau barcode, hitung TDEE & BMI otomatis.",
          "url": "https://bulk-app-daffs26.vercel.app/",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web, iOS, Android",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "IDR" },
          "author": { "@type": "Person", "name": "daffs_26" },
          "image": "https://bulk-app-daffs26.vercel.app/icons/icon-512.png",
          "inLanguage": "id-ID"
        })}} />

        {/* ── Service Worker Registration ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('SW registered, scope: ', registration.scope);
              }, function(err) {
                console.log('SW registration failed: ', err);
              });
            });
          }
        `}} />
      </head>
      <body style={{ backgroundColor: '#0B0B0C' }}>{children}</body>
    </html>
  );
}
