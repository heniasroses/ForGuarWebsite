export default function Hero() {
  return (
    <div className="play4freeSection">
      <div className="LandingScreen">
        <div className="logo-wrapper">
          <img
          src="/img/ForGuarLogo.png"
          style={{
            width: "clamp(300px, 45vw, 500px)",
            height: "auto",
          }}
          alt="Forest Guardians"
        />
        </div>

        <button className="btn play-btn" type="button">
          <span>PLAY FOR FREE</span>
        </button>
      </div>
    </div>
  );
}