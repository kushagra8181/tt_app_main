'use client';

import React, { useContext, useState } from 'react'

import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import apiCall from '@/lib/api';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type LoginPageProps = {
  isSignup?: boolean;
}
type FieldError = {
  field: string;
  message: string;
}

const LoginPage: React.FC<LoginPageProps> = () => {
  const context = useContext(UserContext);
  const {isSignup, setIsSignup} = context || {};
  const [error, setError] = useState<FieldError[]>([]);
  const router = useRouter();

  const getErrorMessage = (field: string) => {
    const fieldError = error?.find(err => err.field === field);
    return fieldError ? fieldError.message : '';
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);
    const nErrors : FieldError[] = []
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const dob = formData.get('dob') || null;

    if (!email) {nErrors.push({ field: 'email', message: 'Email is required' })}
    if(!password) {nErrors.push({ field: 'password', message: 'Password is required' })}

    if (isSignup) {
      const name = formData.get('name') as string;
      const vpassword = formData.get('vpassword') as string;
      const roles = formData.getAll('role') as string[];

      if (!name) {nErrors.push({ field: 'name', message: 'Name is required' })}
      if (!dob) nErrors.push({ field: 'dob', message: 'Date of birth is required' });
      if (password !== vpassword) {nErrors.push({ field: 'vpassword', message: 'Passwords do not match' })}

      if (roles.length === 0) {nErrors.push({ field: 'role', message: 'At least one role must be selected' })}
      if (nErrors.length > 0) {
        setError(nErrors);
        return;
      }
      try {
        const data = await apiCall('users/api/registration', 'POST', { 
            name, email, password, role: roles.join(','), image_url: '', dob: dob || null
        });

        if (!data) return;
        localStorage.setItem('uToken', data?.data?.session?.access_token);
        localStorage.setItem('rToken', data?.data?.session?.refresh_token);
        localStorage.setItem('userData', JSON.stringify(data?.data?.user));
        router.push('/tournaments');
      } catch (err) {
        console.error('Registration error', err);
      }
    }
    else {
      if (nErrors.length > 0) {
        setError(nErrors);
        return;
      }
      try {
        const response = await apiCall('users/api/login', 'POST', { email, password });
        const data = await response;
        
        if (!response) {
          console.error('Registration error', data);
          return;
        }
        localStorage.setItem('uToken', data?.data?.session?.access_token);
        localStorage.setItem('rToken', data?.data?.session?.refresh_token);
        localStorage.setItem('userData', JSON.stringify(data?.data?.user));
        router.push('/tournaments');
      } catch (err) {
        console.error('Login error', err);
      }
    }
  };


  const handleGoogleLogin = async() => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      console.error('Google login error', error);
    }
  }

  return (
    <div className='login-page-wrapper'>
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

      <div className='form-wrapper'>
        {isSignup ? (
          <>
          <form className='signup-form' onSubmit={handleSubmit}>
            <div className='input-section'>
              <input name="name" placeholder="Name" />
              {getErrorMessage('name') && <p className='error-message'>{getErrorMessage('name')}</p>}
            </div>
            <div className='input-section'>
              <input name="email" placeholder="Email" />
              {getErrorMessage('email') && <p className='error-message'>{getErrorMessage('email')}</p>}
            </div>
            <div className='input-section'>
              <label>Choose your role:</label>
              <div className='role-selection'>
                <label className='role-label'>
                  <input type='checkbox' name='role' value='player' /> Player
                </label>
                <label className='role-label'>
                  <input type='checkbox' name='role' value='viewer' /> Viewer
                </label>
              </div>
              {getErrorMessage('role') && <p className='error-message'>{getErrorMessage('role')}</p>}
            </div>
            <div className='input-section'>
                <label>Date of Birth</label>
                <input type='date' name='dob' />
                {getErrorMessage('dob') && <p className='error-message'>{getErrorMessage('dob')}</p>}
            </div>
            <div className='input-section'>
              <input name="password" type="password" placeholder="Password" />
              <input name="vpassword" type="password" placeholder="Verify Password" />
              {getErrorMessage('password') && <p className='error-message'>{getErrorMessage('password')}</p>}
            </div>
            <button type="submit">Submit</button>
          </form>
          <button type="button" className='google-btn' onClick={handleGoogleLogin}>
              <img src="https://www.google.com/favicon.ico" alt="google" />
              Continue with Google
          </button>
          </>
        ) : (
          <>
            <form className='login-form' onSubmit={handleSubmit}>
              <input name="email" placeholder="Email" />
              <input name="password" type="password" placeholder="Password" />
              <button type="submit">Login</button>
            </form>
            <button type="button" className='google-btn' onClick={handleGoogleLogin}>
              <img src="https://www.google.com/favicon.ico" alt="google" />
              Continue with Google
          </button>
          </>
        )}
      </div>
      <p className='toggle-form-btn'>
        {isSignup ? "Already have an account?  " : "New here?  "}
        <button onClick={() => setIsSignup?.(!isSignup)}>{isSignup ? ' Login': ' Sign Up'}</button>
      </p>
    </div>
  )
}

export default LoginPage
