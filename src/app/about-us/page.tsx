import Navbar from "@/components/Navbar";
import AboutUs from "@/components/AboutUs";
import TrailerAboutUs from "@/components/TrailerAboutUs";
import Team from "@/components/TeamMembers";
import Footer from "@/components/Footer";

export default function AboutUsPage() {
    return (
      <>
        <Navbar />
        <AboutUs />
        <TrailerAboutUs />
        <Team />
        <Footer />
      </>
    );
}