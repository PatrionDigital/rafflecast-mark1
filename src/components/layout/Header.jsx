// components/Header.jsx
import {
  HomeIcon,
  InformationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useProfile, SignInButton } from "@farcaster/auth-kit";

const Header = () => {
  const { isAuthenticated } = useProfile();

  return (
    <header className="w-full flex flex-col md:flex-row justify-between items-center bg-black p-4">
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

        {/* Profile */}
        {isAuthenticated ? (
          <a
            href="/profile"
            className="flex items-center space-x-1 hover:text-cochineal-red transition"
          >
            <UserCircleIcon className="w-5 h-5" />
            <span>Profile</span>
          </a>
        ) : (
          <SignInButton>
            <button className="flex items-center space-x-1 hover:text-cochineal-red transition">
              <UserCircleIcon className="w-5 h-5" />
              <span>Login with Farcaster</span>
            </button>
          </SignInButton>
        )}
      </nav>
    </header>
  );
};

export default Header;
