import { Modal, Text, View, TouchableOpacity, Pressable } from "react-native";
import Input from "../Input";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

export default function AddSectionModal({
    open,
    setOpen,
    sectionName,
    setSectionName,
    onAdd,
}:{
    open:boolean;
    setOpen:(open:boolean)=>void;
    sectionName:string;
    setSectionName:(sectionName:string)=>void;
    onAdd?: () => void;
}){
    const { isDark } = useTheme();

    const handleAdd = () => {
        if (onAdd) {
            onAdd();
        }
        setSectionName("");
        setOpen(false);
    };

    return(
        <Modal 
            visible={open} 
            transparent={true} 
            animationType="fade"
            onRequestClose={()=>setOpen(false)}
        >
            <Pressable 
                onPress={() => setOpen(false)}
                className="flex-1 justify-center items-center bg-black/60 px-5"
            >
                {/* Modal Card */}
                <Pressable 
                    onPress={(e) => e.stopPropagation()} // Prevents dismiss click propagation
                    className="w-full bg-bg-2 border border-border rounded-2xl p-6 shadow-2xl flex-col gap-4"
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center pb-3 border-b border-border">
                        <View className="flex-row items-center gap-2">
                            <View className="p-2 bg-primary/10 rounded-lg">
                                <Ionicons name="folder-outline" size={20} color={isDark ? "#3b82f6" : "#2563eb"} />
                            </View>
                            <Text className="text-text-strong text-lg font-bold">Add New Section</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => setOpen(false)}
                            className="p-1.5 rounded-full bg-bg-1 border border-border active:opacity-70"
                        >
                            <Ionicons name="close" size={18} color={isDark ? "#fff" : "#1e293b"} />
                        </TouchableOpacity>
                    </View>

                    {/* Input Field */}
                    <View className="flex-col gap-1.5 mt-2">
                        <Text className="text-text-weak text-sm font-semibold">Section Name</Text>
                        <Input  
                            value={sectionName}
                            onChangeText={(text)=>setSectionName(text)}
                            placeholder="e.g., Introduction to React Native"
                            placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                            className="rounded-xl border border-border bg-bg-1 px-4 py-3 focus:border-primary text-text-strong"
                        />
                    </View>

                    {/* Footer Actions */}
                    <View className="flex-row items-center gap-3 mt-4">
                        <TouchableOpacity
                            onPress={() => setOpen(false)}
                            className="flex-1 border border-border bg-bg-1 rounded-xl py-3 items-center justify-center active:opacity-75"
                        >
                            <Text className="text-text-strong font-semibold text-sm">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleAdd}
                            disabled={!sectionName.trim()}
                            className={`flex-1 rounded-xl py-3 items-center justify-center active:opacity-85 ${
                                sectionName.trim() ? 'bg-primary' : 'bg-primary/50'
                            }`}
                        >
                            <Text className="text-white font-bold text-sm">Create Section</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}