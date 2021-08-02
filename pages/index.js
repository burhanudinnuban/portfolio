import { useEffect, useState } from "react";
import {
  Banner,
  Footer,
  FormInformation,
  Head,
  Header,
  VerticalRowProjects,
} from "../components";
import { NavBar } from "../components/NavBar";
export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  }, []);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  return (
    <div className="bg-gray-300">
      <Head page={"Home"} />
      <NavBar />
      <Header />
      <VerticalRowProjects />
      <FormInformation />
      <Banner />
      <Footer />
      {visible && (
        <button className="fixed bottom-2 right-2" onClick={scrollToTop}>
          <img src="/up-arrow.png" />
        </button>
      )}
    </div>
  );
}
