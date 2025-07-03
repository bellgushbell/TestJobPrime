"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import LanguageIcon from "@mui/icons-material/Language";

import { useTranslation } from "react-i18next";

const Header = ({ toggleNavbar, isDarkMode, setIsDarkMode }) => {
  const { t, i18n, ready } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleLangMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleLangMenuClose();
  };

 
  if (!ready) return null;

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#0D1B2A",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleNavbar} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

     <Typography
        variant="h6"
        suppressHydrationWarning
        sx={{
            flexGrow: 1,
            fontFamily: "Segoe UI, sans-serif",
            letterSpacing: 1,
        }}
        >
        {t("header.title")}
        </Typography>


        <IconButton
          color="inherit"
          onClick={() => setIsDarkMode(!isDarkMode)}
          sx={{
            "&:hover": {
              color: "#FFD700",
            },
          }}
        >
          {isDarkMode ? <WbSunnyIcon /> : <NightsStayIcon />}
        </IconButton>

        <IconButton
          color="inherit"
          onClick={handleLangMenuOpen}
          sx={{
            "&:hover": {
              color: "#FFD700",
            },
          }}
        >
          <LanguageIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleLangMenuClose}
          MenuListProps={{
            sx: {
              backgroundColor: "#1B263B",
              color: "white",
              "& .MuiMenuItem-root": {
                "&:hover": {
                  backgroundColor: "#415A77",
                },
              },
            },
          }}
        >
          <MenuItem onClick={() => handleChangeLanguage("en")}>English</MenuItem>
          <MenuItem onClick={() => handleChangeLanguage("th")}>ไทย</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
