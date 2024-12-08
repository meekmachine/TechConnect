import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Navbar (in Navbar Component) */}


      {/* Carousel */}
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/TechConnect/images/header-img1.png"
            alt="First slide"
          />
          <Carousel.Caption className="text-start text-black">
            <h1 className="roboto-condensed">TechConnect</h1>
            <p>Where FIU Tech Minds Meet, Grow, and Thrive.</p>
            <Button href="/TechConnect/login" variant="primary">
              Join Now
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/TechConnect/images/header-img2.png"
            alt="Second slide"
          />
          <Carousel.Caption className="text-white text-start">
            <h1 className="roboto-condensed">Expand Your Skills</h1>
            <p>Discover new trends in the tech world.</p>
            <Button href="/learn" variant="primary">
              Learn More
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Three Columns Section */}
      <div className="container my-5">
        <div className="row">
          {/* About Us */}
          <div className="col-lg-4 col-md-6 mb-4 text-center content-section">
            <h3 className="roboto-condensed">About Us</h3>
            <p>
              TechConnect is an exclusive forum for FIU students to connect,
              share opportunities, and discover events.
            </p>
            <Link to="/about-us" className="btn btn-link">
              Learn More
            </Link>
            <img
              src="/TechConnect/images/aboutus.png"
              className="img-fluid mt-3"
              alt="About Us"
            />
          </div>

          {/* Job Market */}
          <div className="col-lg-4 col-md-6 mb-4 text-center content-section">
            <h3 className="roboto-condensed">Discover Job Market Insights</h3>
            <img
              src="/TechConnect/images/charts.png"
              className="img-fluid mt-3"
              alt="Job Market Insights"
            />
            <p>
              Discover real-time job market trends and the most in-demand
              skills.
            </p>
            <Button variant="warning" className="mt-3">
              Join Now
            </Button>
          </div>

          {/* Privacy Policy */}
          <div className="col-lg-4 col-md-6 mb-4 text-center content-section">
            <h3 className="roboto-condensed">Privacy Policy</h3>
            <p>
              At TechConnect, protecting your privacy is our top priority. We
              safeguard your data with advanced security measures.
            </p>
            <Link to="/privacy" className="btn btn-link">
              Learn More
            </Link>
            <img
              src="/TechConnect/images/privacy.png"
              className="img-fluid mt-3"
              alt="Privacy Policy"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p className="mb-0">Made with ❤️ by FIU students for FIU students</p>
        <p>TechConnect ®</p>
      </footer>
    </div>
  );
};

export default Home;