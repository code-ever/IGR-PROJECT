import axios from "axios";

const api = axios.create( {
    baseURL: "https://igronchain.onrender.com",
} );

// Attach Bearer token automatically
api.interceptors.request.use(
    ( config ) => {
        const token = localStorage.getItem( "token" );
        console.log(token);
        if ( token ) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    ( error ) => Promise.reject( error )
);

export default api;
