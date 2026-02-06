function Footer() {
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>About ShopSmart</h3>
            <p>AI-powered product discovery platform</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Technology</h3>
            <p>Built with AWS • React • DynamoDB</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 ShopSmart. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  
  export default Footer;