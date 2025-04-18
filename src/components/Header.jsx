// components/Header.jsx
import { HomeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

const Header = () => {
  return (
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
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </a>

        {/* Info */}
        <a
          href="#"
          className="flex items-center space-x-1 hover:text-cochineal-red transition"
        >
          <InformationCircleIcon className="w-5 h-5" />
          <span>About</span>
        </a>
      </nav>
    </header>
  );
};

export default Header;
