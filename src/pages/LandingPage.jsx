// src/pages/LandingPage.jsx
import { Link, useNavigate } from "react-router-dom";
import FrameMeta from "../components/FrameMeta";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();

  // Add effect to load Farcaster icons and SendFox script
  useEffect(() => {
    // Load Heroicons script
    const heroiconsScript = document.createElement("script");
    heroiconsScript.src =
      "https://unpkg.com/heroicons@2.0.18/24/outline/heroicons.min.js";
    heroiconsScript.async = true;
    document.body.appendChild(heroiconsScript);

    // Load SendFox script
    const sendfoxScript = document.createElement("script");
    sendfoxScript.src = "https://cdn.sendfox.com/js/form.js";
    sendfoxScript.async = true;
    sendfoxScript.charSet = "utf-8";
    document.body.appendChild(sendfoxScript);

    // Add event listener for form submission
    const handleFormSubmit = (e) => {
      if (e.target.classList.contains("sendfox-form")) {
        // Wait for SendFox to process the form
        setTimeout(() => {
          navigate("/signup/success");
        }, 1000);
      }
    };

    document.addEventListener("submit", handleFormSubmit);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(heroiconsScript);
      document.body.removeChild(sendfoxScript);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono tracking-wide bg-black">
      {/* Add FrameMeta for default site sharing */}
      <FrameMeta />

      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Logo + Title */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="flex items-center h-20 md:h-32">
            <img src="/images/logo.png" alt="Logo" className="h-full w-auto" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            <span className="text-white">Second</span>
            <span className="text-cochineal-red">Order</span>
            <span className="text-cement">.fun</span>
          </h1>
        </div>

        {/* Nav with Icons */}
        <nav className="flex space-x-6 text-sm text-cement items-center">
          {/* Home */}
          <a
            href="#"
            className="flex items-center space-x-1 hover:text-cochineal-red transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9.75L12 4.5l9 5.25M4.5 10.5v8.25a.75.75 0 00.75.75H9V15a.75.75 0 01.75-.75h4.5A.75.75 0 0115 15v4.5h3.75a.75.75 0 00.75-.75V10.5"
              />
            </svg>
            <span>Home</span>
          </a>

          {/* Info */}
          <a
            href="#"
            className="flex items-center space-x-1 hover:text-cochineal-red transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 18.75v-6m0-4.5h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>About</span>
          </a>
        </nav>
      </header>

      {/* Main Panel */}
      <div className="bg-black/70 border-enamel-red border-[0.5px] rounded-md w-full max-w-3xl p-4 md:p-6 backdrop-blur-sm shadow-inner">
        {/* Tabs - Hidden but kept in DOM */}
        <div className="hidden space-x-2 mb-6 text-sm font-semibold">
          <button className="px-4 py-2 rounded-md bg-cochineal-red text-white border border-enamel-red">
            Your Profiles
          </button>
          <button className="px-4 py-2 rounded-md bg-transparent text-cement border border-asphalt hover:bg-asphalt/50">
            Badges & Achievements
          </button>
          <button className="px-4 py-2 rounded-md bg-transparent text-cement border border-asphalt hover:bg-asphalt/50">
            Game Stats
          </button>
        </div>

        {/* Inner content box */}
        <div className="bg-asphalt/70 rounded-md p-4 md:p-6 text-cement">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-cochineal-red">
            JOIN THE RANKS
          </h2>
          <p className="mb-4">
            The revolution begins soon. SecondOrder.fun seeks worthy initiates
            ready to ascend beyond the chaos. Enlist below to receive tactical
            briefings and secure your position in our coming deployment.
          </p>

          {/* Newsletter Form */}
          <div className="mt-6 max-w-md mx-auto">
            <form
              method="post"
              action="https://sendfox.com/form/1jdkoz/1ydl4e"
              className="sendfox-form flex flex-col gap-3"
              id="1ydl4e"
              data-async="true"
              data-recaptcha="true"
            >
              <div>
                <label
                  htmlFor="sendfox_form_name"
                  className="block text-sm font-medium text-pastel-rose mb-1"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  id="sendfox_form_name"
                  placeholder="Your First Name"
                  name="first_name"
                  required
                  className="w-full bg-asphalt/80 border border-cement/80 text-white p-2 rounded-md focus:border-cochineal-red focus:outline-none focus:ring-2 focus:ring-cochineal-red/20"
                />
              </div>

              <div>
                <label
                  htmlFor="sendfox_form_email"
                  className="block text-sm font-medium text-pastel-rose mb-1"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="sendfox_form_email"
                  placeholder="Your Email Address"
                  name="email"
                  required
                  className="w-full bg-asphalt/80 border border-cement/80 text-white p-2 rounded-md focus:border-cochineal-red focus:outline-none focus:ring-2 focus:ring-cochineal-red/20"
                />
              </div>

              {/* no bots please */}
              <div
                style={{ position: "absolute", left: "-5000px" }}
                aria-hidden="true"
              >
                <input
                  type="text"
                  name="a_password"
                  tabIndex={-1}
                  defaultValue=""
                  autoComplete="off"
                />
              </div>

              <div className="mt-2">
                <button
                  type="submit"
                  className="w-full bg-cochineal-red hover:bg-enamel-red text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Enlist Now
                </button>
              </div>
            </form>
            <p className="text-xs text-cement/70 mt-3 text-center">
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 md:mt-12 text-xs text-cement/70 text-center w-full max-w-3xl">
        <div className="flex justify-center items-center gap-6 mb-2">
          {/* Email Icon */}
          <a
            href="mailto:secondorder.fun@patrion.xyz"
            className="text-cement hover:text-cochineal-red transition-colors"
            title="Email Us"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </a>

          {/* Twitter/X Icon */}
          <a
            href="https://twitter.com/secondorderfun"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cement hover:text-cochineal-red transition-colors"
            title="Follow us on Twitter/X"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Farcaster Icon */}
          <a
            href="https://warpcast.com/secondorderfun"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cement hover:text-cochineal-red transition-colors"
            title="Follow us on Farcaster"
          >
            <i
              className="fc fc-square-farcaster w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            ></i>
          </a>
        </div>
        <p>© 2025 SecondOrder.fun. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
