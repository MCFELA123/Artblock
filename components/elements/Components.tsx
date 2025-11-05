import React, { useEffect, useRef, useState } from 'react';
import { View, ViewStyle, ViewProps, TouchableOpacityProps, TouchableOpacity, ImageBackground, Dimensions, TextInputProps, TextInput, Image, ActivityIndicator, Pressable } from 'react-native';
import { useThemeContext } from '../styles/computed/themes';
import { styles } from '../styles/computed/styles';
import { TextBold, TextHeavy, TextMed } from '../fonts/TextBox';
import { BellIcon, IconArrowLeftV2, IconArrowRight, IconCheck, IconEyeHide, IconEyeShow, IconLibrary, IconOptions, IconSpinner, WalletIcon, WalletIconV2, WalletIconV3 } from '../icons/Icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { LayerFill } from './LayerShadow';
import { Blury } from './Blurry';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { useAppContext } from '../../context/AppContext';
import { ScrollView } from 'react-native-gesture-handler';
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

interface PadProps extends ViewProps {
 px?: number;
 py?: number;
 gap?: any;
 activeOpacity?: number;
 direction?: 'row' | 'column';
 align?: 'center' | 'baseline' | 'stretch' | 'flex-start' | 'flex-end';
 justify?: 'center' | 'space-around' | 'space-between' | 'space-evenly' | 'flex-start' | 'flex-end';
 children?: React.ReactNode;
}

interface BreakProps extends ViewProps {
 px?: any;
 py?: number;
 children?: React.ReactNode;
}

interface ButtonProps extends TouchableOpacityProps {
 px?: number;
 py?: number;
 textcolor?: string;
 touchAction?: () => void;
 children?: React.ReactNode;
}

interface TextBoxProps extends TextInputProps {
 label: string;
 title: string;
 icon?: React.ReactNode;
 onChange?: () => void;
}

interface UserProfileProps extends ViewProps {
 user?: any;
 size?: any;
 radius?: number;
 touchAction?: () => void;
}

interface ModalDrawer extends ViewProps {
 children?: React.ReactNode;
}

interface OptionProps extends ViewProps {
 size?: number;
 position?: 'absolute' | 'relative';
 touchAction?: () => void;
}

interface ColumnStackProps extends TouchableOpacityProps {
 title?: string;
 icon?: React.ReactNode;
}

interface LiquidGlassProps extends ViewProps {
 px?: number;
 py?: number;
 width?: any;
 height?: any;
 gap?: number;
 radius?: number;
 intensity?: number;
 activeOpacity?: number;
 touchAction?: () => void;
 children?: React.ReactNode;
 direction?: 'row' | 'column';
 position?: 'absolute' | 'relative';
}

 const { width, height } = Dimensions.get("window")

export const Option:React.FC<OptionProps> = ({ size, position, touchAction }) => {
 const { optionColor } = useThemeContext()
 return (
 <TouchableOpacity style={[styles.align,styles.justify,{width:size,height:size,position:position,
 borderRadius:100,overflow:'hidden',backgroundColor:optionColor}]} onPress={touchAction}>
 <IconOptions width={'65%'} height={'65%'} fill={'#5F35EA'} style={[{position:position}]}/>
 </TouchableOpacity>
 )
}

export const BackAction:React.FC<ButtonProps> = ({ touchAction }) => {
 const { textColor } = useThemeContext()
 return (
 <TouchableOpacity activeOpacity={.5} onPress={touchAction} style={[styles.align,styles.justify,
 {width:27,height:27,borderRadius:100,borderWidth:1,borderColor:`${textColor}50`,transform:[{rotate:'180deg'}]}]}>
 <IconArrowRight width={22} height={22} strokeWidth={1.7}/>
 </TouchableOpacity>
 )
}

export const ModalDrawer: React.FC<ModalDrawer> = ({ children }) => {
 const { parentBackground } = useThemeContext()
 const { modalDrawerTranslateX } = useAppContext()
 const modalDrawerStyle = [{
 transform: [{ translateX: modalDrawerTranslateX }],
 }]
 return (
 <Animated.ScrollView style={[styles.sizeFull, modalDrawerStyle,
 {backgroundColor:parentBackground}]}>{children}</Animated.ScrollView>
 )
}

