export default function Trailer() {
  return (
    <div className="container-fluid trailer">
      <div className="trailer-wrapper">
        <div className="video-box">
          <iframe
            className="aspect-ratio-16x9 w-100"
            allowFullScreen
            src="https://www.youtube.com/embed/BeYhRJH9Ozo"
          />
        </div>

        <div className="text-box">
          <h1 className="text-center trailerText">
            <img
              className="img-fluid"
              width="54"
              height="54"
              src="/img/FORGAURLOGOGREEN 2.png"
              alt=""
            />
            <br />
            FOREST GUARDIANS TRAILER
            <br />
          </h1>

          <p className="text-center trailerParag">
            Humanity once relied on CuBot Incorporated’s AI-driven robots to
            harvest Sapsis, a rare bio-material found in trees that powered the
            machines.
          </p>
        </div>
      </div>
    </div>
  );
}