'use client'

import { useState, createContext, useEffect } from "react";

type UserContextType = {
    isSignup: boolean;
    setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}
export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
    children: React.ReactNode;
}
type UserData = {
    id: string;
    email: string;
    name: string;
    avatar_url: string;
}

export function UserProvider({ children } : UserProviderProps) {
    const [isSignup, setIsSignup] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData>({  
        id: '',
        name: '',
        email: '',
        avatar_url: ''
    });
    return (
        <UserContext.Provider value={{ 
            isSignup, 
            setIsSignup,
            userData,
            setUserData
        }}>
            {children}
        </UserContext.Provider>
    )
}