export const BottomDrawer: React.FC<ModalDrawer> = ({ children }) => {
 const { bottomDrawerTranslateY, hideBottomDrawer } = useAppContext()
 const offsetY = useSharedValue(0)
 const isGestureActive = useSharedValue(false)
 
 const reanimatedEasing = Easing.bezier(0.16, 1, 0.29, 0.99)
 
 const panGesture = Gesture.Pan()
 .activeOffsetY(10)
 .failOffsetY(-10)
 .activeOffsetX([-1000, 1000])
 .onStart(() => {
 isGestureActive.value = true
 })
 .onUpdate((event) => {
 // Only allow downward dragging
 if (event.translationY > 0) {
 offsetY.value = event.translationY
 }
 })
 .onEnd((event) => {
 isGestureActive.value = false
 
 // Trigger close if swiped down significantly or fast downward velocity
 if (event.translationY > 600 || event.velocityY > 500) {
 // Smoothly continue the drawer down from current position
 const currentPosition = offsetY.value
 const targetPosition = height * 1 // Full drawer height
 
 bottomDrawerTranslateY.value = withTiming(currentPosition, { duration: 0 }, () => {
 bottomDrawerTranslateY.value = withTiming(targetPosition, {
 duration: 900,
 easing: reanimatedEasing
 }, (finished) => {
 if (finished) {
 offsetY.value = 0
 runOnJS(hideBottomDrawer)()
 }
 })
 })
 } else {
 // Snap back to original position with iOS-like bounce
 offsetY.value = withSpring(0, {
 damping: 20,
 stiffness: 350,
 mass: .6,
 })
 }
 })
 
 const animatedStyle = useAnimatedStyle(() => ({
 transform: [
 { 
 translateY: isGestureActive.value 
 ? offsetY.value 
 : bottomDrawerTranslateY.value + offsetY.value 
 }
 ],
 }))
 
 return (
 <>
 <GestureDetector gesture={panGesture}>
 <Animated.View style={[styles.wFull, styles.absolute, animatedStyle,
 { bottom: 0, height: '90%', borderRadius: width * .08 }]}>
 <Blury height={'100%'} background={''} parentRadius={width * .08} radius={width * .08}/>
 <LiquidGlassNode height={'100%'} radius={width * .08} style={[{ overflow: 'hidden' }]}>
 <View style={[styles.absolute,styles.center,{paddingVertical:height*.012}]}>
 <TouchableOpacity activeOpacity={.5} style={[{width:width*.15,height:height*.007,
 borderRadius:width,backgroundColor:'#00000030',zIndex:99}]}/>
 </View>
 <View style={[styles.wFull, styles.hFull]}>{children}</View>
 </LiquidGlassNode>
 </Animated.View>
 </GestureDetector>
 </>
 )
}

export const SideDrawer: React.FC<ModalDrawer> = ({ children }) => {
 const { sideDrawerTranslateX, sideDrawerOpacity } = useAppContext()
 const SideDrawerStyle = [{
 transform: [{ translateX: sideDrawerTranslateX }],
 opacity: sideDrawerOpacity,
 }]
 return (
 <Animated.View style={[styles.parentLayout, SideDrawerStyle]}>{children}</Animated.View>
 )
}

export const Pad: React.FC<PadProps> = ({ px = 0, py = 0, direction = 'column', gap, 
 justify = 'center', align = 'center', style, activeOpacity=1, children, ...rest }) => {
 const padStyle: ViewStyle = {
 gap: gap,
 paddingLeft: px,
 paddingRight: px,
 paddingVertical: py,
 flexDirection: direction,
 justifyContent: justify,
 alignItems: align
 };

 return (
 <View style={[padStyle, style]} {...rest}>
 {children}
 </View>
 );
};

export const Break: React.FC<BreakProps> = ({ px = 0, py = 0, children, style, ...rest }) => {
 const BreakStyle: ViewStyle = {
 paddingLeft: px,
 paddingRight: px,
 paddingTop: py,
 paddingBlock: py
 };

 return (
 <View style={[BreakStyle, style]} {...rest}>
 {children}
 </View>
 );
};

export const PrimaryButton: React.FC<ButtonProps> = ({ children, touchAction }) => {
 const { textColor, textColorV2 } = useThemeContext()
 return (
 <TouchableOpacity activeOpacity={.5} style={[styles.wFull,
 {borderRadius:width*.03,
 backgroundColor: textColor,
 shadowColor: '#000000',
 shadowOffset: {
 width: 0,
 height: 40,
 },
 shadowOpacity: 0.5,
 shadowRadius: 8,
 elevation: 9,}
 ]} onPress={touchAction} focusable={true} touchSoundDisabled={true}>
 <Pad direction="row" py={height*.015} px={20}>
 <View style={[{width:'90%'}]}>
 <TextBold color={textColorV2} opacity={1} ltsp={.4}>{children}</TextBold>
 </View>
 <View style={[styles.alignEnd,styles.justify,{width:'10%'}]}>
 <IconArrowLeftV2 width={20} height={20}/>
 </View>
 </Pad>
 </TouchableOpacity>
 );
};

