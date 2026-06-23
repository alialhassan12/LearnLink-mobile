import useBookingStore from "@/src/store/booking";
import { Booking } from "@/src/@types/booking";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import MessageButton from "../MessageButton";
import { user } from "@/src/@types/user";

export default function BookingCard({ booking }: { booking: Booking }) {
    const {
        isRejectingBooking,
        rejectBooking,
        isApprovingBooking,
        approveBooking
    } = useBookingStore();

    const getStatusColors = (status: string) => {
        switch (status) {
            case 'approved':
                return {
                    bg: 'bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/20',
                    text: 'text-emerald-600 dark:text-emerald-400',
                    border: 'border-l-emerald-500'
                };
            case 'rejected':
                return {
                    bg: 'bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/20',
                    text: 'text-rose-600 dark:text-rose-400',
                    border: 'border-l-rose-500'
                };
            default:
                return {
                    bg: 'bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/20',
                    text: 'text-amber-600 dark:text-amber-400',
                    border: 'border-l-amber-500'
                };
        }
    };

    const statusColors = getStatusColors(booking?.status || 'pending');

    return (
        <View 
            className={`flex flex-col bg-bg-2 border border-border/80 rounded-2xl w-full p-4 mb-1 border-l-4 ${statusColors.border}`}
        >
            {/* Header info row */}
            <View className="flex-row items-center justify-between w-full">
                <View className="flex-row items-center gap-3 flex-1">
                    {/* avatar */}
                    <View className="w-12 h-12 rounded-full overflow-hidden border border-border">
                        {booking?.student?.user?.avatar_url ? (
                            <Image
                                source={{ uri: booking?.student?.user?.avatar_url }}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <View className="w-full h-full flex-row justify-center items-center bg-bg-1 rounded-full">
                                <Text className="font-semibold text-text-weak text-lg">
                                    {booking?.student?.user?.name?.[0]?.toUpperCase() || '?'}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Name & Subject */}
                    <View className="flex-1 justify-center">
                        <Text className="text-text-strong font-bold text-base leading-5">
                            {booking?.student?.user?.name}
                        </Text>
                        <View className="flex-row mt-1">
                            <View className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 dark:bg-primary/20">
                                <Text className="text-xs font-semibold text-primary">
                                    {booking?.subject}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Price and Status Badge */}
                <View className="items-end ml-2">
                    <Text className="text-lg font-extrabold text-text-strong">${booking?.price}</Text>
                    <View className={`px-2.5 py-1 rounded-full border mt-1.5 ${statusColors.bg}`}>
                        <Text className={`text-xs font-bold capitalize text-center ${statusColors.text}`}>
                            {booking?.status}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Separator line */}
            <View className="h-[1px] bg-border/60 my-3" />

            {/* Date and Time Info */}
            <View className="flex-row items-center gap-2">
                <View className="flex-row items-center px-3 py-1.5 gap-1.5 bg-bg-1 border border-border/50 rounded-xl">
                    <FontAwesome5 name="calendar" size={12} color="#94a3b8" />
                    <Text className="font-medium text-text-weak text-xs">
                        {booking?.scheduled_day} | {booking?.scheduled_date}
                    </Text>
                </View>
                <View className="flex-row items-center px-3 py-1.5 gap-1.5 bg-bg-1 border border-border/50 rounded-xl">
                    <FontAwesome5 name="clock" size={12} color="#94a3b8" />
                    <Text className="font-medium text-text-weak text-xs">
                        {booking?.scheduled_time}
                    </Text>
                </View>
            </View>

            {/* Student Note */}
            {booking?.student_note ? (
                <View className="flex flex-col bg-bg-1 border border-border/50 rounded-xl p-3 mt-3">
                    <Text className="font-semibold text-[10px] text-text-weak uppercase tracking-wider mb-1">
                        Note from Student
                    </Text>
                    <Text className="font-medium text-sm text-text-strong italic">
                        "{booking?.student_note}"
                    </Text>
                </View>
            ) : null}

            {/* Action Buttons / Contact */}
            <View className="flex flex-col w-full mt-1">
                {booking?.status === "pending" && (
                    <View className="flex-row gap-3 items-center mt-3">
                        <Pressable
                            onPress={() => approveBooking(booking?.id!)}
                            disabled={isApprovingBooking || isRejectingBooking}
                            className="flex-1 h-11 flex-row items-center justify-center gap-2 rounded-xl bg-emerald-600 active:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
                        >
                            {isApprovingBooking ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <>
                                    <FontAwesome5 name="check" size={12} color="white" />
                                    <Text className="text-white font-bold text-sm">Approve</Text>
                                </>
                            )}
                        </Pressable>

                        <Pressable
                            onPress={() => rejectBooking(booking?.id!)}
                            disabled={isRejectingBooking || isApprovingBooking}
                            className="flex-1 h-11 flex-row items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 active:bg-rose-500/20 active:scale-[0.98] transition-all duration-200"
                        >
                            {isRejectingBooking ? (
                                <ActivityIndicator color="#f43f5e" size="small" />
                            ) : (
                                <>
                                    <FontAwesome5 name="times" size={12} color="#f43f5e" />
                                    <Text className="text-rose-500 font-bold text-sm">Reject</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                )}
                <MessageButton recieverUser={booking?.student?.user as user} />
            </View>
        </View>
    );
}