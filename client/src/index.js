import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { GoogleProvider } from '@react-oauth/google';
// import {createClient} from "@supabase/supabase-js";
// import {SessionContextProvider} from "@supabase/auth-helpers-react";

// const supabase = createClient(
//   "https://vhrkyyqukanxjlohgtik.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocmt5eXF1a2FueGpsb2hndGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAyMDQ2NzMsImV4cCI6MjAwNTc4MDY3M30.E1LEGua7zT0R5iSZCBtlxkkUQZkRhRoy41OcKnQt6wk"
// )

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    {/* <GoogleProvider clientId="300155728118-6h29j4fmc5g5jtnoeb6b84g8v1m90pjc.apps.googleusercontent.com"> */}
      <App />
    {/* </GoogleProvider> */}
    {/* <SessionContextProvider supabaseClient={supabase}> */}
    {/* </SessionContextProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