export const SimulatedTextBox:React.FC<TextBoxProps> = ({ label="Payern Title", title="Payern TextBox",
 icon, keyboardType, onChange }) => {
 const { textColor, textInputColor, textInputBorderColor } = useThemeContext()
 return (
 <Pad direction='column' align='flex-start' gap={2} style={[{width:'95%',margin:'auto'}]}>
 <TextBold color={`${textColor}`} opacity={.5} size={12.5}> {label}</TextBold>
 <Pad direction={'row'} style={[styles.wFull,styles.align,{height:height*.05,backgroundColor:textInputColor,
 borderWidth:1,borderColor:textInputBorderColor,borderRadius:width*.023,overflow:'hidden'}]} px={5}>
 {/* <View style={[styles.hFull,styles.align,styles.justify,{width:'10%'}]}>{icon}</View> */}
 <View style={[styles.hFull,{width:'90%'}]}>
 <TextInput onChange={onChange} style={[styles.wFull,{backgroundColor:'transparent',color:textColor,
 height:height*.055,fontFamily:'Font-Regular'}]} keyboardType={keyboardType} placeholder={title} placeholderTextColor={`${textColor}40`}/>
 </View>
 <View style={[styles.hFull,{width:'10%'}]}></View>
 </Pad>
 </Pad>
 )
}

export const SimulatedPhoneTextBox:React.FC<TextBoxProps> = ({ label="Payern Title", title="Payern TextBox",
 icon=<TouchableOpacity activeOpacity={.5}><Pad direction='row' align='center' justify='center'>
 <TextBold size={10}>+234</TextBold>
 <IconArrowRight width={15} height={15} strokeWidth={1.2} rotation={90}/>
 </Pad></TouchableOpacity>, keyboardType, onChange }) => {
 const { textColor, textInputColor, textInputBorderColor } = useThemeContext()
 return (
 <Pad direction='column' align='flex-start' gap={2} style={[{width:'95%',margin:'auto'}]}>
 <TextBold color={`${textColor}`} opacity={.5} size={12.5}> {label}</TextBold>
 <Pad direction={'row'} style={[styles.wFull,styles.align,{height:height*.05,backgroundColor:textInputColor,
 borderWidth:1,borderColor:textInputBorderColor,borderRadius:width*.023,overflow:'hidden'}]} px={5}>
 <View style={[styles.hFull,styles.align,styles.justify,{width:'17%',backgroundColor:'#ffffff00'}]}>{icon}</View>
 <View style={[styles.hFull,{width:'73%'}]}>
 <TextInput onChange={onChange} style={[styles.wFull,{backgroundColor:'transparent',color:textColor,
 height:height*.055,fontFamily:'Font-Regular'}]} keyboardType={keyboardType} placeholder={title} placeholderTextColor={`${textColor}40`}/>
 </View>
 <View style={[styles.hFull,{width:'10%'}]}></View>
 </Pad>
 </Pad>
 )
}

export const UserProfile:React.FC<UserProfileProps> = ({ size="100%", user, radius=width*1, touchAction }) => {
 return (
 <TouchableOpacity style={[styles.align,styles.justify,{
 width:size,
 height:size,
 borderRadius:radius,
 overflow: 'hidden',
 }]} activeOpacity={.5} onPress={touchAction}>
 <ImageBackground source={user} style={[{width:'91%',height:'91%',transform:[{scale:width*.0025},
 {translateX:width*.002},{translateY:width*.001}]}]}/></TouchableOpacity>
 )
}

export const Headbar = () => {
 return (
 <Pad style={[styles.wFull,{height:width*.215,paddingTop:height*.025}]} direction='row' justify='flex-start' align='center' px={width*.08}>
 <Pad direction='row' justify='flex-start' align='center' style={[styles.wHalf]} gap={width*.02}>
 <UserProfile size={width*.095} user={require('../../assets/images/usermale.png')}/>
 <Pad direction='column' align='flex-start' style={[{paddingTop:height*.001}]}>
 <TextBold size={width*.036} opacity={.9} lnh={width*.04}>Hey</TextBold>
 <TextBold size={width*.036} opacity={.9} lnh={width*.045}>Sherman</TextBold>
 </Pad>
 </Pad>
 <Pad direction='row' justify='flex-end' align='center' style={[styles.wHalf]}>
 <TouchableOpacity activeOpacity={.5}><BellIcon width={width*.07} height={width*.07}/></TouchableOpacity>
 </Pad>
 </Pad>
 )
}

