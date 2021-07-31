import { Footer, Head, Header, Main } from "../components";
import { NavBar } from "../components/NavBar";
export default function Home() {
  return (
    <>
      <Head page={"Home"} />
      <NavBar />
      <Header />
      <Main />
      <Footer />
    </>
  );
}
