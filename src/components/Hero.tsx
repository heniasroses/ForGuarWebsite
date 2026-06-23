export default function Hero() {
  return (
    <div className="play4freeSection">
      <div className="LandingScreen">

        <div className="logo-wrapper">
          <img
            src="/img/ForGuarLogo.png"
            className="heroLogo"
            alt="Forest Guardians"
          />
        </div>

        <p className="heroSubtitle">
          Forest Guardians is a 3D wave-based action-defense game where you play as a mystical animal Guardian to defend the 
          Panoharra Tree from waves of cute, but destructive robots.
        </p>

        <button className="btn play-btn" type="button">
          <span>PLAY FOR FREE</span>
        </button>

      </div>
    </div>
  );
}