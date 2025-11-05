import { Image, ImageSourcePropType } from "react-native"
import { styles } from "../styles/computed/styles"

interface LayerFillProps {
  fill: ImageSourcePropType;
  opacity?: number;
  radius?: number;
  style?: any;
}

export const LayerFill: React.FC<LayerFillProps> = ({ fill, radius, style, opacity }) => {
 return (
 <Image source={fill} resizeMode="cover" style={[styles.sizeFull,style,{borderRadius:radius,opacity:opacity}]}/>
 )
 }