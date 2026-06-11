export default function AboutUs() {
  return (
    <div className="aboutUs-container">

      {/* MOBILE IMAGE (ONLY SHOWS ON PHONE) */}
      <div className="aboutUs-mobileImage">
        <img src="/img/AboutUsBGmobile.png" alt="Henia’s Roses Team" />
      </div>

      <div className="aboutUs-content">
        <h1 className="aboutUs-title">HENIA’S ROSES</h1>
        <p className="aboutUs-text">
          Henia’s Roses, established in 2025, is a student game development team under the Far Eastern University – Institute of Technology (FEU Tech), composed of Information Technology students specializing in Animation and Game Development. The group is composed of Leonabel P. Alcantara, Andrie C. Detera, Angel Janica C. Fabregas, and Heniarose Crishia V. Guansing, united by a shared passion for developing games that merge compelling aesthetics with immersive, educational storytelling.
        </p>
      </div>
    </div>
  );
}