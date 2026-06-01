export default function TrailerAboutUs() {
  return (
    <div className="container-fluid AboutUstrailer">
      <div className="trailer-wrapper">
        <div className="video-box">
          <iframe
            className="aspect-ratio-16x9 w-100"
            allowFullScreen
            src="https://www.youtube.com/embed/jfLmLEfiHYw"
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
            THE TEAM  
            <br />
            <br />
          </h1>

          <p className="text-center trailerParag">
            A student-led game development studio from FEU Institute of Technology, 
            founded in 2025. The studio is dedicated to turning meaningful stories into 
            immersive interactive experiences through games.
          </p>
        </div>
      </div>
    </div>
  );
}