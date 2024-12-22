import "@farcaster/auth-kit/styles.css";
import { SignInButton, useProfile } from "@farcaster/auth-kit";

const LoginPage = () => {
  const { isAuthenticated, profile } = useProfile();

  return (
    <>
      <div>
        {isAuthenticated ? (
          <div>
            <p>Welcome, {profile.username}!</p>
            <img
              src={profile.pfpUrl}
              alt={`${profile.username}'s profile`}
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          </div>
        ) : (
          <>
            <h1>Login with Farcaster</h1>
          </>
        )}
      </div>
      <SignInButton />
    </>
  );
};

export default LoginPage;