export const Bottombar = () => {
 const { parentBackground } = useThemeContext()
 return (
 <Pad style={[styles.wFull,styles.absolute,{bottom:0,zIndex:9}]}
 direction='row' justify='flex-start' align='center'>
 <LinearGradient
 colors={[`${parentBackground}00`, `${parentBackground}`, `${parentBackground}`]}
 start={{ x: 1, y: 0 }}
 end={{ x: 1, y: 1 }}
 style={{ width: '100%', height: height*.13, bottom:0, position: 'absolute'}} pointerEvents='none'/>
 <Pad style={[styles.wFull,styles.absolute,{height:width*.215,paddingTop:height*.035,bottom:0,zIndex:9,backgroundColor:'#f8fbfbff'}]}
 direction='row' justify='flex-start' align='center'></Pad>
 </Pad>
 )
}

export const ColumnStack:React.FC<ColumnStackProps> = ({ title="Depoist", icon=<WalletIconV3 width={width*.075} height={width*.075} opacity={.6}/> }) => {
 const { textColor } = useThemeContext()
 return (
 <Pad direction='column' align='center' justify='center' gap={3}>
 <TouchableOpacity activeOpacity={.5}>{icon}</TouchableOpacity>
 <TextMed size={width*.029} lnh={width*.036} opacity={.6} color={textColor}>{title}</TextMed>
 </Pad>
 )
}

export const LiquidGlassView:React.FC<LiquidGlassProps> = ({ px, py, gap, width, direction, height, 
 children='Get Started', radius, intensity }) => {
 const { textColor } = useThemeContext()
 return (
 <View style={[{
 width:width,
 height:height,
 borderRadius:radius
 }]}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 borderRadius:radius,
 borderTopWidth: 2,
 borderLeftWidth: 2,
 borderRightWidth: 2,
 borderBottomWidth: 2,
 paddingTop: 3,
 paddingRight: 3,
 position:'absolute',
 borderTopColor:'#fffffff5',
 borderLeftColor:'#ffffff50',
 borderRightColor:'#fffffff5',
 borderBottomColor:'#ffffff70',
 shadowColor: '#00000070',
 shadowOffset: {
 width: 0,
 height: 4,
 },
 shadowOpacity: 0.6,
 shadowRadius: 8,
 elevation: 10,
 }]}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 padding: 3,
 borderRadius:radius,
 borderTopWidth: .7,
 borderLeftWidth: .7,
 borderRightWidth: .7,
 borderBottomWidth: .7,
 borderTopColor:'#ffffffe5',
 borderLeftColor:'#ffffff30',
 borderRightColor:'#ffffffe5',
 borderBottomColor:'#ffffff40',
 }]}>
 <Blury intensity={5.5} radius={radius} parentRadius={radius} left={5} top={1} height='100%' scaleX={1} background={`rgba(0, 0, 0, ${intensity})`}/>
 </View>
 </View>
 <View style={[{width:'100%',height:'100%'}]}>
 <Blury intensity={2.8} radius={radius} parentRadius={radius} height='100%' bottom={0} scaleX={1} background={'rgba(255, 255, 255, 0.23)'}/>
 <View style={[{
 paddingVertical:py,
 paddingHorizontal: px,
 gap: gap,
 flexDirection: direction,
 height: height,
 borderRadius:radius,
 borderTopWidth: 1.5,
 borderLeftWidth: 1.5,
 borderRightWidth: 1.5,
 borderBottomWidth: 1.5,
 borderTopColor:'#ffffff00',
 borderLeftColor:'#ffffff00',
 borderRightColor:'#ffffff00',
 borderBottomColor:'#ffffff00',
 backgroundColor:'#ffffff00'
 }]}>
 <Pad direction="row" px={20} style={[{opacity:.85}]}>
 <View style={[{width:'90%'}]}>
 <TextBold color={textColor} opacity={1} ltsp={.4}>{children}</TextBold>
 </View>
 <View style={[styles.alignEnd,styles.justify,{width:'10%'}]}>
 <IconArrowLeftV2 width={20} height={20}/>
 </View>
 </Pad>
 </View>
 </View>
 </View>
 )
}

