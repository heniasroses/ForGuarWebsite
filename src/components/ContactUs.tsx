export default function ContactUs() {
  return (
    <div className="contactUsContainer">
      <div className="contactUsRow">

        {/* LEFT SIDE */}
        <div className="contactLeft">
          <h1>Get in Touch with Us!</h1>

          <p>
            If you have any inquiries or just want to say hi, please use the contact form!
          </p>

          <div className="contactIcons">
            <img src="/img/icons/email.png" alt="fb" />
            <img src="/img/icons/youtube.png" alt="ig" />
            <img src="/img/icons/facebook.png" alt="email" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="contactRight">
          <form className="contactForm">

            <div className="rowTwoInputs">
              <div>
                <label>First Name</label>
                <input type="text" placeholder="Your First Name" />
              </div>

              <div>
                <label>Last Name</label>
                <input type="text" placeholder="Your Last Name" />
              </div>
            </div>

            <div className="fullInput">
              <label>Email</label>
              <input type="email" placeholder="FirstLast@gmail.com" />
            </div>

            <div className="fullInput">
              <label>Message</label>
              <textarea placeholder="Hi! I love your game!..."></textarea>
            </div>

            <button type="submit" className="buttonContact">
              Send
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}