import Header from "@/src/components/student/Header";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "@/src/providers/ThemeProvider";

export default function StudentLayout(){
    const { isDark } = useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const inactiveColor = isDark ? "#94a3b8" : "#64748b";

    return(
        <>
            <Tabs screenOptions={({route})=>({
                tabBarIcon:({focused})=>{
                    let iconName;
                    if(route.name === "Home"){
                        iconName=focused ? "home" : "home-outline";
                    }else if(route.name === "(Teachers)"){
                        
                        iconName=focused ? "people" : "people-outline";
                    }else if(route.name === "(Courses)"){
                        iconName=focused ? "book" : "book-outline";
                    }else if(route.name === "(Library)"){
                        iconName=focused ? "library" : "library-outline";
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
                animation:"shift"
            })}>
                <Tabs.Screen name="Home"/>
                <Tabs.Screen name="(Teachers)" options={{title:"Teachers"}} />
                <Tabs.Screen name="(Courses)" options={{title:"Courses"}}/>
                <Tabs.Screen name="(Library)" options={{title:"Library"}}/>
            </Tabs>
        </>
    );
}