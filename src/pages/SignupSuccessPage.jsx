import { Link } from "react-router-dom";
import FrameMeta from "../components/FrameMeta";

const SignupSuccessPage = () => {
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
          <Link
            to="/"
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
          </Link>
        </nav>
      </header>

      {/* Main Panel */}
      <div className="bg-black/70 border-enamel-red border-[0.5px] rounded-md w-full max-w-3xl p-4 md:p-6 backdrop-blur-sm shadow-inner">
        {/* Inner content box */}
        <div className="bg-asphalt/70 rounded-md p-4 md:p-6 text-cement">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-cochineal-red">
            WELCOME TO THE RANKS
          </h2>

          <div className="flex flex-col items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-cochineal-red mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-center text-lg mb-4">
              Your enlistment has been confirmed. Welcome to SecondOrder.fun.
            </p>
            <p className="text-center mb-6">
              You'll receive tactical briefings and updates as we prepare for
              deployment. Stay tuned for further instructions.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/"
              className="bg-cochineal-red hover:bg-enamel-red text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Return Home
            </Link>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </a>
        </div>
        <p>© 2024 SecondOrder.fun. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignupSuccessPage;
