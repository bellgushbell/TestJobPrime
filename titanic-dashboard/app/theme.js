// app/theme.js
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "#f4f6f8",
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#121212",
            paper: "#1E1E1E",
        },
        primary: {
            main: "#90caf9",
        },
    },
});
