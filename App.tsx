import React, {} from 'react';
import { View, } from 'react-native';
import * as Font from 'expo-font';
import { AppContext, useAppContext } from './context/AppContext';
import { styles } from './components/styles/computed/styles';
import { ThemeContext, useThemeContext } from './components/styles/computed/themes';
import Animated from 'react-native-reanimated';
import { AppRoute } from './screens/AppRoute';
import { BottomBar } from './components/elements/BottomBar';
import { Pad } from './components/elements/Components';
import { BluredSquiggle } from './components/elements/Aesthetics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './context/AuthContext';

function AppMain() {
 const [fontsLoaded] = Font.useFonts({
 'Font-Regular': require('./components/fonts/SF-Pro-Rounded-Medium.otf'),
 'Font-Bold': require('./components/fonts/SF-Pro-Rounded-Bold.otf'),
 'Font-Heavy': require('./components/fonts/SF-Pro-Rounded-Heavy.otf'),
 'Font-Pixel': require('./components/fonts/RasterForgeRegular-JpBgm.ttf'),
 });

 const { parentBackground } = useThemeContext()
 
 if (!fontsLoaded) return null;
 return (
 <View style={[styles.parentLayout,{backgroundColor:parentBackground}]}>
 <Pad style={[styles.sizeFull]}><BluredSquiggle/></Pad>
 <Animated.View style={[styles.sizeFull]}>
 <AppRoute/>
 <Pad direction='column'>
 <BottomBar/>
 </Pad>
 </Animated.View>
 </View>
 );
}

export default function App() {
 (global as any).simulateTouch = () => {
 console.warn('simulateTouch not yet ready');
 }
 return (
//  <React.StrictMode>
 <AuthProvider>
 <GestureHandlerRootView>
 <AppContext>
 <ThemeContext>
 <AppMain/>
 </ThemeContext>
 </AppContext>
 </GestureHandlerRootView>
 </AuthProvider>
//  </React.StrictMode>
 );
}