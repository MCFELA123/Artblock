// ============================================
// 1. UPDATED AppContext.tsx
// ============================================
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { Dimensions, ActivityIndicator, View } from 'react-native';
import Animated, { Easing, SharedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { WelcomeScreen } from '../screens/WelcomScreen';
import { Home } from '../screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
 parentOpacity: number;
 isParentDisabled: boolean;
 scrollViewContent: React.ReactNode;
 modalDrawerChild: React.ReactNode;
 sideDrawerChild: React.ReactNode;
 bottomDrawerChild: React.ReactNode;
 appRouteTranslateX: SharedValue<number>;
 appRouteOpacity: SharedValue<number>;
 modalDrawerTranslateX: SharedValue<number>;
 sideDrawerTranslateX: SharedValue<number>;
 bottomDrawerTranslateY: SharedValue<number>;
 sideDrawerOpacity: SharedValue<number>;
 chatBoxTranslateY: SharedValue<number>;
 subTextInputOpacity: SharedValue<number>
 subTextInputTranslateY: SharedValue<number>;
 modalDrawerOpacity: SharedValue<number>;
 chatBoxHelperIndex: number;
 defTextInputOpacity: SharedValue<number>;
 defTextInputIndex: number;
 subTextInputPointerEvents: any;
 chatBoxHelperOpacity: SharedValue<number>;
 setDefTextInputIndex: (value: number) => void;
 setChatBoxHelperIndex: (value: number) => void;
 setSubTextInputPointerEvents: (value: string) => void;
 setParentOpacity: (value: number) => void;
 setisParentDisabled: (value: boolean) => void;
 showModalDrawer: () => void;
 hideModalDrawer: () => void;
 showSideDrawer: () => void;
 hideSideDrawer: () => void;
 showBottomDrawer: () => void;
 hideBottomDrawer: () => void;
 simulateChatboxExpand: () => void;
 simulateChatboxcollapse: () => void;
 simulateChatboxcollapseWithValue: () => void;
 setRoute: (value: React.ReactNode) => void;
 setModalDrawer: (value: React.ReactNode) => void;
 setSideDrawer: (value: React.ReactNode) => void;
 setBottomDrawer: (value: React.ReactNode) => void;
}

const AppMainContext = createContext<AppContextType | undefined>(undefined);

