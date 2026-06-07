import Navbar from "@/components/Navbar";
import ContactUs from "@/components/ContactUs";

export default function ContactUsPage() {
  return (
    <>
      <Navbar />

      <main className="contactUsPageContent">
        <ContactUs />
      </main>
    </>
  );
}