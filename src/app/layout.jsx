'use client';

import { metadata } from "./metadata";
import { Providers } from "./providers";
import "../styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Layout({ children }) {

  return (
    <html lang="en" className="mdl-js">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        className=""
      >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}