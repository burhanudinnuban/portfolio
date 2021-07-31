import React from "react";
import Banner from "../Banner";
import VerticalRowProjects from "../VerticalRowProjects";

export default function Main() {
  return (
    <section className="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
      <VerticalRowProjects />
      <Banner />
    </section>
  );
}
