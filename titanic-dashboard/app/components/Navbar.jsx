"use client";

import React from "react";
import Link from "next/link";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import FeedIcon from "@mui/icons-material/Feed";
import { useTranslation } from "react-i18next";

const drawerWidth = 170;

export default function Navbar({ isVisible }) {
  const { t, ready } = useTranslation(); 
  if (!ready) return null; 


  const menuItems = [
    { text: t("menu.num1"), icon: <FeedIcon />, path: "/num1" },
  ];

  return (
    <Drawer
      variant="persistent"
      open={isVisible}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          top: "64px",
        },
      }}
    >
      <List>
       {menuItems.map((item, index) => (
        <ListItemButton
            key={index}
            component={Link}
            href={item.path}
        >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
        </ListItemButton>
        ))}

      </List>
    </Drawer>
  );
}