export const LiquidGlassNode:React.FC<LiquidGlassProps> = ({ px, py, gap, width, direction, height, 
 children, touchAction, radius, intensity, position, activeOpacity=1, ...props }) => {
 const { textColor } = useThemeContext()
 return (
 <TouchableOpacity style={[{
 width:width,
 height:height,
 borderRadius:radius,
 position:position
 }]} onPress={touchAction} activeOpacity={activeOpacity}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 borderRadius:radius,
 borderTopWidth: 2,
 borderLeftWidth: 2,
 borderRightWidth: 2,
 borderBottomWidth: 2,
 paddingTop: 3,
 paddingRight: 3,
 position:'absolute',
 borderTopColor:'#fffffff5',
 borderLeftColor:'#ffffff50',
 borderRightColor:'#fffffff5',
 borderBottomColor:'#ffffff70',
 shadowColor: '#00000070',
 shadowOffset: {
 width: 0,
 height: 4,
 },
 shadowOpacity: 0.6,
 shadowRadius: 8,
 elevation: 10,
 }]}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 padding: 3,
 borderRadius:radius,
 borderTopWidth: .7,
 borderLeftWidth: .7,
 borderRightWidth: .7,
 borderBottomWidth: .7,
 borderTopColor:'#ffffffe5',
 borderLeftColor:'#ffffff30',
 borderRightColor:'#ffffffe5',
 borderBottomColor:'#ffffff40',
 }]}>
 <Blury intensity={5.5} radius={radius} parentRadius={radius} left={5} top={1} height='100%' scaleX={1} background={`rgba(0, 0, 0, ${intensity})`}/>
 </View>
 </View>
 <View style={[{width:'100%',height:'100%'}]}>
 <Blury intensity={2.8} radius={radius} parentRadius={radius} height='100%' bottom={0} scaleX={1} background={'rgba(255, 255, 255, 0.23)'}/>
 <View style={[{
 paddingVertical:py,
 paddingHorizontal: px,
 gap: gap,
 flexDirection: direction,
 height: height,
 borderRadius:radius,
 borderTopWidth: 1.5,
 borderLeftWidth: 1.5,
 borderRightWidth: 1.5,
 borderBottomWidth: 1.5,
 borderTopColor:'#ffffff00',
 borderLeftColor:'#ffffff00',
 borderRightColor:'#ffffff00',
 borderBottomColor:'#ffffff00',
 backgroundColor:'#ffffff00'
 }]} {...props}>
{children}
 </View>
 </View>
 </TouchableOpacity>
 )
}

export const LiquidGlassObject:React.FC<LiquidGlassProps> = ({ px, py, gap, width, direction, height, 
 children='Get Started', radius, intensity, touchAction }) => {
 const { textColor } = useThemeContext()
 return (
 <TouchableOpacity activeOpacity={.5} style={[{
 width:width,
 height:height,
 borderRadius:radius
 }]} onPress={touchAction}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 borderRadius:radius,
 borderTopWidth: 2,
 borderLeftWidth: 2,
 borderRightWidth: 2,
 borderBottomWidth: 2,
 paddingTop: 3,
 paddingRight: 3,
 position:'absolute',
 borderTopColor:'#fffffff5',
 borderLeftColor:'#ffffff50',
 borderRightColor:'#fffffff5',
 borderBottomColor:'#ffffff70',
 shadowColor: '#00000070',
 shadowOffset: {
 width: 0,
 height: 4,
 },
 shadowOpacity: 0.6,
 shadowRadius: 8,
 elevation: 10,
 }]}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 padding: 3,
 borderRadius:radius,
 borderTopWidth: .7,
 borderLeftWidth: .7,
 borderRightWidth: .7,
 borderBottomWidth: .7,
 borderTopColor:'#ffffffe5',
 borderLeftColor:'#ffffff30',
 borderRightColor:'#ffffffe5',
 borderBottomColor:'#ffffff40',
 }]}>
 <Blury intensity={5.5} radius={radius} parentRadius={radius} left={5} top={1} height='100%' scaleX={1} background={`rgba(0, 0, 0, ${intensity})`}/>
 </View>
 </View>
 <View style={[{width:'100%',height:'100%'}]}>
 <Blury intensity={2.8} radius={radius} parentRadius={radius} height='100%' bottom={0} scaleX={1} background={'rgba(255, 255, 255, 0.23)'}/>
 <View style={[{
 paddingVertical:py,
 paddingHorizontal: px,
 gap: gap,
 flexDirection: direction,
 height: height,
 borderRadius:radius,
 borderTopWidth: 1.5,
 borderLeftWidth: 1.5,
 borderRightWidth: 1.5,
 borderBottomWidth: 1.5,
 borderTopColor:'#ffffff00',
 borderLeftColor:'#ffffff00',
 borderRightColor:'#ffffff00',
 borderBottomColor:'#ffffff00',
 backgroundColor:'#ffffff00'
 }]}>
 {children}
 </View>
 </View>
 </TouchableOpacity>
 )
}

