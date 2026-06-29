import { user } from "../@types/user";
import type { Conversation } from "../@types/conversation";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeProvider";
import useAuthStore from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { router } from "expo-router";

interface MessageButtonInterface{
    recieverUser:user;
}

export default function MessageButton({recieverUser}:MessageButtonInterface){
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";

    const {authUser}=useAuthStore();
    const {conversations,setActiveConversation,addConversation,getMessages,setMessages}=useChatStore();
    
    const handleSendMessage=():void=>{

        const conversation =conversations.find((c)=>c.participants?.some((p)=>p.user_id===recieverUser.id));

        if(conversation){
            setActiveConversation(conversation);
            getMessages(conversation.id);
            router.replace("/(Chat)/chat");
            return;
        }
        
        const newConversationId=-recieverUser?.id!;
        
        const newConversation:Conversation={
            id:newConversationId,
            type:"direct",
            participants:[
                {
                    id:0,
                    user_id:authUser?.id!,
                    user:{
                        id:authUser?.id!,
                        name:authUser?.name!,
                        email:authUser?.email!,
                        avatar_url:authUser?.avatar_url!,
                        role:authUser!.role as "teacher" | "student"
                    }
                },
                {
                    id:1,
                    user_id:recieverUser?.id!,
                    user:{
                        id:recieverUser.id,
                        name:recieverUser.name,
                        email:recieverUser.email,
                        avatar_url:recieverUser.avatar_url,
                        role:recieverUser.role as "teacher" | "student"
                    }
                }
            ]
        }
        setActiveConversation(newConversation);
        setMessages([]);
        addConversation(newConversation);
        router.replace("/(Chat)/chat");
    }

    return (
            <Pressable 
                className="flex flex-row justify-center items-center rounded-2xl mt-4 bg-bg-1  py-3 w-full border border-primary active:bg-primary active:border-none active:scale-95 transition-all duration-300 group"
                onPress={handleSendMessage}
                disabled={!authUser}
            >
                <Ionicons name="chatbubble" size={16} color={primaryColor} />
                <Text className="text-primary text-lg font-light ml-2 group-active:text-white group-active:font-bold">Send Message</Text>
            </Pressable>
    )
}