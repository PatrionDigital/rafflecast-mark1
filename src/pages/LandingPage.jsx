// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import FrameMeta from "@/components/FrameMeta";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  HomeIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono tracking-wide bg-black">
      {/* Add FrameMeta for default site sharing */}
      <FrameMeta />

      {/* Add Farcaster font stylesheet */}
      <link rel="stylesheet" href="/farcaster/style.css" />

      {/* Header */}
      <Header />

      {/* Main Panel */}
      <div className="bg-black/70 border-enamel-red border-[0.5px] rounded-md w-full max-w-3xl p-2 md:p-3 backdrop-blur-sm shadow-inner">
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
            <style>
              {`
                .sendfox-form {
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                }
                .sendfox-form p {
                  margin: 0;
                }
                .sendfox-form label {
                  display: block;
                  font-size: 0.875rem;
                  font-weight: 500;
                  color: #fecdd3;
                  margin-bottom: 0.25rem;
                }
                .sendfox-form input {
                  width: 100%;
                  background-color: rgba(51, 65, 85, 0.8);
                  border: 1px solid rgba(148, 163, 184, 0.8);
                  color: white;
                  padding: 0.5rem;
                  border-radius: 0.375rem;
                }
                .sendfox-form input:focus {
                  border-color: #c82a54;
                  outline: none;
                  box-shadow: 0 0 0 2px rgba(200, 42, 84, 0.2);
                }
                .sendfox-form button {
                  width: 100%;
                  background-color: #c82a54;
                  color: white;
                  font-weight: bold;
                  padding: 0.5rem 1rem;
                  border-radius: 0.375rem;
                  transition: background-color 0.2s;
                }
                .sendfox-form button:hover {
                  background-color: #b2004b;
                }
              `}
            </style>
            <div
              dangerouslySetInnerHTML={{
                __html: `
                <form method="post" action="https://sendfox.com/form/1jdkoz/1ydl4e" class="sendfox-form" id="1ydl4e" data-async="true" data-recaptcha="true">
                  <p><label for="sendfox_form_name">First Name: </label><input type="text" id="sendfox_form_name" placeholder="First Name" name="first_name" required /></p>
                  <p><label for="sendfox_form_email">Email: </label><input type="email" id="sendfox_form_email" placeholder="Email" name="email" required /></p>
                  <!-- no botz please -->
                  <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="a_password" tabindex="-1" value="" autocomplete="off" /></div>
                  <p><button type="submit">Enlist!</button></p>
                </form>
              `,
              }}
            />
          </div>

          {/* Privacy Message */}
          <div className="mt-3 w-full max-w-2xl mx-auto">
            <p className="text-xs text-cement/70 text-center">
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
