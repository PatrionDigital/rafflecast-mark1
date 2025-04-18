import { EnvelopeIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="mt-8 md:mt-12 text-xs text-cement/70 text-center w-full max-w-3xl">
      <div className="flex justify-center items-center gap-6 mb-2">
        {/* Email Icon */}
        <a
          href="mailto:secondorder.fun@patrion.xyz"
          className="text-cement hover:text-cochineal-red transition-colors"
          title="Email Us"
        >
          <EnvelopeIcon className="w-7 h-7" />
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
            className="w-7 h-7"
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
          <i className="fc fc-square-farcaster text-2xl"></i>
        </a>
      </div>
      <p>© 2025 SecondOrder.fun. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
