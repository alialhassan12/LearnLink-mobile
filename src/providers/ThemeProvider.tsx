import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useColorScheme } from "nativewind";


import {
    ThemeProvider as NavigationProvider,
    DefaultTheme,
    DarkTheme,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#2563eb",      // --primary (sapphire blue)
        background: "#ffffff",   // --bg-1 (pure white)
        card: "#f8fafc",         // --bg-2 (slate-50)
        text: "#0f172a",         // --text-strong (deep slate)
        border: "#e2e8f0",       // --border (slate-200)
    },
};

const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: "#3b82f6",      // --primary (vibrant blue)
        background: "#0f172a",   // --bg-1 (slate-900)
        card: "#1e293b",         // --bg-2 (slate-800)
        text: "#f8fafc",         // --text-strong (slate-50)
        border: "#334155",       // --border (slate-700)
    },
};

export function ThemeProvider({children}:{children:React.ReactNode}){
    const { colorScheme, setColorScheme } =
    useColorScheme();

    const toggleTheme = () => {
        setColorScheme(
        colorScheme === "dark"
            ? "light"
            : "dark"
        );
    };

    const isDark = colorScheme === "dark";
    const navigationTheme = isDark ? CustomDarkTheme : CustomLightTheme;

    return (
        <ThemeContext.Provider
            value={{
                isDark,
                toggleTheme,
            }}
        >
            <NavigationProvider value={navigationTheme}>
                <StatusBar style={isDark ? "light" : "dark"} />
                {children}
            </NavigationProvider>
        </ThemeContext.Provider>
    );
}

export function useTheme(){
    const context=useContext(ThemeContext);
    if(!context){
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}