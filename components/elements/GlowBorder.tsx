import { Pad } from "./Components"
import { styles } from "../styles/computed/styles"
import { View } from "react-native"

export const GlowerBorder:React.FC = () => {
 return (
 <Pad direction="row" style={[styles.wFull,{height:'100%',position:'absolute',opacity:.7,borderRadius:500}]} align="center">
 <View style={[{width:'22%',height:'0%',borderTopLeftRadius:100,borderBottomLeftRadius:100,boxShadow:'0 0 70px 20px #00a6ffff'}]}></View>
 <View style={[{width:'22%',height:'0%',boxShadow:'0 0 70px 20px #ff0303ff'}]}></View>
 <View style={[{width:'22%',height:'0%',boxShadow:'0 0 70px 20px #ff6803ff'}]}></View>
 <View style={[{width:'22%',height:'0%',borderTopRightRadius:100,borderBottomRightRadius:100,boxShadow:'0 0 70px 20px #ba31ffff'}]}></View>
 </Pad>
 )
}