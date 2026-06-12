import { useTheme } from "@/src/providers/ThemeProvider";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function ToggleThemeButton() {
    const { toggleTheme,isDark } = useTheme();

    const icon = isDark ? "moon" : "sunny";
    const color = isDark ? "#3b82f6" : "#2563eb";

    return (
        <Pressable
            onPress={toggleTheme}
        >
            <View>
                <Ionicons name={icon} size={24} color={color} />
            </View>
        </Pressable>
    );
}