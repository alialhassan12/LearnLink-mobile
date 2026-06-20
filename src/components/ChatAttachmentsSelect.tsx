import { Modal, View, Text, Pressable } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';


interface ChatAttachmentsSelectProps{
    visible:boolean;
    onClose:()=>void;
    onImageSelect:()=>void;
    onDocumentSelect:()=>void;
}

export default function ChatAttachmentsSelect({visible,onClose,onImageSelect,onDocumentSelect}:ChatAttachmentsSelectProps){
    return (
        <Modal
            visible={visible}
            transparent
            animationType='fade'
        >
            <View className='flex-1 justify-center items-center bg-black/50'>
                <View className='bg-bg-2 w-4/5 rounded-lg p-6 '>
                    <Text className='text-xl font-bold mb-4 text-text-strong'>Select Attachment</Text>
                    <Pressable 
                        className='flex-row items-center py-3 border-b border-border gap-2 active:scale-95 transition-all duration-200'
                        onPress={()=>{onImageSelect(); onClose();}}
                    >
                        <Ionicons name="image" size={24} color="#3b82f6" />
                        <Text className='ml-4 text-text-strong'>Image</Text>
                    </Pressable>

                    <Pressable 
                        className='flex-row items-center py-3 border-b border-border gap-2 active:scale-95 transition-all duration-200'
                        onPress={()=>{onDocumentSelect(); onClose();}}
                    >
                        <Ionicons name="document" size={24} color="#3b82f6" />
                        <Text className='ml-4 text-text-strong'>Document</Text>
                    </Pressable>

                    <Pressable
                        className='flex-row items-center py-3 gap-2 active:scale-95 transition-all duration-200'
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={24} color="#3b82f6" />
                        <Text className='ml-4 text-text-strong'>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}