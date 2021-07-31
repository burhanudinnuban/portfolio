import React from "react";
import Headers from "next/head";

export default function Head({ page }) {
  const newPage = page !== undefined ? `${page} - ` : "";
  return (
    <Headers>
      <title>{newPage}Fortpolio</title>
      <link rel="icon" href="/portfolio.png" />
    </Headers>
  );
}
