function Footer() {
    const date = new Date().getFullYear();
    
  return (
    <div className="footer-container">
      <div className="footer-content">
        <a href="" className="gtu">
          General Terms of Use
        </a>
        <a href="" className="privacy">
          Privacy Policy
        </a>
        <a href="" className="contact">
          Contact Us
        </a>
      </div>
      <div className="copyright">© {date} CV Match. All rights reserved</div>
    </div>
  );
}

export default Footer;