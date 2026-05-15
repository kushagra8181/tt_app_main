'use client';
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const LandingPage = () => {
  const router = useRouter();
  const handleLoginClick = () => {
    setIsSignup?.(false);
    router.push('/login');
  }
  const context = useContext(UserContext);
  const {setIsSignup} = context || {};
  const handleSignupClick = () => {
    setIsSignup?.(true);
    router.push('/login');
  }
  return (
    <div className="landing-page-wrapper">
      <div className="welcome-banner">
        <img src={'/images/welcome-banner.png'} alt="Welcome Banner" />
      </div>
      <div className="cta-buttons">
        <button className="login_btn" onClick={()=>handleLoginClick()}>Login</button>
        <button className="signup_btn" onClick={()=>handleSignupClick()}>Sign Up</button>
      </div>
    </div>
  )
}

export default LandingPage
