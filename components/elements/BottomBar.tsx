import { Text, TouchableOpacity, View } from "react-native"
import { Pad } from "./Components"
import { TextBold } from "../fonts/TextBox"
import { styles } from "../styles/computed/styles"
import { HomeIcon, IconLibrary, IconMake, IconMenu, IconRadio, IconSearch } from "../icons/Icons"
import { useThemeContext } from "../styles/computed/themes"
import { Home } from "@/screens/Home"
import { useAppContext } from "@/context/AppContext"
import { Radio } from "@/screens/Radio"

export const BottomBar = () => {
 const { textColor } = useThemeContext();
 const activeColor = '#5F35EA';
 
 const bottomBarItems = []
 
 return ( 
 <Pad direction="column" px={20} align="center">
 
 </Pad>
 )
}