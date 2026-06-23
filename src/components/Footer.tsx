import Link from "next/link";
export default function Footer() {
  return (
    <div className="container-fluid Footer">
      <div className="d-flex flex-row justify-content-center align-items-center footerLogo">
        <img
          className="img-fluid"
          width="224"
          height="224"
          src="/img/LOGO WH 2.png"
          alt=""
        />
      </div>

      <div className="flex-row justify-content-center align-items-center footerLogo2">
        <img
          className="img-fluid"
          src="/img/HENIA’S ROSES.png"
          alt=""
        />
      </div>

      <div className="flex-row justify-content-center align-items-center">
        <p className="footerParagraph">
          Forest Guardians is an educational capstone project developed to promote awareness of Philippine biodiversity and 
          environmental conservation. Wildlife information, media, and downloadable content are provided for educational and 
          research purposes. Users are expected to use the website responsibly and follow community guidelines when participating 
          in the Forest Logs forum.
        </p>
      </div>

      <div className="footerIcons">
        
        <Link href="/contact-us" >
        <img
          src="/img/icons/email.png"
          alt="Email"
          className="footer-icon"
        />
        </Link>
        <a
          href="http://www.youtube.com/@HeniasRoses"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
          src="/img/icons/youtube.png"
          alt="YouTube"
          className="footer-icon"
        />
        </a>
        

        <img
          src="/img/icons/facebook.png"
          alt="Facebook"
          className="footer-icon"
        />
      </div>

      <div className="flex-row justify-content-center align-items-center">
        <p className="footerParagraph">
          Copyright © HENIA’S ROSES all Rights Reserved
        </p>
      </div>
    </div>
  );
}