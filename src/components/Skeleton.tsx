import { Animated, View } from "react-native";

const Skeleton =  ({
    className,
    animatedStyle,
}: {
    className: string;
    animatedStyle: object;
}) => (
    <Animated.View className={`bg-bg-2 ${className}`} style={animatedStyle} />
);

export default Skeleton;