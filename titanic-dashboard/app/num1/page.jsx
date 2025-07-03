"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, List, ListItem,
  IconButton, Grid, Paper
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend
);

export default function TitanicDashboard() {
  const [data, setData] = useState([]);
  const [comments, setComments] = useState({});
  const [inputs, setInputs] = useState({});
  const [editState, setEditState] = useState({});
  const [searchName, setSearchName] = useState("");
  const [showAllNames, setShowAllNames] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const theme = useTheme();
  const { t, ready } = useTranslation();


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    Papa.parse("/data/titanic.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data.filter(row => row.survived !== ""));
      },
    });
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const storedComments = localStorage.getItem("titanic-comments");
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("titanic-comments", JSON.stringify(comments));
  }, [comments, isClient]);

  if (!ready || !isClient) {
    return <Typography sx={{ mt: 4, px: 3 }}>Loading...</Typography>;
  }


  const generateChartOptions = (isPie = false) => {
    const isDark = theme.palette.mode === "dark";
    const labelColor = isDark ? "#fff" : "#333";
    return {
      plugins: {
        legend: {
          labels: { color: labelColor },
        },
      },
      ...(isPie
        ? {}
        : {
            scales: {
              x: { ticks: { color: labelColor } },
              y: { ticks: { color: labelColor } },
            },
          }),
    };
  };

  const handleAddComment = (section) => {
    if (!inputs[section]?.trim()) return;
    const newList = comments[section] ? [...comments[section]] : [];
    newList.push(inputs[section]);
    setComments({ ...comments, [section]: newList });
    setInputs({ ...inputs, [section]: "" });
  };

  const handleEditComment = (section, index) => {
    setEditState({ section, index, value: comments[section][index] });
  };

  const handleSaveEdit = () => {
    const { section, index, value } = editState;
    const updated = [...comments[section]];
    updated[index] = value;
    setComments({ ...comments, [section]: updated });
    setEditState({});
  };

  const handleDeleteComment = (section, index) => {
    const updated = comments[section].filter((_, i) => i !== index);
    setComments({ ...comments, [section]: updated });
  };

  const renderCommentSection = (key) => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
        {t("comment.title")}
      </Typography>
      <TextField
        value={inputs[key] || ""}
        onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
        placeholder={t("comment.placeholder", "Write a comment...")}
        fullWidth
        size="small"
        sx={{
          my: 1,
          input: { color: theme.palette.text.primary },
          "& .MuiInputBase-root": { backgroundColor: theme.palette.background.paper },
        }}
      />
      <Button
        variant="contained"
        sx={{
          mt: 1,
          background: "linear-gradient(to right, #1e3c72, #2a5298)",
          color: "#fff",
          fontWeight: 600,
          "&:hover": { background: "linear-gradient(to right, #1a2a6c, #2e3a94)" },
        }}
        onClick={() => handleAddComment(key)}
      >
        {t("comment.add")}
      </Button>
      <List>
        {(comments[key] || []).map((comment, index) => (
          <ListItem
            key={index}
            secondaryAction={
              editState.section === key && editState.index === index ? (
                <IconButton edge="end" onClick={handleSaveEdit}>
                  <SaveIcon />
                </IconButton>
              ) : (
                <>
                  <IconButton edge="end" onClick={() => handleEditComment(key, index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteComment(key, index)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )
            }
            sx={{ color: theme.palette.text.primary }}
          >
            {editState.section === key && editState.index === index ? (
              <TextField
                value={editState.value}
                onChange={(e) => setEditState({ ...editState, value: e.target.value })}
                size="small"
                fullWidth
                sx={{
                  input: { color: theme.palette.text.primary },
                  "& .MuiInputBase-root": { backgroundColor: theme.palette.background.paper },
                }}
              />
            ) : (
              comment
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const filterSurvivors = () => data.filter(d => d.survived === "1");

  const survivorsBy = (key) => {
    const map = {};
    filterSurvivors().forEach(row => {
      const k = row[key] || t("dashboard.unknown");
      map[k] = (map[k] || 0) + 1;
    });
    return map;
  };

  const survivorsByAgeGroup = () => {
    const group = {
      [t("dashboard.child")]: 0,
      [t("dashboard.teen")]: 0,
      [t("dashboard.adult")]: 0,
      [t("dashboard.senior")]: 0,
    };
    filterSurvivors().forEach(row => {
      const age = parseFloat(row.age);
      if (isNaN(age)) return;
      if (age < 12) group[t("dashboard.child")]++;
      else if (age < 20) group[t("dashboard.teen")]++;
      else if (age < 60) group[t("dashboard.adult")]++;
      else group[t("dashboard.senior")]++;
    });
    return group;
  };

  const average = (field) => {
    const vals = filterSurvivors()
      .map(r => parseFloat(r[field]))
      .filter(v => !isNaN(v));
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  };

  const survivorNames = filterSurvivors().map(r => r.name);

  const barData = (labels, values) => ({
    labels,
    datasets: [{ label: t("dashboard.survivors"), data: values, backgroundColor: "#42a5f5" }],
  });

  const pieData = (labels, values) => ({
    labels,
    datasets: [{ label: t("dashboard.survivors"), data: values, backgroundColor: ["#66bb6a", "#ffa726", "#ef5350", "#ab47bc"] }],
  });

  const gridItem = (title, chart, key) => (
    <Grid item xs={12} md={6}>
      <Paper
        elevation={6}
        sx={{
          p: 3,
          backgroundColor: theme.palette.background.default,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 2 }}>
          {title}
        </Typography>
        {chart}
        {renderCommentSection(key)}
      </Paper>
    </Grid>
  );

  const embarkedData = survivorsBy("embarked");
  const customOrder = ["S", "C", "Q", t("dashboard.unknown")];
  const embarkLabels = customOrder.filter(label => label in embarkedData);
  const embarkValues = embarkLabels.map(label => embarkedData[label]);

  return (
    <Box sx={{ mt: 4, px: 3, minHeight: "100vh", py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
        {t("dashboard.title", "Titanic Dashboard")}
      </Typography>
      <Grid container spacing={4}>
        {gridItem(
          t("dashboard.1"),
          <Bar data={barData([t("dashboard.male"), t("dashboard.female")], Object.values(survivorsBy("sex")))} options={generateChartOptions()} />,
          "gender"
        )}
        {gridItem(
          t("dashboard.2"),
          <Pie
            data={pieData(
              [t("dashboard.first"), t("dashboard.second"), t("dashboard.third")],
              [survivorsBy("pclass")[1], survivorsBy("pclass")[2], survivorsBy("pclass")[3]]
            )}
            options={generateChartOptions(true)}
          />,
          "class"
        )}
        {gridItem(
          t("dashboard.3"),
          <Pie data={pieData(embarkLabels, embarkValues)} options={generateChartOptions(true)} />,
          "embarked"
        )}
        {gridItem(
          t("dashboard.4"),
          <Bar data={barData(Object.keys(survivorsBy("sibsp")), Object.values(survivorsBy("sibsp")))} options={generateChartOptions()} />,
          "sibsp"
        )}
        {gridItem(
          t("dashboard.5"),
          <Bar data={barData(Object.keys(survivorsBy("parch")), Object.values(survivorsBy("parch")))} options={generateChartOptions()} />,
          "parch"
        )}
        {gridItem(
          t("dashboard.6"),
          <Bar data={barData(Object.keys(survivorsByAgeGroup()), Object.values(survivorsByAgeGroup()))} options={generateChartOptions()} />,
          "ageGroup"
        )}
        {gridItem(t("dashboard.7", { value: average("age") }), null, "avgAge")}
        {gridItem(t("dashboard.8", { value: average("fare") }), null, "avgFare")}
        {gridItem(
          t("dashboard.9", { count: survivorNames.length }),
          <>
            <TextField
              label={t("dashboard.searchNameLabel", "Search name...")}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              fullWidth
              sx={{
                my: 2,
                input: { color: theme.palette.text.primary },
                "& .MuiInputBase-root": {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
            <List dense>
              {survivorNames
                .filter((name) => name.toLowerCase().includes(searchName.toLowerCase()))
                .slice(0, showAllNames ? survivorNames.length : 5)
                .map((name, i) => (
                  <ListItem key={i} sx={{ color: theme.palette.text.primary }}>
                    {name}
                  </ListItem>
                ))}
            </List>
            {searchName === "" && survivorNames.length > 50 && (
              <Button onClick={() => setShowAllNames(!showAllNames)}>
                {showAllNames ? t("dashboard.showLess", "Show Less") : t("dashboard.showMore", "Show More")}
              </Button>
            )}
          </>,
          "names"
        )}
      </Grid>
    </Box>
  );
}
