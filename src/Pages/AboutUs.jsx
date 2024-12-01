import React from "react";

const AboutUs = () => {
  return (
    <div className="container my-5 main-content">
      <h1 className="text-start mb-4 roboto-condensed">About Us</h1>
      <div className="row align-items-center">
        <div className="col-lg-6 col-md-12 mb-4 text-justify">
          <p>
            TechConnect began as a collaborative project by five FIU students from diverse backgrounds, united by a shared passion for learning and helping others. Recognizing the increasing challenges tech students face in today’s competitive job market, they created TechConnect to empower their peers.
          </p>
          <p>
            In a tech-driven world, networking has become essential for success. By fostering meaningful connections with peers, professionals, and organizations, students can unlock new opportunities, gain industry insights, and build valuable relationships that lead to internships and jobs.
          </p>
        </div>
        <div className="col-lg-6 col-md-12 mb-4 text-center">
          <img
            src="/images/pages/aboutus-img.png"
            className="img-fluid rounded page-img"
            alt="About Us"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