export const LiquidGlassObjectFunction:React.FC<LiquidGlassProps> = ({ px, py, gap, width, direction, height, 
 children='Get Started', radius, intensity, touchAction }) => {
 const { textColor } = useThemeContext();
 const [ arrow, setArrow ] = useState<'none' | 'flex'>('flex')
 const [ spinner, setSpinner ] = useState<'none' | 'flex'>('none')
 const { parentOpacity, isParentDisabled, setParentOpacity, setisParentDisabled } = useAppContext()

 const load = () => {
 setArrow('none');
 setSpinner('flex');
 setParentOpacity(.5);
 setisParentDisabled(true)
 }

 const loaded = () => {
 setArrow('flex');
 setSpinner('none')
 setParentOpacity(1);
 setisParentDisabled(false)
 }

 const simulateTouch = () => {
 setTimeout(() => {load()}, 150);setTimeout(() => {
 loaded()}, 4000);
 setTimeout(() => {
 touchAction?.()
 }, 2000);
 }

 const simulateTouchRef = useRef<() => void>(() => {});
 simulateTouchRef.current = simulateTouch;
 
 useEffect(() => {
 (global as any).simulateTouch = () => simulateTouchRef.current();
 }, []);

 return (
 <TouchableOpacity style={[{
 width:width,
 height:height,
 borderRadius:radius,
 opacity:parentOpacity
 }]} activeOpacity={.5} onPress={simulateTouch} disabled={isParentDisabled}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 borderRadius:radius,
 borderTopWidth: 2,
 borderLeftWidth: 2,
 borderRightWidth: 2,
 borderBottomWidth: 2,
 paddingTop: 3,
 paddingRight: 3,
 position:'absolute',
 borderTopColor:'#fffffff5',
 borderLeftColor:'#ffffff50',
 borderRightColor:'#fffffff5',
 borderBottomColor:'#ffffff70',
 shadowColor: '#00000070',
 shadowOffset: {
 width: 0,
 height: 4,
 },
 shadowOpacity: 0.6,
 shadowRadius: 8,
 elevation: 10,
 }]}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 padding: 3,
 borderRadius:radius,
 borderTopWidth: .7,
 borderLeftWidth: .7,
 borderRightWidth: .7,
 borderBottomWidth: .7,
 borderTopColor:'#ffffffe5',
 borderLeftColor:'#ffffff30',
 borderRightColor:'#ffffffe5',
 borderBottomColor:'#ffffff40',
 }]}>
 <Blury intensity={5.5} radius={radius} parentRadius={radius} left={5} top={1} height='100%' scaleX={1} background={`rgba(0, 0, 0, ${intensity})`}/>
 </View>
 </View>
 <View style={[{width:'100%',height:'100%'}]}>
 <Blury intensity={2.8} radius={radius} parentRadius={radius} height='100%' bottom={0} scaleX={1} background={'rgba(255, 255, 255, 0.23)'}/>
 <View style={[{
 paddingVertical:py,
 paddingHorizontal: px,
 gap: gap,
 flexDirection: direction,
 height: height,
 borderRadius:radius,
 borderTopWidth: 1.5,
 borderLeftWidth: 1.5,
 borderRightWidth: 1.5,
 borderBottomWidth: 1.5,
 borderTopColor:'#ffffff00',
 borderLeftColor:'#ffffff00',
 borderRightColor:'#ffffff00',
 borderBottomColor:'#ffffff00',
 backgroundColor:'#ffffff00'
 }]}>
 <Pad direction="row" px={20} style={[{opacity:.85}]}>
 <View style={[{width:'90%'}]}>
 <TextBold color={textColor} opacity={1} ltsp={.4}>{children}</TextBold>
 </View>
 <View style={[styles.alignEnd,styles.justify,{width:'10%'}]}>
 <IconArrowLeftV2 width={20} height={20} style={{display:arrow,transform:[{rotate:'180deg'}]}}/>
 <ActivityIndicator size="small" color="#000" style={{display:spinner}} />
 </View>
 </Pad>
 </View>
 </View>
 </TouchableOpacity>
 )
}


export const BluredObject:React.FC<LiquidGlassProps> = ({ px, py, gap, width, direction, height, 
 children='Get Started', radius, intensity }) => {
 const { textColor } = useThemeContext()
 return (
 <View style={[{
 width:width,
 height:height,
 borderRadius:radius
 }]}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 borderRadius:radius,
 shadowColor: '#00000070',
 shadowOffset: {
 width: 0,
 height: 4,
 },
 shadowOpacity: 0.6,
 shadowRadius: 8,
 elevation: 10,
 }]}>
 <View style={[styles.align,styles.justify,{
 width:'100%',
 height:'100%',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 padding: 3,
 borderRadius:radius,
 }]}>
 <Blury intensity={5.5} radius={radius} parentRadius={radius} left={5} top={1} height='100%' scaleX={1} background={`rgba(0, 0, 0, ${intensity})`}/>
 </View>
 </View>
 <View style={[{width:'100%',height:'100%'}]}>
 <Blury intensity={2.8} radius={radius} parentRadius={radius} height='100%' bottom={0} scaleX={1} background={'rgba(255, 255, 255, 0.23)'}/>
 <View style={[{
 paddingVertical:py,
 paddingHorizontal: px,
 gap: gap,
 flexDirection: direction,
 height: height,
 borderRadius:radius,
 }]}>
 {children}
 </View>
 </View>
 </View>
 )
}

