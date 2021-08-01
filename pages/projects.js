import React from "react";
import { Banner, Footer, Head, VerticalRowProjects } from "../components";
import { NavBar } from "../components/NavBar";

function Projects() {
  return (
    <>
      <Head page={"Projects"} />
      <NavBar />
      <VerticalRowProjects />
      <Banner />
      <Footer />
    </>
  );
}

export default Projects;
