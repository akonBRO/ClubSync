import './App.css';

function App() {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-animation">
          <span style={{ top: "10%", left: "15%" }}></span>
          <span style={{ top: "40%", left: "60%" }}></span>
          <span style={{ top: "70%", left: "20%" }}></span>
          <span style={{ top: "90%", left: "50%" }}></span>
        </div>
        <h1>Welcome to ClubSync</h1>
        <p>Empowering Students Through Leadership, Creativity, and Teamwork</p>
        <div className="login-buttons">
          <a href="ClubLogin.jsx"><button>Student Login</button></a>
          <a href="ClubLogin.jsx"><button>Club Login</button></a>
        </div>
      </div>

      {/* Carousel */}
      <div id="quoteCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <h5>“The future belongs to those who believe in the beauty of their dreams.”</h5>
            <p>- Eleanor Roosevelt</p>
          </div>
          <div className="carousel-item">
            <h5>“Success is not final, failure is not fatal: It is the courage to continue that counts.”</h5>
            <p>- Winston Churchill</p>
          </div>
          <div className="carousel-item">
            <h5>“Leadership is not about being in charge, it’s about taking care of those in your charge.”</h5>
            <p>- Simon Sinek</p>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#quoteCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#quoteCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Info Section */}
      <div className="info-container">
        <div className="info-box">
          <h3>About OCA</h3>
          <p>
            The Office of Co-Curricular Activities (OCA) at BRAC University is the hub for student clubs and activities...
          </p>
        </div>
        <div className="info-box">
          <h3>What We Do</h3>
          <p>
            OCA organizes cultural fests, hackathons, and leadership workshops...
          </p>
        </div>
        <div className="info-box">
          <h3>Contact Us</h3>
          <p>Email: oca@bracu.ac.bd<br />Phone: +880-2-12345678</p>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 Sabbir, Sadik & Mushfiq | CSE470 Project: ClubSync</p>
      </footer>
    </div>
  );
}


export default App;