interface CheckMarkProps {
 fill?: any;
}

export const CheckMarkFill:React.FC<CheckMarkProps> = ({ fill='none' }) => {
 return (
 <Pad style={[styles.sizeFull]} align='flex-end' justify='flex-end' px={width*.035} py={width*.035}>
 <View style={[{width:width*.06,height:width*.06,borderRadius:100}]}>
 <View style={[styles.wFull,styles.hFull,{backgroundColor:'#ffffffa5',
 borderRadius:100,/*borderWidth:1,borderColor:'#ffffff',*/display:fill}]}>
 <IconCheck strokeWidth={1.4} style={{transform:[{scale:1.6}],opacity:.8}}/>
 </View>
 </View>
 </Pad>
 )
}

interface SimulatedTextInputProps {
 placeHolder?: string;
 onPress?: () => void;
 value?: string;
 onChange?: (text: string) => void;
 keyboardtype?: any;
 ref?: any;
 secureTextEntry?: boolean;
}

export const SimulatedTextInput:React.FC<SimulatedTextInputProps> = ({ placeHolder="First Name", onPress,
 onChange, keyboardtype, ref, value, ...props }) => {
 return (
 <View style={[styles.wFull,{height:height*.057,position:'relative'}]} {...props}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 <Blury intensity={10} height={'100%'} radius={width*1} background={''}/>
 </View>
 <View style={[styles.wFull,styles.absolute,styles.hFull]}>
 <Pad direction="column" justify="flex-start" style={[styles.wFull,styles.hFull]} px={width*.05}>
 <TextInput style={[styles.wFull,styles.hFull]} placeholder={placeHolder} autoCapitalize="none"
 placeholderTextColor={'#00000070'} ref={ref} value={value} onPress={onPress} onChangeText={(text) => {
 // Call onChange with the text directly
 if (onChange) {
 onChange(text);
 }
 }}
 keyboardType={keyboardtype}/>
 </Pad>
 </View>
 </View>
 )
}

export const SimulatedPasswordTextInput: React.FC<SimulatedTextInputProps> = ({
 placeHolder = 'Password',
 onPress,
 value,
 onChange,
 secureTextEntry,
 keyboardtype = 'default',
}) => {
 const [isHidden, setIsHidden] = useState(true);

 return (
 <View style={[styles.wFull, { height: height * 0.057, position: 'relative' }]}>
 <View style={[styles.absolute, styles.wFull, styles.hFull]}>
 <Blury intensity={10} height={'100%'} radius={width * 1} background={''} />
 </View>

 <View style={[styles.wFull, styles.absolute, styles.hFull]}>
 <Pad direction="row" justify="flex-start" style={[styles.wFull, styles.hFull]} px={width * 0.05}>
 <TextInput
 style={[styles.hFull, { width: '93%' }]}
 placeholder={placeHolder}
 placeholderTextColor={'#00000070'}
 secureTextEntry={isHidden}
 value={value}
 onChangeText={(text) => {
 if (onChange) {
 onChange(text);
 }
 }}
 onPressIn={onPress}
 keyboardType={keyboardtype as any}
 />

 <View style={[{ width: '7%' }]}>
 <TouchableOpacity activeOpacity={0.5} onPress={() => setIsHidden(!isHidden)}>
 {isHidden ? (
 <IconEyeShow width={width * .055} height={width * .055} strokeWidth={.3} opacity={.7} />
 ) : (
 <IconEyeHide width={width * .055} height={width * .055} strokeWidth={1.7} opacity={.7} />
 )}
 </TouchableOpacity>
 </View>
 </Pad>
 </View>
 </View>
 );
};

