import { Dimensions, View } from "react-native"
import { styles } from "../styles/computed/styles"
import { useThemeContext } from "../styles/computed/themes"
import { Pad } from "./Components"
import { LayerFill } from "./LayerShadow"
import { Blury } from "./Blurry"

export const BluredSquiggle = () => {
 const { textColor } = useThemeContext();
 const { width } = Dimensions.get('window')
 return (
 <View style={styles.sizeFull}>
 <LayerFill fill={require('../../assets/images/squiggle.png')} opacity={.7}/>
 <Blury intensity={60} height={'100%'} background={'#08173f20'}/>
 </View>
 )
}