import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";


const ProTeacherBadge = () => {
    return (
        <View className="flex flex-row gap-1 justify-center items-center absolute top-2 left-2 bg-primary px-2 py-1 rounded-md shadow-md z-10">
            <View className="bg-card rounded-full p-1">
                <Ionicons name="checkmark-circle-outline" size={13} color="white" />
            </View>
            <Text className="text-white text-xs font-bold">Pro Teacher</Text>
        </View>
    );
};

export default ProTeacherBadge;