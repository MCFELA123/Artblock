import { Dimensions, TouchableOpacity, View } from "react-native"
import { styles } from "../styles/computed/styles"
import { Break, Pad } from "./Components"
import { IconArrowLeftV2, IconArrowRight, RefreshIcon } from "../icons/Icons"
import { useThemeContext } from "../styles/computed/themes"

export const PlayerIndicator = () => {
 const { width, height } = Dimensions.get('window')
 const { textColor } = useThemeContext()
 return (
 <Pad direction="row" style={[styles.center]} gap={3} px={width*.07}>
 <View style={[{width:'20%'}]}>
 <TouchableOpacity activeOpacity={.5} disabled={true} style={[styles.alignStart,styles.justify]}>
 <IconArrowRight strokeWidth={2} width={width*.075} height={width*.075} style={[styles.absolute,{transform:[{rotate:'180deg'}]}]} opacity={.2}/>
 </TouchableOpacity>
 </View>
 <Pad direction="row" style={[styles.align,styles.justify,{width:'60%'}]} gap={width*.01}>
 <View style={[styles.paginationBullets,styles.activePaginationBullets,{backgroundColor:textColor}]}></View>
 <View style={[styles.paginationBullets]}></View>
 <View style={[styles.paginationBullets]}></View>
 <View style={[styles.paginationBullets]}></View>
 </Pad>
 <Pad direction="row" justify="flex-end" style={[{width:'20%'}]}>
 <TouchableOpacity activeOpacity={.5}><RefreshIcon fill={'red'} width={width*.05} height={width*.05} opacity={1}/></TouchableOpacity>
 <Break px={width*.01}/>
 </Pad>
 </Pad>
 )
}