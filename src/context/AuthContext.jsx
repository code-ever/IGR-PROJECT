import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext( null );

export const AuthProvider = ( { children } ) => {
    const [user, setUser] = useState( null );
    const [token, setToken] = useState( null );
    const [loading, setLoading] = useState( true );


    useEffect( () => {
        const storedToken = localStorage.getItem( "token" );
        const storedUser = localStorage.getItem( "user" );

        if ( storedToken && storedUser ) {
            try {
                setToken( storedToken );
                setUser( JSON.parse( storedUser ) );
            } catch ( error ) {
                console.error( "Invalid user data in localStorage. Clearing..." );
                localStorage.removeItem( "user" );
                localStorage.removeItem( "token" );
            }
        }

        setLoading( false );
    }, [] );


    const login = async ( email, password ) => {
        try {
            const res = await api.post( "/auth/login", { email, password } );
             console.log( res )
            const { user, accessToken } = res.data.data;
            console.log( user )
            setUser( user );
            setToken( accessToken );

            localStorage.setItem( "token", accessToken );

            localStorage.setItem( "user", JSON.stringify( user ) );
        } catch ( error ) {
            console.error( "Login error:", error );
            throw error;
        }
    };

    const logout = () => {
        setUser( null );
        setToken( null );
        localStorage.clear();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                loading,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext( AuthContext );
