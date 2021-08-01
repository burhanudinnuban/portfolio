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
  return (
    <div className="bg-gray-300">
      <Head page={"Home"} />
      <NavBar />
      <Header />
      <VerticalRowProjects />
      <FormInformation />
      <Banner />
      <Footer />
    </div>
  );
}
