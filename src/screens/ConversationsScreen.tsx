import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Image, ActivityIndicator, TextInput } from "react-native";
import { useChatStore } from "../store/chatStore";
import useAuthStore from "../store/authStore";
import { useTheme } from "../providers/ThemeProvider";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Conversation } from "../@types/conversation";
import echo from "../lib/echo";

export default function ConversationsScreen() {
    const { isDark } = useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const weakText = isDark ? "#94a3b8" : "#64748b";
    
    const { authUser } = useAuthStore();
    const {
        conversations,
        isGettingConversations,
        getConversations,
        getConversationsWithNoLoading,
        addConversation,
        setActiveConversation,
        getMessages
    } = useChatStore();

    const [search, setSearch] = useState("");

    useEffect(() => {
        getConversations();
    }, []);

    useEffect(()=>{
        if (!authUser?.id) return;

        const channel = echo.private(`user.${authUser.id}`)
            .listen('.conversation.updated', (event: any) => {
                useChatStore.setState((state) => {
                    const existing = state.conversations.find(
                        (c: Conversation) => c.id === event.conversation_id
                    );

                    if (existing) {
                        // Update the existing conversation's last_message and timestamp
                        const updated = state.conversations.map((c: Conversation) =>
                            c.id === event.conversation_id
                                ? { ...c, last_message: event.last_message, updated_at: event.updated_at }
                                : c
                        );
                        updated.sort((a, b) =>
                            new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime()
                        );
                        return { conversations: updated };
                    } else {
                        // New conversation — fetch fresh list from API
                        getConversationsWithNoLoading();
                        return state;
                    }
                });
            });

        return () => {
            echo.leave(`user.${authUser.id}`);
        };
    }, [authUser?.id]);

    // Filter conversations based on participants' names matching the search query
    const filteredConversations = conversations.filter((conversation) => {
        return conversation.participants?.some((p) => 
            p.user_id !== authUser?.id && 
            p.user?.name.toLowerCase().includes(search.toLowerCase())
        );
    });

    const handleSelectConversation = async (conversation: Conversation) => {
        setActiveConversation(conversation);
        
        router.push({
            pathname: "/(student)/(Chat)/chat"
        });
        await getMessages(conversation.id);
    };

    // Helper to format the display of the last message
    const getLastMessageText = (conversation: Conversation) => {
        const lastMsg = conversation.last_message;
        if (!lastMsg) return "No messages yet";
        
        if (lastMsg.type === "image") {
            return "📷 Image file";
        }
        if (lastMsg.type === "file") {
            return "📄 Document file";
        }
        return lastMsg.content || "";
    };

    // Helper to extract conversation name & avatar
    const getConversationInfo = (conversation: Conversation) => {
        const isDirect = conversation.type === 'direct';
        const otherParticipant = isDirect 
            ? conversation.participants?.find((p) => p.user_id !== authUser?.id) 
            : null;
        
        const name = isDirect 
            ? otherParticipant?.user?.name || "User"
            : conversation.group_name || "Group Chat";

        const role = isDirect 
            ? (otherParticipant?.user?.role === 'teacher' ? 'Teacher' : 'Student')
            : 'Group';

        const avatarUrl = isDirect ? otherParticipant?.user?.avatar_url : null;
        
        return { name, role, avatarUrl };
    };

    const renderConversationItem = ({ item }: { item: Conversation }) => {
        const { name, role, avatarUrl } = getConversationInfo(item);
        
        return (
            <Pressable
                onPress={() => handleSelectConversation(item)}
                className="flex flex-row items-center gap-3 p-4 bg-bg-2 border border-border rounded-xl mb-3 active:scale-[0.98] active:opacity-90"
            >
                {/* Avatar with initials fallback */}
                {avatarUrl ? (
                    <View className="h-12 w-12 rounded-full overflow-hidden border border-border">
                        <Image 
                            source={{ uri: avatarUrl }} 
                            className="h-full w-full object-cover" 
                        />
                    </View>
                ) : (
                    <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
                        <Text className="text-primary font-bold text-lg">
                            {name?.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}

                {/* Details */}
                <View className="flex-1 flex flex-col">
                    <View className="flex flex-row justify-between items-center mb-1">
                        <Text className="text-text-strong font-bold text-sm" style={{ color: strongText }}>
                            {name}
                        </Text>
                        <Text className="text-[10px] text-text-weak">
                            {item.last_message ? new Date(item.last_message.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                        </Text>
                    </View>
                    
                    <View className="flex flex-row justify-between items-center">
                        <Text className="text-xs text-text-weak truncate max-w-[80%]" numberOfLines={1}>
                            {getLastMessageText(item)}
                        </Text>
                        <View className="bg-primary/5 px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] text-primary font-semibold uppercase">
                                {role}
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-1" edges={["left", "right"]}>
            <View className="px-4 py-3 flex-1">
                {/* Title */}
                <Text className="text-2xl font-bold text-text-strong mb-4" style={{ color: strongText }}>
                    Messages
                </Text>

                {/* Search Bar */}
                <View className="flex flex-row items-center bg-bg-2 border border-border rounded-xl px-3 mb-4 h-11">
                    <Ionicons name="search-outline" size={18} color={weakText} className="mr-2" />
                    <TextInput
                        placeholder="Search chats..."
                        placeholderTextColor={weakText}
                        value={search}
                        onChangeText={setSearch}
                        style={{ color: strongText }}
                        className="flex-1 text-sm h-full"
                    />
                </View>

                {/* Conversations List */}
                {isGettingConversations ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#2563eb" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredConversations}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderConversationItem}
                        onRefresh={()=>getConversations()}
                        refreshing={isGettingConversations}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center mt-20">
                                <View className="h-16 w-16 bg-bg-2 rounded-full items-center justify-center mb-4 border border-border">
                                    <Ionicons name="chatbubbles-outline" size={28} color={weakText} />
                                </View>
                                <Text className="text-text-strong font-bold text-base mb-1" style={{ color: strongText }}>
                                    No conversations
                                </Text>
                                <Text className="text-text-weak text-xs text-center px-6">
                                    Your active chats will appear here. Search to find details.
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}