import { Footer, Head, Header, Main } from "../components";
import Banner from "../components/Banner";
import { NavBar } from "../components/NavBar";
export default function Home() {
  return (
    <>
      <Head page={"Contact"} />
      <NavBar />
      <Banner />
      <Footer />
    </>
  );
}
