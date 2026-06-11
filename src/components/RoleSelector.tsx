import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export type Role = "student" | "teacher";

interface RoleSelectorProps {
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
}

export default function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  return (
    <View className="w-full flex-row gap-4 mt-2">
      {/* Learn / Student Card */}
      <Pressable
        onPress={() => onSelectRole("student")}
        className={`flex-1 p-5 rounded-[28px] border-2 bg-white transition-all duration-200 ${
          selectedRole === "student"
            ? "border-indigo-600/80 shadow-md shadow-indigo-600/30 scale-[1.02]"
            : "border-slate-100/80 shadow-sm shadow-black/5"
        }`}
        style={{
          shadowColor: selectedRole === "student" ? "#4f46e5" : "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: selectedRole === "student" ? 0.15 : 0.05,
          shadowRadius: selectedRole === "student" ? 8 : 4,
          elevation: selectedRole === "student" ? 4 : 1,
        }}
      >
        {/* Icon Container */}
        <View className="w-12 h-12 rounded-full items-center justify-center bg-[#EEEDFC]">
          <FontAwesome5 name="graduation-cap" size={20} color="#4f46e5" />
        </View>

        {/* Title */}
        <Text className="text-xl font-bold text-slate-800 mt-4">Learn</Text>

        {/* Description */}
        <Text className="text-xs text-slate-500 mt-1.5 leading-4">
          Enroll in courses & learn from experts.
        </Text>
      </Pressable>

      {/* Teach / Teacher Card */}
      <Pressable
        onPress={() => onSelectRole("teacher")}
        className={`flex-1 p-5 rounded-[28px] border-2 bg-white transition-all duration-200 ${
          selectedRole === "teacher"
            ? "border-sky-500/80 shadow-md shadow-sky-500/30 scale-[1.02]"
            : "border-slate-100/80 shadow-sm shadow-black/5"
        }`}
        style={{
          shadowColor: selectedRole === "teacher" ? "#0284c7" : "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: selectedRole === "teacher" ? 0.15 : 0.05,
          shadowRadius: selectedRole === "teacher" ? 8 : 4,
          elevation: selectedRole === "teacher" ? 4 : 1,
        }}
      >
        {/* Icon Container */}
        <View className="w-12 h-12 rounded-full items-center justify-center bg-[#EAF5FC]">
          <FontAwesome5 name="chalkboard-teacher" size={20} color="#0284c7" />
        </View>

        {/* Title */}
        <Text className="text-xl font-bold text-slate-800 mt-4">Teach</Text>

        {/* Description */}
        <Text className="text-xs text-slate-500 mt-1.5 leading-4">
          Create courses & host sessions.
        </Text>
      </Pressable>
    </View>
  );
}
