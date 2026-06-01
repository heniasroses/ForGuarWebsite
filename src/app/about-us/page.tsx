import Navbar from "@/components/Navbar";
import AboutUs from "@/components/AboutUs";
import TrailerAboutUs from "@/components/TrailerAboutUs";
import Team from "@/components/TeamMembers";

export default function AboutUsPage() {
    return (
      <>
        <Navbar />
        <AboutUs />
        <TrailerAboutUs />
        <Team />
      </>
    );
}