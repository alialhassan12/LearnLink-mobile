import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Booking } from "@/src/@types/booking";

interface UpcomingSessionCardProps {
    booking: Booking;
}

export default function UpcomingSessionCard({ booking }: UpcomingSessionCardProps) {
    return (
        <View className="w-56 bg-bg-2 border border-border rounded-2xl p-4 gap-3">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="calendar-outline" size={14} color="#64748b" />
                    <Text className="text-text-weak text-xs">{booking.scheduled_date}</Text>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-primary/10">
                    <Text className="text-primary text-[10px] font-semibold">{booking.scheduled_time}</Text>
                </View>
            </View>

            <Text className="text-text-strong font-semibold text-sm" numberOfLines={2}>
                {booking.subject}
            </Text>

            <View className="flex-row items-center gap-2">
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    {
                        booking.live_session?.teacher?.user?.avatar_url ? (
                            <Image source={{ uri: booking.live_session?.teacher?.user?.avatar_url }} className="w-full h-full rounded-full" />
                        ) : (
                            <Text className="text-white text-[10px] font-bold">
                                {booking.live_session?.teacher?.user?.name?.charAt(0).toUpperCase()}
                            </Text>
                        )
                    }
                </View>
                <Text className="text-text-weak text-xs" numberOfLines={1}>
                    {booking.live_session?.teacher?.user?.name}
                </Text>
            </View>

            <View className="flex-row items-center gap-1">
                <Text className="text-text-strong font-bold text-sm">${booking.price}</Text>
            </View>
        </View>
    );
}
