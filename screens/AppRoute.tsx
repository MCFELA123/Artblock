import React, {} from "react"
import { View } from "react-native"
import { Bottombar, BottomDrawer, Headbar, ModalDrawer, SideDrawer } from "../components/elements/Components"
import Animated from "react-native-reanimated"
import { styles } from "../components/styles/computed/styles";
import { useAppContext } from "../context/AppContext";
import { Home } from "./Home";
import { WelcomeScreen } from "./WelcomScreen";

interface LibraryProps {
 label?: string;
}

export const AppRoute:React.FC<LibraryProps> = ({label}) => {
 const {
 scrollViewContent,
 appRouteOpacity,
 appRouteTranslateX,
 modalDrawerChild,
 sideDrawerChild,
 bottomDrawerChild
 } = useAppContext()
 
 const appRouteStyle = [{
 transform: [{translateX:appRouteTranslateX}],
 opacity: appRouteOpacity,
 }]

 return (
 <View style={[styles.sizeFull]}>
 <Animated.View style={[styles.layoutScroll, appRouteStyle]}>
 {scrollViewContent}
 </Animated.View>
 <SideDrawer children={sideDrawerChild}/>
 <ModalDrawer children={modalDrawerChild}/>
 <BottomDrawer children={bottomDrawerChild}/>
 </View>
 )
}
