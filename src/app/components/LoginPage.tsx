'use client';

import React, { useState } from 'react'
type LoginPageProps = {
    isSignup: boolean;
}
const LoginPage: React.FC<LoginPageProps> = ({isSignup = false}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  return (
    <div>
        <div>
          {isLogin ? 
            <p>Already a member? <button>Login</button></p>
            :
            <p>New here? <button>Sign Up</button></p>
          }
        </div>
    </div>
  )
}

export default LoginPage