export const SimulatedDateTextInput: React.FC<SimulatedTextInputProps> = ({
 placeHolder = 'YYYY-MM-DD',
 value,
 onChange,
 keyboardtype,
}) => {
 const handleChange = (text: string) => {
 // Remove all non-numeric characters
 let cleaned = text.replace(/\D/g, '');
 
 // Auto-format with dashes
 let formatted = cleaned;
 if (cleaned.length > 4 && cleaned.length <= 6) {
 formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
 } else if (cleaned.length > 6) {
 formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
 }

 // Call parent onChange with formatted value
 if (onChange) {
 onChange(formatted);
 }
 };

 return (
 <View
 style={[
 styles.wFull,
 { height: height * 0.07, position: 'relative', flexDirection: 'column' },
 ]}>
 <View style={[styles.absolute, styles.wFull, styles.hFull]}>
 <Blury intensity={10} height={'100%'} radius={width * 1} background={''} />
 </View>

 <View style={[styles.wFull, styles.absolute, styles.hFull]}>
 <Pad
 direction="column"
 align="flex-start"
 style={[styles.wFull, styles.hFull]}
 px={width * 0.05}>
 <View
 style={[
 styles.alignStart,
 styles.justifyEnd,
 styles.wFull,
 { height: '30%' },
 ]}>
 <TextBold size={width * 0.03}>Date of Birth</TextBold>
 </View>

 <View
 style={[
 styles.align,
 styles.justify,
 styles.wFull,
 { height: '50%', transform: [{ translateY: height * -0.002 }] },
 ]}>
 <TextInput
 style={[styles.wFull, styles.hFull]}
 value={value}
 placeholder={placeHolder}
 placeholderTextColor={'#00000070'}
 keyboardType="number-pad"
 maxLength={10}
 onChangeText={handleChange}
 />
 </View>
 </Pad>
 </View>
 </View>
 );
};

interface SimulatedViewProps extends TouchableOpacityProps {
 size?: number;
 onPress?: () => void;
 children?: React.ReactNode;
}

export const SimulatedView:React.FC<SimulatedViewProps> = ({ size=.057, onPress, children }) => {
 return (
 <TouchableOpacity style={[styles.wFull,{height:width*size,width:width*size,position:'relative'}]} activeOpacity={.5} onPress={onPress}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 <Blury intensity={10} height={'100%'} radius={width*1} background={''}/>
 </View>
 <View style={[styles.center,styles.absolute,styles.hFull]}>{children}</View>
 </TouchableOpacity>
 )
}

interface OnbardingItemsProps {
 fill?: any;
 title?: string;
 description?: string;
 onPress?: () => void;
 icon?: React.ReactNode;
}

export const OnbardingItems:React.FC<OnbardingItemsProps> = ({ icon, title, description, fill, onPress }) => {
 const { width, height } = Dimensions.get('window')
 return (
 <TouchableOpacity style={[styles.wFull,{borderRadius:width*.03,height:height*.12,position:'relative'}]}
 activeOpacity={.5} onPress={onPress}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 <Blury intensity={10} height={'100%'} radius={width*.05} background={''}/>
 </View>
 <View style={[styles.wFull,styles.absolute,styles.hFull]}>
 <Pad direction="column" justify="flex-start" px={width*.03} py={width*.025}
 style={[styles.wFull,styles.hFull]} gap={height*.012}>
 <View style={[styles.wFull]}>
 <LiquidGlassObject height={width*.09} width={width*.09} radius={100}>
 <View style={[styles.wFull,styles.hFull,styles.center]}>{icon}</View>
 </LiquidGlassObject>
 </View>
 <View style={[styles.wFull,{flexDirection:'column',gap:height*.002}]}>
 <TextHeavy size={width*.04}>{title}</TextHeavy>
 <Pad justify="flex-end" direction="row">
 <View style={[{width:'100%'}]}>
 <TextMed opacity={.55} size={width*.035}>{description}</TextMed>
 </View>
 </Pad>
 </View>
 </Pad>
 </View>
 <CheckMarkFill fill={fill}/>
 </TouchableOpacity>
 )
}

export const OnboardingItems:React.FC<OnbardingItemsProps> = ({ icon, title, description, fill, onPress }) => {
 const { width, height } = Dimensions.get('window')
 return (
 <TouchableOpacity style={[styles.wFull,{borderRadius:width*.03,height:height*.12,position:'relative'}]}
 activeOpacity={.5} onPress={onPress}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 <Blury intensity={10} height={'100%'} radius={width*.05} background={''}/>
 </View>
 <View style={[styles.wFull,styles.absolute,styles.hFull]}>
 <Pad direction="column" justify="flex-start" px={width*.03} py={width*.02}
 style={[styles.wFull,styles.hFull]} gap={height*.012}>
 <View style={[styles.wFull]}>
 <LiquidGlassObject height={width*.09} width={width*.09} radius={100}>
 <View style={[styles.wFull,styles.hFull,styles.center]}>{icon}</View>
 </LiquidGlassObject>
 </View>
 <View style={[styles.wFull,{flexDirection:'column',gap:height*.002}]}>
 <TextHeavy size={width*.04}>{title}</TextHeavy>
 <Pad justify="flex-end" direction="row">
 <View style={[{width:'90%'}]}>
 <TextMed opacity={.55} size={width*.035}>{description}</TextMed>
 </View>
 <View style={[{width:'10%'},styles.alignEnd,{paddingRight:width*.012}]}></View>
 </Pad>
 </View>
 </Pad>
 </View>
 <CheckMarkFill fill={fill}/>
 </TouchableOpacity>
 )
}