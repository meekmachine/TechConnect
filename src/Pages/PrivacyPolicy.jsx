import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container my-5">
      <h1 className="text-start mb-4 roboto-condensed">Privacy Policy</h1>

      {/* First Row */}
      <div className="row mt-5">
        <div className="col-12">
          <p>
            At TechConnect, we are deeply committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy details how we responsibly collect, use, and safeguard your data while providing our website and services, prioritizing transparency and trust at every step.
          </p>
        </div>
      </div>

      {/* Second Row */}
      <div className="row align-items-center middle-section">
        {/* Text Column */}
        <div className="col-lg-6 col-md-12 mb-4 text-justify">
          <div>
            <h2 className="subheading">Information We Collect:</h2>
            <ul>
              <li>
                <strong>Personal Information:</strong> When you register or interact with our services, we may collect personal data such as your name, email address, and login credentials.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect data on how you use our website, including page views, clicks, and time spent on the site, to improve your experience.
              </li>
            </ul>

            <h2 className="subheading">How We Use Your Information:</h2>
            <ul>
              <li>To provide and enhance our services.</li>
              <li>To communicate with you about updates, features, or promotions.</li>
              <li>To improve website functionality and user experience.</li>
            </ul>

            <h2 className="subheading">Data Security:</h2>
            <p>
              We take appropriate measures to protect your personal data from unauthorized access, alteration, or disclosure. Your information is stored securely, and we use encryption where necessary.
            </p>
          </div>
        </div>

        {/* Image Column */}
        <div className="col-lg-6 col-md-12 mb-4 text-center">
          <img
            src="/images/pages/privacy-img.png"
            className="img-fluid rounded page-img"
            alt="Privacy Policy"
          />
        </div>
      </div>

      {/* Third Row */}
      <div className="row mt-5">
        <div className="col-12">
          <h2 className="subheading">Your Rights:</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time by contacting us or through via email at{" "}
            <a href="mailto:support@techconnect.com">support@techconnect.com</a>.
            For more details or inquiries regarding your privacy, please contact our support team at{" "}
            <a href="mailto:support@techconnect.com">support@techconnect.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;