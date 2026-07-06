import { useEffect, useState, useRef } from "react";
import { 
    View, 
    Text, 
    FlatList, 
    Pressable, 
    Image, 
    ActivityIndicator, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform 
} from "react-native";
import { MobileFile, useChatStore } from "../store/chatStore";
import useAuthStore from "../store/authStore";
import { useTheme } from "../providers/ThemeProvider";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import echo from "../lib/echo";
import type { Message } from "../@types/message";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import ChatAttachmentsSelect from "../components/ChatAttachmentsSelect";
import {File,Paths} from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function ChatScreen() {
    const { isDark } = useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const weakText = isDark ? "#94a3b8" : "#64748b";
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    
    const { authUser } = useAuthStore();
    const {
        activeConversation,
        setActiveConversation,
        messages,
        isGettingMessages,
        isSendingMessage,
        sendMessage
    } = useChatStore();

    const [messageInput, setMessageInput] = useState("");
    const [pendingMessageText, setPendingMessageText] = useState("");
    const [file,setFile]=useState<MobileFile|null>(null);
    const [pendingFile,setPendingFile]=useState<boolean>(false);
    const [showAttachments,setShowAttachments]=useState<boolean>(false);
    const [isDownloading,setIsDownloading]=useState<boolean>(false);
    const [selectedFileToDownload,setSelectedFileToDownload]=useState<number|null>(null);
    const flatListRef = useRef<FlatList>(null);

    // Get the other participant's details
    const getOtherParticipant = () => {
        if (!activeConversation) return null;
        if (activeConversation.type !== "direct") return null;
        return activeConversation.participants?.find((p) => p.user_id !== authUser?.id);
    };

    const otherParticipant = getOtherParticipant();
    const chatTitle = activeConversation?.type === "direct"
        ? otherParticipant?.user?.name || "Chat"
        : activeConversation?.group_name || "Group Chat";

    const chatRole = activeConversation?.type === "direct"
        ? (otherParticipant?.user?.role === "teacher" ? "Teacher" : "Student")
        : "Group";

    // Setup Laravel Echo / Reverb listeners for real-time messages
    useEffect(() => {
        if (!activeConversation) return;

        const channelName = `conversation.${activeConversation.id}`;
        
        console.log(`Subscribing to private channel: ${channelName}`);
        
        const channel = echo.private(channelName)
            .listen('.message.sent', (event: any) => {
                const incomingMessage = event.message;
                console.log("Real-time message received on mobile:", incomingMessage.content);
                
                // Append message locally if it doesn't exist
                useChatStore.setState((state) => {
                    const messageExists = state.messages.some(m => String(m.id) === String(incomingMessage.id));
                    if (messageExists) return state;
                    return { messages: [...state.messages, incomingMessage] };
                });
                
                // Update conversation sidebar lists
                useChatStore.setState((state) => {
                    const updatedConversations = state.conversations.map(conv => {
                        if (conv.id === incomingMessage.conversation_id) {
                            return { 
                                ...conv, 
                                last_message: incomingMessage, 
                                updated_at: new Date().toISOString() 
                            };
                        }
                        return conv;
                    });
                    
                    // Sort descending
                    updatedConversations.sort((a, b) => 
                        new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime()
                    );
                    
                    return { conversations: updatedConversations };
                });
            });

        return () => {
            console.log(`Unsubscribing from private channel: ${channelName}`);
            echo.leave(channelName);
        };
    }, [activeConversation]);

    // Handle auto scroll to the end
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 150);
        }
    }, [messages, isSendingMessage]);

    const handleBack = () => {
        setActiveConversation(null);
        router.back();
    };

    const handleSend = async () => {
        if (!messageInput.trim() && !file) return;

        const textToSend = messageInput;
        setPendingMessageText(textToSend);
        setMessageInput("");

        let type="text";
        if(file){
            type=file.type.startsWith("image")?"image":"file";
            setPendingFile(true);
        }


        const receiverId = otherParticipant?.user_id;
        setFile(null);

        if (receiverId) {
            await sendMessage(
                Number(receiverId),
                type,
                textToSend,
                file ?? undefined,
                file?.name ?? ""
            );
        }

        setPendingMessageText("");
    };

    const handleImagePicker=async()=>{
        const result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            quality:1
        });
        if(!result.canceled){
            const asset=result.assets[0];
            const file:MobileFile={
                uri:asset.uri || "",
                type:asset.mimeType || "application/octet-stream",
                name:asset.fileName || "file",
                size:asset.fileSize || 0
            };
            setFile(file);
        }
    }

    const handleDocumentPicker=async()=>{
        const result =await DocumentPicker.getDocumentAsync({
            type:'*/*',
            copyToCacheDirectory:true
        });
        if(result.canceled){
            return null;
        }
        const file=result.assets[0];
        const mobileFile:MobileFile={
            uri:file.uri,
            type:file.mimeType || "application/octet-stream",
            name:file.name || "file",
            size:file.size || 0
        };
        setFile(mobileFile);
    }

    const handleDocumentDownload = async (
            fileTitle: string,
            fileUrl:string
    ) => {
            setIsDownloading(true);
            try {
                const filename=new Date().toISOString() + "-" + fileTitle;
                
                const file = new File(Paths.document, filename);
                
                await File.downloadFileAsync(fileUrl, file);
                
                await Sharing.shareAsync(file.uri);
                
            } catch (error) {
                console.error("Error downloading file:", error);
            }finally{
                setIsDownloading(false);
            }
        };

    const renderMessageItem = ({ item }: { item: Message }) => {
        const isMyMessage = item.sender_id === authUser?.id;
        
        return (
            <View 
                className={`flex-row gap-2 max-w-[80%] mb-3 ${isMyMessage ? 'self-end' : 'self-start'}`}
            >
                {/* Fallback circle avatar for other user */}
                {!isMyMessage && (
                    <View className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center border border-primary/20 mt-auto shrink-0 overflow-hidden">
                        {item.sender?.avatar_url?(
                            <Image source={{uri:item.sender?.avatar_url}} className="h-full w-full rounded-full"/>
                        ):(
                            <Text className="text-primary font-bold text-xs">
                            {chatTitle?.charAt(0).toUpperCase()}
                        </Text>
                        )}
                    </View>
                )}

                <View className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    {/* Render attachment image */}
                    {item.file_url && item.type === "image" && (
                        <View className="w-48 h-48 rounded-xl overflow-hidden mb-1.5 border border-border bg-bg-2">
                            <Image 
                                source={{ uri: item.file_url }} 
                                className="w-full h-full object-cover" 
                            />
                        </View>
                    )}

                    {/* Render document attachment  */}
                    {item.file_url && item.type === "file" && (
                        <Pressable 
                            className="flex flex-row items-center gap-2 p-3 rounded-xl border border-border bg-bg-2 mb-1.5"
                            onPress={()=>{
                                setSelectedFileToDownload(item?.id);
                                handleDocumentDownload(item?.file_name || "file",item?.file_url || "");
                            }}
                            disabled={isDownloading && selectedFileToDownload === item?.id}
                        >
                            {isDownloading && selectedFileToDownload === item?.id ? (
                                <ActivityIndicator size="small" color={primaryColor} />
                            ):(
                                <Ionicons name="document-text-outline" size={20} color={primaryColor} />
                            )}
                            <Text className="text-xs text-text-strong font-semibold truncate max-w-[120px]">
                                {item?.file_name}
                            </Text>
                        </Pressable>
                    )}

                    {/* Message Bubble text content */}
                    {item.content && (
                        <View 
                            className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                                isMyMessage 
                                    ? 'bg-primary rounded-br-sm' 
                                    : 'bg-bg-2 border border-border rounded-bl-sm'
                            }`}
                        >
                            <Text 
                                className={`text-[13px] leading-relaxed ${
                                    isMyMessage ? 'text-white font-medium' : 'text-text-strong'
                                }`}
                                style={{ color: isMyMessage ? '#ffffff' : strongText }}
                            >
                                {item.content}
                            </Text>
                        </View>
                    )}

                    {/* Timestamp */}
                    <Text className="text-[9px] text-text-weak mt-1 px-1">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    if (!activeConversation) {
        return (
            <SafeAreaView className="flex-1 bg-bg-1 justify-center items-center">
                <Text className="text-text-strong text-lg font-bold" style={{ color: strongText }}>
                    No active chat selected
                </Text>
                <Pressable onPress={() => router.replace({
                        pathname:`${authUser?.role === "teacher" ? "/(teacher)/(Chat)" : "/(student)/(Chat)"}`
                    })} 
                    className="mt-4 bg-primary px-4 py-2 rounded-lg"
                >
                    <Text className="text-white font-semibold">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg-1" style={{ marginBottom: 80 }} edges={["bottom","left", "right"]}>
            {/* Header */}
            <View className="flex flex-row items-center px-3 py-3 border-b border-border bg-bg-1 h-14 shrink-0">
                <Pressable onPress={handleBack} className="p-1 mr-1 active:scale-95">
                    <Ionicons name="arrow-back" size={24} color={strongText} />
                </Pressable>

                {/* Info */}
                <View className="flex-row items-center gap-2 flex-1">
                    <View className="h-9 w-9 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
                        {otherParticipant?.user?.avatar_url?(
                            <Image source={{uri:otherParticipant?.user?.avatar_url}} className="h-full w-full rounded-full"></Image>
                        ):(
                            <Text className="text-primary font-bold text-sm">
                            {chatTitle?.charAt(0).toUpperCase()}
                        </Text>
                        )}
                    </View>
                    <View className="flex-1">
                        <Text className="font-bold text-sm text-text-strong truncate" style={{ color: strongText }}>
                            {chatTitle}
                        </Text>
                        <Text className="text-[10px] text-emerald-500 font-semibold uppercase">
                            {chatRole} • Online
                        </Text>
                    </View>
                </View>
            </View>

            {/* Main Chat Bubble List */}
            <KeyboardAvoidingView 
                className="flex-1"
                behavior={Platform.OS === "ios" ? "position" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                {isGettingMessages ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#2563eb" />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
                        renderItem={renderMessageItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 15, paddingBottom: 25 }}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center mt-32">
                                <View className="h-14 w-14 bg-bg-2 rounded-full items-center justify-center mb-3 border border-border">
                                    <Ionicons name="chatbubble-ellipses-outline" size={24} color={weakText} />
                                </View>
                                <Text className="text-text-strong font-bold text-sm mb-1" style={{ color: strongText }}>
                                    Say Hello!
                                </Text>
                                <Text className="text-text-weak text-xs text-center px-12">
                                    No previous messages. Start typing to begin this conversation.
                                </Text>
                            </View>
                        }
                        ListFooterComponent={
                            isSendingMessage && (pendingMessageText || pendingFile) ? (
                                <View className="gap-2 max-w-[80%] mb-3 self-end flex-row-reverse opacity-70">
                                    <View className="flex flex-col items-end">
                                        {pendingFile&&(
                                            <View className="flex-row items-center gap-2 p-4 border border-border rounded-xl bg-bg-2 ">
                                                <Ionicons name="file-tray-full" size={20} color={primaryColor} />
                                                <Text className="text-text-strong font-semibold text-sm">Uploading file...</Text>
                                            </View>
                                        )}
                                        {pendingMessageText&&(
                                            <View className="px-4 py-2.5 rounded-2xl shadow-sm bg-primary rounded-br-sm">
                                                <Text className="text-[13px] text-white leading-relaxed font-medium">
                                                    {pendingMessageText}
                                                </Text>
                                            </View>
                                        )}
                                        <View className="flex flex-row items-center gap-1 mt-1">
                                            <ActivityIndicator size="small" color={primaryColor} style={{ transform: [{ scale: 0.6 }] }} />
                                            <Text className="text-[8px] text-text-weak">Sending...</Text>
                                        </View>
                                    </View>
                                </View>
                            ) : null
                        }
                    />
                )}

                {/* Bottom Input Area */}
                <View className="flex-col ">
                    {/* File Preview */}
                    {file && (
                        <View className="px-3 py-2 border-t border-border bg-bg-1 flex flex-row items-center gap-2">
                            <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
                                <Ionicons name="file-tray-full" size={20} color={primaryColor} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-text-strong font-semibold text-sm">{file.name}</Text>
                                <Text className="text-text-weak text-xs">{Math.round(file.size / 1024)} KB</Text>
                            </View>
                            <Pressable onPress={() => setFile(null)} className="p-1">
                                <Ionicons name="close" size={20} color={weakText} />
                            </Pressable>
                        </View>
                    )}
                    <View className="p-3 border-t border-border bg-bg-1 flex flex-row items-center gap-2">
                        <TextInput
                            placeholder="Type a message..."
                            placeholderTextColor={weakText}
                            value={messageInput}
                            onChangeText={setMessageInput}
                            editable={!isSendingMessage}
                            style={{ color: strongText }}
                            className="flex-1 min-h-[40px] max-h-[100px] bg-bg-2 border border-border rounded-2xl px-4 py-2 text-[13px]"
                            multiline
                        />
                        <Pressable 
                            onPress={()=>setShowAttachments(true)}
                            className="h-10 w-10 rounded-full items-center justify-center bg-primary shadow active:scale-95 shrink-0"
                        >
                            <Ionicons name="attach" size={16} color={strongText} className="ml-0.5" />
                        </Pressable>
                        <Pressable 
                            onPress={handleSend}
                            disabled={(!messageInput.trim() && !file) || isSendingMessage}
                            style={{ backgroundColor: (!messageInput.trim() && !file) || isSendingMessage ? weakText : primaryColor }}
                            className="h-10 w-10 rounded-full items-center justify-center shadow active:scale-95 shrink-0"
                        >
                            <Ionicons name="send" size={16} color={strongText} className="ml-0.5" />
                        </Pressable>
                    </View>

                    {/* Attatchments Modal */}
                    <ChatAttachmentsSelect visible={showAttachments} onClose={()=>setShowAttachments(false)} onImageSelect={handleImagePicker} onDocumentSelect={handleDocumentPicker} />
                
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}