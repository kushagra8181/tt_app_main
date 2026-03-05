const LandingPage = () => {
  return (
    <div className="landing-page-wrapper">
      <div className="welcome-banner">
        <img src={'/images/welcome-banner.png'} alt="Welcome Banner" />
      </div>
      <div className="cta-buttons">
        <button className="login_btn">Login</button>
        <button className="signup_btn">Sign Up</button>
      </div>
    </div>
  )
}

export default LandingPage
