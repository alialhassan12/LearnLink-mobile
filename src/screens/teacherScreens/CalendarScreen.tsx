import { useCalendarStore } from "@/src/store/calendarStore";
import { useEffect, useState, useRef } from "react";
import { 
    Text, 
    View, 
    ScrollView, 
    Pressable, 
    Image, 
    Modal, 
    Animated, 
    TouchableOpacity 
} from "react-native";
import { Calendar, ICalendarEventBase } from "react-native-big-calendar";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/providers/ThemeProvider";
import dayjs from "dayjs";
import Skeleton from "@/src/components/Skeleton";
import MessageButton from "@/src/components/MessageButton";
import type { Booking } from "@/src/@types/booking";

export default function CalendarScreen() {
    const { getTeacherEvents, isGettingTeacherEvents, teacherEvents } = useCalendarStore();
    const { isDark } = useTheme();

    const [mode, setMode] = useState<"month" | "week" | "day" | "schedule">("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        getTeacherEvents();
    }, [getTeacherEvents]);

    // Theme color helpers for icons/modals
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const strongTextVal = isDark ? "#f8fafc" : "#0f172a";
    const weakTextVal = isDark ? "#94a3b8" : "#64748b";
    const borderVal = isDark ? "#334155" : "#e2e8f0";

    // Format events for react-native-big-calendar
    const events = teacherEvents.map((event) => {
        const start = new Date(`${event.scheduled_date}T${event.scheduled_time}`);
        // Default to a 1 hour duration so it renders nicely in week/day views
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        return {
            start,
            end,
            title: event.subject,
            booking: event,
        };
    });

    // Upcoming sessions (today and future) sorted chronologically
    const upcomingEvents = teacherEvents
        .filter((event) => {
            const eventDate = new Date(`${event.scheduled_date}T${event.scheduled_time}`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today;
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`).getTime();
            const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`).getTime();
            return dateA - dateB;
        })
        .slice(0, 5);

    // Calculate Stats
    const totalBookings = teacherEvents.length;
    const approvedBookingsCount = teacherEvents.filter(e => e.status === "approved").length;
    const pendingBookingsCount = teacherEvents.filter(e => e.status === "pending" || !e.status).length;
    const estimatedRevenue = teacherEvents
        .filter(e => e.status === "approved")
        .reduce((sum, curr) => sum + (Number(curr.price) || 0), 0);

    const handlePrev = () => {
        if (mode === "month") {
            setCurrentDate(dayjs(currentDate).subtract(1, "month").toDate());
        } else if (mode === "week") {
            setCurrentDate(dayjs(currentDate).subtract(1, "week").toDate());
        } else if (mode === "day") {
            setCurrentDate(dayjs(currentDate).subtract(1, "day").toDate());
        } else {
            setCurrentDate(dayjs(currentDate).subtract(1, "month").toDate());
        }
    };

    const handleNext = () => {
        if (mode === "month") {
            setCurrentDate(dayjs(currentDate).add(1, "month").toDate());
        } else if (mode === "week") {
            setCurrentDate(dayjs(currentDate).add(1, "week").toDate());
        } else if (mode === "day") {
            setCurrentDate(dayjs(currentDate).add(1, "day").toDate());
        } else {
            setCurrentDate(dayjs(currentDate).add(1, "month").toDate());
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleSwipeEnd = (date: Date) => {
        setCurrentDate(date);
    };

    // Calendar theme overrides to match app colors
    const calendarTheme = {
        palette: {
            primary: {
                main: primaryColor,
                contrastText: "#ffffff",
            },
            nowIndicator: primaryColor,
            gray: {
                "100": isDark ? "#1e293b" : "#f8fafc",
                "200": borderVal,
                "300": isDark ? "#475569" : "#cbd5e1",
                "500": weakTextVal,
                "800": strongTextVal,
            },
        },
        typography: {
            fontFamily: "System",
            xs: { fontSize: 10, color: weakTextVal },
            sm: { fontSize: 11, color: strongTextVal },
            xl: { fontSize: 14, fontWeight: "bold" as const, color: strongTextVal },
        }
    };

    // Custom event renderer matching web calendar event styling
    const renderEvent = (event: any, touchableOpacityProps: any) => {
        const booking = event.booking;
        const status = booking?.status || "pending";

        let bgClass = "bg-amber-500/10";
        let textClass = isDark ? "text-amber-400" : "text-amber-700";
        let borderClass = "border-l-[3px] border-amber-500";

        if (status === "approved") {
            bgClass = "bg-emerald-500/10";
            textClass = isDark ? "text-emerald-400" : "text-emerald-700";
            borderClass = "border-l-[3px] border-emerald-500";
        } else if (status === "rejected") {
            bgClass = "bg-rose-500/10";
            textClass = isDark ? "text-rose-400" : "text-rose-700";
            borderClass = "border-l-[3px] border-rose-500";
        }

        return (
            <Pressable
                key={touchableOpacityProps.key}
                style={touchableOpacityProps.style}
                onPress={touchableOpacityProps.onPress}
                disabled={touchableOpacityProps.disabled}
                className={`rounded-lg p-2 flex flex-col justify-start overflow-hidden ${bgClass} ${borderClass}`}
            >
                <Text className={`font-bold text-[10px] truncate ${textClass}`}>
                    {event.title}
                </Text>
                {mode !== "month" && (
                    <Text className={`text-[9px] opacity-80 mt-0.5 ${textClass}`}>
                        {dayjs(event.start).format("h:mm A")}
                    </Text>
                )}
            </Pressable>
        );
    };

    if (isGettingTeacherEvents) {
        return <CalendarScreenSkeleton />;
    }

    const modes: Array<{ value: typeof mode; label: string }> = [
        { value: "month", label: "Month" },
        { value: "week", label: "Week" },
        { value: "day", label: "Day" },
        // { value: "schedule", label: "Schedule" },
    ];

    return (
        <View className="flex-1 bg-bg-1">
            <ScrollView
                className="px-4 w-full"
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 16, gap: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header section */}
                <View className="flex flex-col gap-1 pb-4 border-b border-border">
                    <Text className="text-xs text-primary font-bold tracking-wider uppercase">Schedule Planner</Text>
                    <Text className="text-2xl font-black text-text-strong tracking-tight">Schedule Calendar</Text>
                    <Text className="text-xs text-text-weak leading-relaxed">
                        Manage and view your upcoming teaching slots, classes, and student bookings.
                    </Text>
                </View>

                {/* View Segments */}
                <View className="flex-row bg-bg-2 border border-border p-1 rounded-2xl">
                    {modes.map((m) => (
                        <Pressable
                            key={m.value}
                            onPress={() => setMode(m.value)}
                            className={`flex-1 py-2 items-center justify-center rounded-xl active:scale-[0.98] ${
                                mode === m.value ? "bg-primary" : ""
                            }`}
                        >
                            <Text className={`font-bold text-xs ${
                                mode === m.value ? "text-white" : "text-text-strong"
                            }`}>
                                {m.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Date Controls */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                        <Pressable 
                            onPress={handlePrev} 
                            className="p-2 border border-border bg-bg-2 rounded-xl active:scale-95 transition-all"
                        >
                            <Ionicons name="chevron-back" size={18} color={strongTextVal} />
                        </Pressable>
                        <Pressable 
                            onPress={handleToday} 
                            className="px-4 py-2 border border-border bg-bg-2 rounded-xl active:scale-95 transition-all"
                        >
                            <Text className="text-text-strong font-bold text-xs">Today</Text>
                        </Pressable>
                        <Pressable 
                            onPress={handleNext} 
                            className="p-2 border border-border bg-bg-2 rounded-xl active:scale-95 transition-all"
                        >
                            <Ionicons name="chevron-forward" size={18} color={strongTextVal} />
                        </Pressable>
                    </View>
                    <Text className="text-text-strong font-extrabold text-sm mr-1">
                        {dayjs(currentDate).format(mode === "day" ? "MMMM DD, YYYY" : "MMMM YYYY")}
                    </Text>
                </View>

                {/* Calendar Card Container */}
                <View className="bg-bg-2 border border-border rounded-3xl p-3 shadow-sm" style={{ height: 460 }}>
                    <Calendar
                        events={events as any}
                        height={420}
                        mode={mode}
                        date={currentDate}
                        onSwipeEnd={handleSwipeEnd}
                        onPressEvent={(event: any) => {
                            setSelectedBooking(event.booking);
                            setIsDetailsOpen(true);
                        }}
                        theme={calendarTheme}
                        renderEvent={renderEvent}
                        swipeEnabled={true}
                    />
                </View>

                {/* Quick Stats Panel */}
                <View className="flex-row flex-wrap -mx-2">
                    {/* Total Bookings */}
                    <View className="w-1/2 p-2">
                        <View className="flex-row items-center gap-3 bg-bg-2 border border-border rounded-2xl p-4 shadow-xs">
                            <View className="p-2 bg-primary/10 rounded-xl">
                                <Ionicons name="calendar" size={18} color={primaryColor} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-text-weak text-[10px] font-bold uppercase tracking-wider">Total</Text>
                                <Text className="text-text-strong font-black text-lg mt-0.5">{totalBookings}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Approved Bookings */}
                    <View className="w-1/2 p-2">
                        <View className="flex-row items-center gap-3 bg-bg-2 border border-border rounded-2xl p-4 shadow-xs">
                            <View className="p-2 bg-emerald-500/10 rounded-xl">
                                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-text-weak text-[10px] font-bold uppercase tracking-wider">Approved</Text>
                                <Text className="text-emerald-500 dark:text-emerald-400 font-black text-lg mt-0.5">
                                    {approvedBookingsCount}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Pending Bookings */}
                    <View className="w-1/2 p-2">
                        <View className="flex-row items-center gap-3 bg-bg-2 border border-border rounded-2xl p-4 shadow-xs">
                            <View className="p-2 bg-amber-500/10 rounded-xl">
                                <Ionicons name="alert-circle" size={18} color="#f59e0b" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-text-weak text-[10px] font-bold uppercase tracking-wider">Pending</Text>
                                <Text className="text-amber-500 dark:text-amber-400 font-black text-lg mt-0.5">
                                    {pendingBookingsCount}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Estimated Revenue */}
                    <View className="w-1/2 p-2">
                        <View className="flex-row items-center gap-3 bg-bg-2 border border-border rounded-2xl p-4 shadow-xs">
                            <View className="p-2 bg-primary/10 rounded-xl">
                                <FontAwesome5 name="dollar-sign" size={16} color={primaryColor} />
                            </View>
                            <View className="">
                                <Text className="text-text-weak text-[10px] font-bold uppercase tracking-wider">Earnings</Text>
                                <Text className="text-primary font-black text-lg mt-0.5">${estimatedRevenue}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Upcoming Sessions List */}
                <View className="bg-bg-2 border border-border rounded-3xl p-5 shadow-xs">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-extrabold text-text-strong text-base">Upcoming Sessions</Text>
                        <View className="px-2 py-0.5 bg-primary/10 rounded-full">
                            <Text className="text-primary text-[9px] font-bold uppercase">Next 5</Text>
                        </View>
                    </View>

                    <View className="gap-3">
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map((event) => {
                                const status = event.status || "pending";
                                return (
                                    <Pressable
                                        key={event.id}
                                        onPress={() => {
                                            setSelectedBooking(event);
                                            setIsDetailsOpen(true);
                                        }}
                                        className="flex-row items-start gap-3 p-3 bg-bg-1 border border-border rounded-2xl active:opacity-85 transition-opacity duration-200"
                                    >
                                        {event.student?.user?.avatar_url ? (
                                            <Image
                                                source={{ uri: event.student.user.avatar_url }}
                                                className="h-10 w-10 rounded-full border border-primary/10"
                                            />
                                        ) : (
                                            <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center border border-primary/10">
                                                <Text className="text-primary font-bold text-sm">
                                                    {event.student?.user?.name ? event.student.user.name[0].toUpperCase() : "?"}
                                                </Text>
                                            </View>
                                        )}

                                        <View className="flex-1">
                                            <View className="flex-row justify-between items-start">
                                                <Text className="font-bold text-xs text-text-strong truncate flex-1 mr-1">
                                                    {event.student?.user?.name || "Student"}
                                                </Text>
                                                <View className={`px-2 py-0.5 rounded-full ${
                                                    status === "approved" ? "bg-emerald-100 dark:bg-emerald-950/40" :
                                                    status === "rejected" ? "bg-rose-100 dark:bg-rose-950/40" :
                                                    "bg-amber-100 dark:bg-amber-950/40"
                                                }`}>
                                                    <Text className={`text-[8px] uppercase font-extrabold ${
                                                        status === "approved" ? "text-emerald-700 dark:text-emerald-400" :
                                                        status === "rejected" ? "text-rose-700 dark:text-rose-400" :
                                                        "text-amber-700 dark:text-amber-400"
                                                    }`}>
                                                        {status}
                                                    </Text>
                                                </View>
                                            </View>

                                            <Text className="text-[11px] font-semibold text-text-strong mt-0.5 truncate">
                                                {event.subject}
                                            </Text>

                                            <View className="flex-row items-center gap-1 mt-1">
                                                <Ionicons name="calendar-outline" size={11} color={weakTextVal} />
                                                <Text className="text-[9px] text-text-weak font-medium">
                                                    {event.scheduled_date} | {event.scheduled_time}
                                                </Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                );
                            })
                        ) : (
                            <View className="py-8 border border-dashed border-border rounded-2xl items-center justify-center">
                                <Text className="text-text-weak text-xs font-semibold">No upcoming sessions</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Session Details Modal Overlay */}
            <Modal
                visible={isDetailsOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsDetailsOpen(false)}
            >
                <View className="flex-1 bg-black/60 justify-end">
                    <Pressable className="flex-1" onPress={() => setIsDetailsOpen(false)} />
                    
                    <View className="bg-bg-2 rounded-t-[32px] p-6 border-t border-border max-h-[80%]">
                        <View className="w-12 h-1 bg-border rounded-full align-center self-center mb-6" />

                        <View className="flex-row justify-between items-center border-b border-border pb-4 mb-4">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="calendar" size={20} color={primaryColor} />
                                <Text className="text-lg font-extrabold text-text-strong">Session Details</Text>
                            </View>
                            <Pressable 
                                onPress={() => setIsDetailsOpen(false)} 
                                className="p-1.5 bg-bg-1 rounded-full border border-border active:opacity-75"
                            >
                                <Ionicons name="close" size={18} color={strongTextVal} />
                            </Pressable>
                        </View>

                        {selectedBooking && (
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingBottom: 24 }}>
                                {/* Subject and Price */}
                                <View className="flex-row justify-between items-start border-b border-border pb-4">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-[10px] font-bold text-text-weak uppercase tracking-wider">Subject</Text>
                                        <Text className="text-base font-extrabold text-text-strong mt-1 break-words">
                                            {selectedBooking.subject}
                                        </Text>
                                    </View>
                                    <View className="items-end shrink-0">
                                        <Text className="text-[10px] font-bold text-text-weak uppercase tracking-wider">Session Price</Text>
                                        <Text className="text-lg font-black text-primary mt-1">${selectedBooking.price}</Text>
                                    </View>
                                </View>

                                {/* Date, Time & Status */}
                                <View className="border-b border-border pb-4">
                                    <View className="flex-row justify-between flex-wrap gap-y-4">
                                        <View className="w-1/2">
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="calendar-outline" size={12} color={primaryColor} />
                                                <Text className="text-[10px] font-bold text-text-weak uppercase tracking-wider">Date & Day</Text>
                                            </View>
                                            <Text className="font-bold text-text-strong text-xs mt-1">
                                                {selectedBooking.scheduled_date}
                                            </Text>
                                            <Text className="text-[10px] text-text-weak mt-0.5">
                                                {selectedBooking.scheduled_day}
                                            </Text>
                                        </View>
                                        <View className="w-1/2">
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="time-outline" size={12} color={primaryColor} />
                                                <Text className="text-[10px] font-bold text-text-weak uppercase tracking-wider">Start Time</Text>
                                            </View>
                                            <Text className="font-bold text-text-strong text-xs mt-1">
                                                {selectedBooking.scheduled_time}
                                            </Text>
                                        </View>
                                        <View className="w-full">
                                            <Text className="text-[10px] font-bold text-text-weak uppercase tracking-wider">Status</Text>
                                            <View className="mt-1.5 self-start">
                                                <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full border ${
                                                    selectedBooking.status === "approved" ? "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40" :
                                                    selectedBooking.status === "rejected" ? "bg-rose-100 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40" :
                                                    "bg-amber-100 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40"
                                                }`}>
                                                    {selectedBooking.status === "approved" && <Ionicons name="checkmark-circle" size={12} color="#10b981" />}
                                                    {selectedBooking.status === "rejected" && <Ionicons name="close-circle" size={12} color="#f43f5e" />}
                                                    {(selectedBooking.status === "pending" || !selectedBooking.status) && <Ionicons name="alert-circle" size={12} color="#f59e0b" />}
                                                    <Text className={`text-[10px] font-bold uppercase tracking-wider ${
                                                        selectedBooking.status === "approved" ? "text-emerald-700 dark:text-emerald-400" :
                                                        selectedBooking.status === "rejected" ? "text-rose-700 dark:text-rose-400" :
                                                        "text-amber-700 dark:text-amber-400"
                                                    }`}>
                                                        {selectedBooking.status || "pending"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Student Profile Card */}
                                <View className="border-b border-border pb-4 gap-2">
                                    <Text className="text-[10px] font-bold text-text-weak uppercase tracking-wider">Student Info</Text>
                                    {selectedBooking.student?.user ? (
                                        <View className="flex-row items-center gap-3 bg-bg-1 p-3 rounded-2xl border border-border">
                                            {selectedBooking.student.user.avatar_url ? (
                                                <Image
                                                    source={{ uri: selectedBooking.student.user.avatar_url }}
                                                    className="h-11 w-11 rounded-full border border-primary/10"
                                                />
                                            ) : (
                                                <View className="h-11 w-11 rounded-full bg-primary/10 items-center justify-center border border-primary/10">
                                                    <Text className="text-primary font-bold text-sm">
                                                        {selectedBooking.student.user.name[0].toUpperCase()}
                                                    </Text>
                                                </View>
                                            )}
                                            <View className="flex-1 min-w-0">
                                                <Text className="font-bold text-text-strong text-xs truncate">
                                                    {selectedBooking.student.user.name}
                                                </Text>
                                                <Text className="text-[10px] text-text-weak truncate mt-0.5">
                                                    {selectedBooking.student.user.email}
                                                </Text>
                                                {selectedBooking.student.headline && (
                                                    <Text className="text-[10px] text-primary font-semibold mt-0.5 truncate">
                                                        {selectedBooking.student.headline}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    ) : (
                                        <Text className="text-xs text-text-weak italic">No profile details available</Text>
                                    )}
                                </View>

                                {/* Student Notes */}
                                <View className="border-b border-border pb-4 gap-2">
                                    <Text className="text-[10px] font-bold text-text-weak uppercase tracking-wider">Student's Notes</Text>
                                    <View className="bg-bg-1 p-3.5 rounded-2xl border border-border">
                                        <Text className="text-xs text-text-strong italic leading-relaxed">
                                            {selectedBooking.student_note || "No note was attached to this booking."}
                                        </Text>
                                    </View>
                                </View>

                                {/* Message Button */}
                                {selectedBooking.student?.user && (
                                    <View className="mt-1">
                                        <MessageButton recieverUser={selectedBooking.student.user} />
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const CalendarScreenSkeleton = () => {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmer, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmer]);

    const animatedStyle = {
        opacity: shimmer.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 0.9],
        }),
    };

    return (
        <ScrollView
            className="flex-1 bg-bg-1 px-4 py-4"
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 16, gap: 16 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header skeleton */}
            <View className="flex flex-col gap-2 mt-4 pb-4 border-b border-border">
                <Skeleton className="h-4 w-28 rounded-md" animatedStyle={animatedStyle} />
                <Skeleton className="h-8 w-60 rounded-md" animatedStyle={animatedStyle} />
                <Skeleton className="h-4 w-11/12 rounded-md" animatedStyle={animatedStyle} />
            </View>

            {/* View segments & controls skeleton */}
            <Skeleton className="h-10 w-full rounded-2xl mb-2" animatedStyle={animatedStyle} />
            
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row gap-2">
                    <Skeleton className="h-9 w-9 rounded-xl" animatedStyle={animatedStyle} />
                    <Skeleton className="h-9 w-14 rounded-xl" animatedStyle={animatedStyle} />
                    <Skeleton className="h-9 w-9 rounded-xl" animatedStyle={animatedStyle} />
                </View>
                <Skeleton className="h-6 w-32 rounded-md" animatedStyle={animatedStyle} />
            </View>

            {/* Calendar Box skeleton */}
            <Skeleton className="h-[360px] w-full rounded-3xl mb-4" animatedStyle={animatedStyle} />

            {/* Stats grid skeleton */}
            <View className="flex-row flex-wrap -mx-2 mb-4">
                {[1, 2, 3, 4].map((i) => (
                    <View key={i} className="w-1/2 p-2">
                        <View className="flex-row items-center gap-3 bg-bg-2 border border-border rounded-2xl p-4">
                            <Skeleton className="w-8 h-8 rounded-xl" animatedStyle={animatedStyle} />
                            <View className="flex-1 gap-1.5">
                                <Skeleton className="h-3 w-12 rounded" animatedStyle={animatedStyle} />
                                <Skeleton className="h-5 w-8 rounded" animatedStyle={animatedStyle} />
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Upcoming sessions skeleton */}
            <View className="bg-bg-2 border border-border rounded-3xl p-5 shadow-xs">
                <Skeleton className="h-5 w-40 rounded mb-4" animatedStyle={animatedStyle} />
                <View className="gap-3">
                    {[1, 2, 3].map((i) => (
                        <View key={i} className="flex-row gap-3 p-3 bg-bg-1 border border-border rounded-2xl">
                            <Skeleton className="h-10 w-10 rounded-full" animatedStyle={animatedStyle} />
                            <View className="flex-1 gap-2">
                                <View className="flex-row justify-between">
                                    <Skeleton className="h-4 w-24 rounded" animatedStyle={animatedStyle} />
                                    <Skeleton className="h-3.5 w-14 rounded-full" animatedStyle={animatedStyle} />
                                </View>
                                <Skeleton className="h-3 w-32 rounded" animatedStyle={animatedStyle} />
                                <Skeleton className="h-3.5 w-24 rounded" animatedStyle={animatedStyle} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};