export const AppContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const { width, height } = Dimensions.get('window')
 
 // ✅ ADD: Auth checking state
 const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
 const [scrollViewContent, setRoute] = useState<React.ReactNode>(null);
 
 const [ parentOpacity, setParentOpacity ] = useState<number>(1)
 const [ isParentDisabled, setisParentDisabled ] = useState<any>(false)

 const [ modalDrawerChild, setModalDrawer ] = useState<React.ReactNode>(null)
 const [ sideDrawerChild, setSideDrawer ] = useState<React.ReactNode>(null)
 const [ bottomDrawerChild, setBottomDrawer ] = useState<React.ReactNode>(null)
 const appRouteTranslateX = useSharedValue<number>(0)
 const appRouteOpacity = useSharedValue<number>(1)

 const [ subTextInputPointerEvents, setSubTextInputPointerEvents ] = useState<string>('none')

 const [ chatBoxHelperIndex, setChatBoxHelperIndex ] = useState<number>(-2)
 const chatBoxHelperOpacity = useSharedValue<number>(0)
 const chatBoxTranslateY = useSharedValue<number>(height*.045)

 const subTextInputOpacity = useSharedValue<number>(0)
 const subTextInputTranslateY = useSharedValue<number>(height*-.07)

 const defTextInputOpacity = useSharedValue<number>(1)
 const [ defTextInputIndex, setDefTextInputIndex ] = useState<number>(1)

 // ✅ ADD: Check authentication on mount
 useEffect(() => {
   checkInitialAuth();
 }, []);

 const checkInitialAuth = async () => {
   try {
     console.log('🔍 Checking authentication status...');
     const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
     const userEmail = await AsyncStorage.getItem('userEmail');
     
     console.log('Auth status:', isAuthenticated);
     console.log('User email:', userEmail);
     
     if (isAuthenticated === 'true' && userEmail) {
       // ✅ User is logged in, navigate to Home
       console.log('✅ User authenticated, loading Home screen');
       setRoute(<Home/>);
     } else {
       // ❌ User not logged in, show WelcomeScreen
       console.log('❌ User not authenticated, loading Welcome screen');
       setRoute(<WelcomeScreen/>);
     }
   } catch (error) {
     console.error('Auth check error:', error);
     // Default to WelcomeScreen on error
     setRoute(<WelcomeScreen/>);
   } finally {
     // Hide loading indicator
     setTimeout(() => {
       setIsCheckingAuth(false);
     }, 500); // Small delay for smooth transition
   }
 };

 const simulateChatboxExpand = () => {
   setSubTextInputPointerEvents('auto');
   setChatBoxHelperIndex(1)
   setTimeout(() => {
     subTextInputTranslateY.value = withTiming(height*.0, { duration: 500, easing: reanimatedEasing });
     subTextInputOpacity.value = withTiming(1, { duration: 500, easing: reanimatedEasing });

     chatBoxHelperOpacity.value = withTiming(1, { duration: 500, easing: reanimatedEasing });

     chatBoxTranslateY.value = withTiming(height*.43, { duration: 500, easing: reanimatedEasing });

     defTextInputOpacity.value = withTiming(0, { duration: 500, easing: reanimatedEasing });
   }, 100);

   setTimeout(() => {
     setDefTextInputIndex(-2)
   }, 1000);
 }

 const simulateChatboxcollapse = () => {
   subTextInputTranslateY.value = withTiming(height*-.07, { duration: 500, easing: reanimatedEasing });
   subTextInputOpacity.value = withTiming(0, { duration: 500, easing: reanimatedEasing });

   chatBoxHelperOpacity.value = withTiming(0, { duration: 500, easing: reanimatedEasing });

   chatBoxTranslateY.value = withTiming(height*.045, { duration: 500, easing: reanimatedEasing });

   defTextInputOpacity.value = withTiming(1, { duration: 500, easing: reanimatedEasing });
   setTimeout(() => {
     setSubTextInputPointerEvents('none');
     setChatBoxHelperIndex(-9)
   }, 100);

   setTimeout(() => {
     setDefTextInputIndex(1)
   }, 10);
 }

 const simulateChatboxcollapseWithValue = () => {
   subTextInputOpacity.value = withTiming(1, { duration: 500, easing: reanimatedEasing });

   chatBoxHelperOpacity.value = withTiming(0, { duration: 500, easing: reanimatedEasing });

   chatBoxTranslateY.value = withTiming(height*.045, { duration: 500, easing: reanimatedEasing });

   setTimeout(() => {
     setChatBoxHelperIndex(-9)
   }, 100);
 }

 const modalDrawerTranslateX = useSharedValue<number>(width*1)
 const sideDrawerTranslateX = useSharedValue<number>(width*1)
 const bottomDrawerTranslateY = useSharedValue<number>(height*1)
 const sideDrawerOpacity = useSharedValue<number>(0)
 const modalDrawerOpacity = useSharedValue<number>(1)
 const reanimatedEasing = Easing.bezier(0.16, 1, 0.29, 0.99);

 const showModalDrawer = () => {
   appRouteOpacity.value = withTiming(.5, { duration: 500, easing: reanimatedEasing });
   appRouteTranslateX.value = withTiming(-100, { duration: 500, easing: reanimatedEasing });
   modalDrawerTranslateX.value = withTiming(width*0, { duration: 500, easing: reanimatedEasing });
 }

 const hideModalDrawer = () => {
   appRouteOpacity.value = withTiming(1, { duration: 500, easing: reanimatedEasing });
   appRouteTranslateX.value = withTiming(0, { duration: 500, easing: reanimatedEasing });
   modalDrawerTranslateX.value = withTiming(width*1, { duration: 500, easing: reanimatedEasing });
 }

 const showSideDrawer = () => {
   appRouteTranslateX.value = withTiming(width*-.4, { duration: 550, easing: reanimatedEasing });
   appRouteOpacity.value = withTiming(0, { duration: 200, easing: reanimatedEasing });
   sideDrawerTranslateX.value = withTiming(width*.2, { duration: 0, easing: reanimatedEasing });
   sideDrawerOpacity.value = withTiming(0, { duration: 0, easing: reanimatedEasing });
   setTimeout(() => {
     sideDrawerOpacity.value = withTiming(1, { duration: 200, easing: reanimatedEasing });
     sideDrawerTranslateX.value = withTiming(width*0, { duration: 550, easing: reanimatedEasing });
   }, 200);
 }

 const hideSideDrawer = () => {
   sideDrawerTranslateX.value = withTiming(width*.4, { duration: 550, easing: reanimatedEasing });
   sideDrawerOpacity.value = withTiming(0, { duration: 200, easing: reanimatedEasing });
   appRouteTranslateX.value = withTiming(width*-.2, { duration: 0, easing: reanimatedEasing });
   appRouteOpacity.value = withTiming(0, { duration: 0, easing: reanimatedEasing });

   setTimeout(() => {
     appRouteOpacity.value = withTiming(1, { duration: 200, easing: reanimatedEasing });
     appRouteTranslateX.value = withTiming(width*0, { duration: 550, easing: reanimatedEasing });
   }, 200);

   setTimeout(() => {
     sideDrawerTranslateX.value = withTiming(width*1, { duration: 0, easing: reanimatedEasing });
     sideDrawerOpacity.value = withTiming(1, { duration: 200, easing: reanimatedEasing });
   }, 1000);
 }

 const showBottomDrawer = () => {
   setChatBoxHelperIndex(1)
   setTimeout(() => {
     chatBoxHelperOpacity.value = withTiming(1, { duration: 500, easing: reanimatedEasing });
     bottomDrawerTranslateY.value = withTiming(0, { duration: 500, easing: reanimatedEasing });
   }, 50);
 }

 const hideBottomDrawer = () => {
   chatBoxHelperOpacity.value = withTiming(0, { duration: 700, easing: reanimatedEasing });
   bottomDrawerTranslateY.value = withTiming(height*1, { duration: 700, easing: reanimatedEasing });
   setTimeout(() => {
     setChatBoxHelperIndex(1)
   }, 600);
 }

 // ✅ ADD: Show loading screen while checking auth
 if (isCheckingAuth) {
   return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
       <ActivityIndicator size="large" color="#fff" />
     </View>
   );
 }

 return (
   <AppMainContext.Provider value={{
     parentOpacity,
     isParentDisabled,
     scrollViewContent,
     modalDrawerChild,
     sideDrawerChild,
     bottomDrawerChild,
     appRouteOpacity,
     appRouteTranslateX,
     modalDrawerOpacity,
     modalDrawerTranslateX,
     bottomDrawerTranslateY,
     chatBoxTranslateY,
     subTextInputOpacity,
     subTextInputTranslateY,
     sideDrawerTranslateX,
     sideDrawerOpacity,
     defTextInputIndex,
     defTextInputOpacity,
     chatBoxHelperIndex,
     chatBoxHelperOpacity,
     subTextInputPointerEvents,
     setSubTextInputPointerEvents,
     setDefTextInputIndex,
     setChatBoxHelperIndex,
     setParentOpacity,
     setBottomDrawer,
     hideBottomDrawer,
     showBottomDrawer,
     setisParentDisabled,
     setModalDrawer,
     setSideDrawer,
     setRoute,
     showModalDrawer,
     hideModalDrawer,
     showSideDrawer,
     hideSideDrawer,
     simulateChatboxExpand,
     simulateChatboxcollapse,
     simulateChatboxcollapseWithValue
   }}>
     {children}
   </AppMainContext.Provider>
 );
};

export const useAppContext = (): AppContextType => {
 const context = useContext(AppMainContext);
 if (context === undefined) {
   throw new Error('useAppContext must be used within a AppContext');
 }
 return context;
};