import { useTheme } from '@/src/providers/ThemeProvider';
import { BlurView } from 'expo-blur';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
    primary: '#6C5CE7',
    border: '#2A2A2E',
    textWeak: '#8A8A8E',
    white: '#FFFFFF',
    cardBg: 'rgba(20, 20, 24, 0.5)',
};

interface CreateCourseProgressBarProps {
    stepProgress: number; 
}

interface StepConfig {
    number: number;
    label: string;
    threshold: number;
}

const steps: StepConfig[] = [
    { number: 1, label: 'Basic Info', threshold: 10 },
    { number: 2, label: 'Course Content', threshold: 50 },
    { number: 3, label: 'Publish Course', threshold: 100 },
];

export default function CreateCourseProgressBar({ stepProgress }: CreateCourseProgressBarProps) {
    const {isDark}=useTheme();
    const styles = StyleSheet.create({
        container: {
            marginTop: 16,
            marginHorizontal: 'auto',
            width: '100%',
            borderRadius: 12,
            // backgroundColor:"#FFFFFF44",
            padding: 16,
            overflow:"hidden",
            // zIndex only matters if you're layering; RN has no native "sticky"
            zIndex: 10,
        },
    });

    return (
        <BlurView intensity={40} tint="regular" style={styles.container} >
            <View className='flex-row items-center'>
                {steps.map((step, index) => {
                    const isActive = stepProgress >= step.threshold;
                    const nextStep = steps[index + 1];
                    const isLineActive = nextStep ? stepProgress >= nextStep.threshold : false;

                    return (
                        <React.Fragment key={step.number}>
                            <View className='items-center'>
                                <View
                                    className={`w-10 h-10 rounded-full justify-center items-center p-2 ${isActive ? 'bg-primary': 'bg-bg-2'}`}
                                >
                                    <Text
                                        className={`text-base font-bold transition-colors duration-500 ease-linear ${isActive ? 'text-white' : 'text-text-weak'}`}
                                    >
                                        {step.number}
                                    </Text>
                                </View>
                                <Text
                                    className={`font-bold text-xs mt-2 transition-colors duration-500 ease-linear ${isActive ? 'text-primary' : 'text-text-weak'}`}
                                >
                                    {step.label}
                                </Text>
                            </View>

                            {index < steps.length - 1 && (
                                <View
                                    className={`h-1.5 mb-6 rounded-full w-full transition-colors duration-100 ease-linear ${isLineActive ? "flex-1 bg-primary" : "flex-1 bg-bg-2"}`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </View>
        </BlurView>
    );
    
}
