"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

export default function HomePage() {
  const { t, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !ready) {
    return (
      <Box sx={{ mt: 7 }}>
        <Typography variant="h4" gutterBottom>
          Loading...
        </Typography>
      </Box>
    );
  }


  return (
    <Box sx={{ mt: 7 }}>
      <Typography variant="h4" gutterBottom>
        {t("home.title")}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 600 }}>
        {t("home.description")}
      </Typography>
    </Box>
  );
}
