// src/app/layout.js
import './globals.css';
import Head from 'next/head';

export const metadata = {
  title: 'Tu App de Citas',
  description: 'Agendar citas de forma rápida y sencilla.',
  openGraph: {
    title: 'Tu App de Citas',
    description: 'Agendar citas de forma rápida y sencilla.',
    url: 'https://tuappdecitas.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tu App de Citas',
    description: 'Agendar citas de forma rápida y sencilla.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}