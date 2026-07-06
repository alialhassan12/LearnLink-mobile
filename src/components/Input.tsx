import { TextInput } from "react-native";

export default function Input({
    className,
    placeholder,
    placeholderTextColor,
    secureTextEntry,
    keyboardType,
    value,
    onChangeText,
    disabled,
    multiline,
    numberOfLines
}:{
    className?:string;
    placeholder?:string;
    placeholderTextColor?:string;
    secureTextEntry?:boolean;
    keyboardType?:string;
    value?:any;
    onChangeText?:(text:any)=>void;
    disabled?:boolean;
    multiline?:boolean;
    numberOfLines?:number;
}){
    return(
        <TextInput
            value={value}
            onChangeText={onChangeText}
            editable={!disabled}
            placeholderTextColor={placeholderTextColor} 
            className={`p-4 w-full bg-bg-2 border border-border text-text-strong ${className}`}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType as any}
            multiline={multiline}
            numberOfLines={numberOfLines}
        />
    );
}