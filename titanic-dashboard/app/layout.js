"use client";

import React, { useEffect, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "../app/components/Navbar";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../app/components/Header"), { ssr: false });

import { lightTheme, darkTheme } from "../app/theme";
import "../app/i18n";

export default function RootLayout({ children }) {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode === "true") {
      setIsDarkMode(true);
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  const toggleNavbar = () => setIsNavbarVisible((prev) => !prev);

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header
              toggleNavbar={toggleNavbar}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              {isNavbarVisible && <Navbar isVisible={isNavbarVisible} />}
              <Box component="main" sx={{ flexGrow: 1, overflow: "auto", p: 3 }}>
                {children}
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
