// src/pages/LandingPage.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import FrameMeta from "@/components/FrameMeta";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const LandingPage = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sendfox.com/js/form.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono tracking-wide bg-black">
      {/* Add FrameMeta for default site sharing */}
      <FrameMeta />

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
            <form
              method="post"
              action="https://sendfox.com/form/1jdkoz/1ydl4e"
              className="sendfox-form"
              data-async="true"
              data-recaptcha="false"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="sendfox_form_name"
                    className="block text-sm font-medium text-cement mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="sendfox_form_name"
                    name="first_name"
                    placeholder="Enter your first name"
                    required
                    className="w-full px-3 py-2 bg-asphalt text-cement border border-cement/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cochineal-red"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sendfox_form_email"
                    className="block text-sm font-medium text-cement mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="sendfox_form_email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="w-full px-3 py-2 bg-asphalt text-cement border border-cement/20 rounded-md focus:outline-none focus:ring-2 focus:ring-cochineal-red"
                  />
                </div>

                {/* Honeypot field */}
                <div
                  style={{ position: "absolute", left: "-5000px" }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="a_password"
                    tabIndex="-1"
                    value=""
                    autoComplete="off"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-cochineal-red text-white py-2 rounded-md hover:bg-enamel-red transition-colors"
                  >
                    Enlist!
                  </button>
                </div>
              </div>
            </form>
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
