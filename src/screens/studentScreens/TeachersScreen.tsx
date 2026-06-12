import Input from "@/src/components/Input";
import { useTheme } from "@/src/providers/ThemeProvider";
import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeachersScreen(){
    const {isDark}=useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";

    return(
        <ScrollView 
            className="px-4 w-full" 
            contentContainerStyle={{flexGrow:1}}
            showsVerticalScrollIndicator={false}
        >
            {/* top section with filters */}
            <View className="flex flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-text-strong">Find Teachers</Text>
                <Pressable
                    className="p-3 bg-bg-2 rounded-lg border border-border"
                >
                    <FontAwesome5 name="sliders-h" size={20} color={strongText}/>
                </Pressable>
            </View>

            {/* searchbar */}
            <View className="relative mt-4">
                <FontAwesome5 className="absolute top-4 left-4 z-10" name="search" size={18} color={strongText}/>
                <Input
                    placeholder="Search by subject, name..."
                    placeholderTextColor={strongText}
                    className="pl-12"
                />
            </View>
        </ScrollView>
    );
}