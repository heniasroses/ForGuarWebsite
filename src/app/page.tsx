import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Trailer from "@/components/Trailer";
import Guardians from "@/components/Guardians";
import Almanac from "@/components/Almanac";
import Art from "@/components/Art";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Trailer />
      <Guardians />
      <Almanac />
      <Art />
      <Footer />
    </>
  );
}