import React from "react";
import { Footer, FormInformation, Head, Main } from "../components";
import Banner from "../components/Banner";
import { NavBar } from "../components/NavBar";

function About() {
  return (
    <>
      <Head page={"About"} />
      <NavBar />
      <FormInformation />
      <Banner />
      <Footer />
    </>
  );
}

export default About;
