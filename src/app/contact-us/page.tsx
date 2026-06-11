import Navbar from "@/components/Navbar";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export default function ContactUsPage() {
  return (
    <>
      <Navbar />

      <main className="contactUsPageContent">
        <ContactUs />
      </main>

      <div className="contactUsFooter">
      <Footer />
      </div>
    </>
  );
}