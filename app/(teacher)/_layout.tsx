import Header from "@/src/components/student/Header";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TeacherLayout(){
    const { isDark } = useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const inactiveColor = isDark ? "#94a3b8" : "#64748b";
    return (
        <Tabs
            screenOptions={({route})=>({
                tabBarIcon:({focused})=>{
                    let iconName;
                    if(route.name === "Home"){
                        iconName=focused?'home':'home-outline';
                    }else if(route.name === "Bookings"){
                        iconName=focused?'calendar':'calendar-outline';
                    }else if(route.name === "(Chat)"){
                        iconName=focused?'chatbubble':'chatbubble-outline';
                    }else if(route.name === "(Library)"){
                        iconName=focused?'library':'library-outline';
                    }else if(route.name === "(Profile)"){
                        iconName=focused?'person':'person-outline';
                    }
                    return <Ionicons name={iconName as any} size={20} color={focused ? primaryColor : inactiveColor} />;
                },
                tabBarActiveTintColor: primaryColor,
                tabBarInactiveTintColor: inactiveColor,
                tabBarStyle:{
                    position:'absolute',
                    bottom:20,
                    left:20,
                    right:20,
                    height:60,
                    borderRadius:30,
                    backgroundColor: isDark ? "#1e293b" : "#fff",
                    borderTopWidth: 0,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                },
                headerShown:true,
                header:()=><Header/>,
                animation:"shift",
                tabBarHideOnKeyboard:true,
            })}
        >
            <Tabs.Screen name="Home"/>
            <Tabs.Screen name="Bookings"/>
            <Tabs.Screen name="(Library)" options={{title:"Library"}}/>
            <Tabs.Screen name="(Chat)" options={{title:"Chat"}}/>
            <Tabs.Screen name="(Profile)" options={{title:"Profile"}}/>
        </Tabs>
    );
}