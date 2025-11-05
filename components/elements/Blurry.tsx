import { StyleSheet, View } from "react-native";
import BlurView from "../BluryEffect/BluryEffect";

interface BluryProps {
 radius?: number;
 bottomRadius?: number;
 intensity?: number;
 bottom?: number;
 top?: number;
 left?: number,
 height?: any;
 zindex?: any;
 scaleX?: any;
 scaleY?: any;
 parentRadius?: number;
 background?: any;
}

export const Blury: React.FC<BluryProps> = ({radius, intensity, left, bottom, bottomRadius, top, background='rgba(0, 0, 0, .1)', zindex, height='88%', parentRadius, scaleX = 1, scaleY = 1}) => {
 return (
 <View style={[ types.blury, { height: height, bottom:bottom, top:top, left:left, zIndex: zindex,
 borderRadius: parentRadius, transform: [{ scaleX },{ scaleY }] }]}>
 <BlurView borderRadius={radius} bottomRadius={bottomRadius} backgroundColor={background} blurRadius={intensity}/>
 </View>
 );
};

const types = StyleSheet.create({
 blury: {
 width: "100%",
 position: "absolute",
 left: 0,
 },
});