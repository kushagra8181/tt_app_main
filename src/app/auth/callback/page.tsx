'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/login/LoginPage';
import apiCall from '@/lib/api';

const AuthCallback = () => {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    if (event === 'SIGNED_IN' && session) {
                        localStorage.setItem('uToken', session.access_token);
                        localStorage.setItem('rToken', session.refresh_token);

                        const response = await apiCall('users/api/google-login', 'POST');
                        if (response?.user) {
                            localStorage.setItem('userData', JSON.stringify(response.user));
                        }

                        subscription.unsubscribe();
                        router.push('/tournaments');
                    } else if (event === 'SIGNED_OUT' || !session) {
                        subscription.unsubscribe();
                        router.push('/login');
                    }
                }
            );
        };

        handleCallback();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className='loader'></div>
        </div>
    );
};

export default AuthCallback;
