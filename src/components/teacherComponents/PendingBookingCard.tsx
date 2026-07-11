import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import type { Booking } from "@/src/@types/booking";
import useBookingStore from "@/src/store/booking";

interface PendingBookingCardProps {
    booking: Booking;
}

export default function PendingBookingCard({ booking }: PendingBookingCardProps) {
    const { approveBooking, rejectBooking, isApprovingBooking, isRejectingBooking } =
        useBookingStore();

    const isProcessing = isApprovingBooking || isRejectingBooking;

    return (
        <View className="bg-bg-2 border border-border rounded-2xl p-4 gap-3">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                        <Text className="text-white text-xs font-bold">
                            {booking.student?.user?.name?.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View>
                        <Text className="text-text-strong font-semibold text-sm">
                            {booking.student?.user?.name}
                        </Text>
                        <Text className="text-text-weak text-xs">{booking.subject}</Text>
                    </View>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-yellow-500/10">
                    <Text className="text-yellow-500 text-[10px] font-semibold">Pending</Text>
                </View>
            </View>

            <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                    <Ionicons name="calendar-outline" size={12} color="#64748b" />
                    <Text className="text-text-weak text-xs">{booking.scheduled_date}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Ionicons name="time-outline" size={12} color="#64748b" />
                    <Text className="text-text-weak text-xs">{booking.scheduled_time}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="text-text-strong font-bold text-xs">${booking.price}</Text>
                </View>
            </View>

            <View className="flex-row gap-2">
                <Pressable
                    onPress={() => rejectBooking(booking.id!)}
                    disabled={isProcessing}
                    className="flex-1 h-9 bg-red-500/10 rounded-xl items-center justify-center active:scale-95 transition-all duration-200"
                >
                    {isRejectingBooking ? (
                        <ActivityIndicator size="small" color="#ef4444" />
                    ) : (
                        <Text className="text-red-500 font-semibold text-xs">Reject</Text>
                    )}
                </Pressable>
                <Pressable
                    onPress={() => approveBooking(booking.id!)}
                    disabled={isProcessing}
                    className="flex-1 h-9 bg-green-500/10 rounded-xl items-center justify-center active:scale-95 transition-all duration-200"
                >
                    {isApprovingBooking ? (
                        <ActivityIndicator size="small" color="#22c55e" />
                    ) : (
                        <Text className="text-green-500 font-semibold text-xs">Approve</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}
