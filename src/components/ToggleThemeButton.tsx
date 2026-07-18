import { useTheme } from "@/src/providers/ThemeProvider";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Pressable, Switch, Text, View } from "react-native";

export default function ToggleThemeButton() {
    const { toggleTheme,isDark } = useTheme();

    const icon = isDark ? "moon" : "sunny";
    const color = isDark ? "#3b82f6" : "#2563eb";

    return (
        <Switch
            trackColor={{false:"#767577",true:"#81b0ff"}}
            thumbColor={isDark?"#f5dd4b":"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDark}
        />
    );
}