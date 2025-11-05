import { Break, CheckMarkFill, LiquidGlassObject, LiquidGlassObjectFunction, LiquidGlassView, OnbardingItems, Pad, SimulatedDateTextInput, SimulatedPasswordTextInput, SimulatedTextBox, SimulatedTextInput } from "../components/elements/Components"
import { TextBold, TextHeavy, TextMed } from "../components/fonts/TextBox"
import { styles } from "../components/styles/computed/styles"
import { useThemeContext } from "../components/styles/computed/themes"
import { useAppContext } from "../context/AppContext"
import { Alert, Dimensions, TextInput, TouchableOpacity, View } from "react-native"
import { LayerFill } from "../components/elements/LayerShadow"
import { IconMonitorDesk, IconWaterDrop, IconWrenchTool } from "../components/icons/Icons"
import { Blury } from "../components/elements/Blurry"
import { useEffect, useState } from "react"
import { Home } from "./Home"
import { authAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../context/AuthContext"

export const WelcomeScreen:React.FC = () => {
 const { showSideDrawer, hideSideDrawer, setSideDrawer } = useAppContext()
 const { width, height } = Dimensions.get('window')
 return (
 <View style={[styles.parentLayout]}>
 <Pad direction="column" style={[styles.wFull,styles.alignStart,styles.justifyStart,styles.hFull]}>
 <View style={[styles.sizeFull,styles.alignStart]}>
 <Pad direction="column" px={width*.07} py={70} style={[styles.wFull,styles.alignStart,styles.justifyStart]}>
 <View style={[styles.center]}><TextHeavy size={width*.05}>ArtBlock AI&trade;</TextHeavy></View>
 <Break py={height*.03}/>
 <View style={[styles.column,{gap:height*.01}]}>
 <TextMed size={width*.11} opacity={.55}>Explore</TextMed>
 <Pad direction="row" justify="flex-start" align="center" gap={width*.035}>
 <TextHeavy size={width*.16} opacity={.9}>AI</TextHeavy>
 <View style={{width:width*.45,height:height*.075,borderRadius:100,overflow:'hidden',
 borderWidth:2.5,borderColor:'#ffffffc0',backgroundColor:'#fff'}}>
 <LayerFill fill={require('../assets/images/gen1.jpeg')}/>
 </View>
 </Pad>
 <View>
 <TextHeavy size={width*.16} opacity={.9}>Creativitiy</TextHeavy>
 </View>
 <Pad direction="row" justify="flex-start" align="center" gap={width*.035}>
 <TextMed size={width*.14} opacity={.55}>in</TextMed>
 <View style={{width:width*.23,height:height*.07,borderRadius:100,overflow:'hidden',
 backgroundColor:'#fff',borderWidth:2.5,borderColor:'#ffffffc0',}}>
 <LayerFill fill={require('../assets/images/gen2.jpeg')}/>
 </View>
 </Pad>
 <Pad direction="row" justify="flex-start" align="center" gap={width*.035}>
 <TextMed size={width*.13} opacity={.55}>every art</TextMed>
 <View style={{width:width*.25,height:height*.07,borderRadius:100,overflow:'hidden',
 backgroundColor:'#fff',borderWidth:2.5,borderColor:'#ffffffc0',}}>
 <LayerFill fill={require('../assets/images/gen3.png')}/>
 </View>
 </Pad>
 <View>
 <TextMed size={width*.13} opacity={.55}>work now</TextMed>
 </View>

 </View>
 </Pad>
 </View>
 </Pad>
 <Pad px={width*.07} style={[styles.flex,styles.wFull,styles.absolute,{bottom:height*.07}]}>
 <TouchableOpacity style={[styles.flex,styles.wFull]} onPress={()=>{showSideDrawer();setSideDrawer(<OnboardingScreen/>)}}>
 <LiquidGlassView radius={100} py={height*.018} width={'100%'} style={[styles.center]}/>
 </TouchableOpacity>
 </Pad>

 <Pad px={width*.07} style={[styles.flex,styles.wFull,styles.absolute,{bottom:height*.035}]}>
 <Pad px={width*.07} direction="row" style={[styles.flex,styles.wFull]}>
 <TextMed size={width*.036} opacity={.55}>Already have an account? </TextMed>
 <TouchableOpacity activeOpacity={.5} onPress={()=>{showSideDrawer();setSideDrawer(<LoginScreen/>)}}>
 <TextBold size={width*.036}> Login</TextBold>
 </TouchableOpacity>
 </Pad>
 </Pad>

 <Break py={height*.015}/>

 <Pad px={width*.07} direction="row" style={[styles.flex,styles.wFull]}>
 <TextMed size={width*.036} opacity={.55}>Already have an account? </TextMed>
 <TouchableOpacity activeOpacity={.5} onPress={()=>setSideDrawer(<LoginScreen/>)}>
 <TextBold size={width*.036}> Login</TextBold>
 </TouchableOpacity>
 </Pad>

 </View>
 )
}

export const OnboardingScreen:React.FC = () => {
 const { textColor, textColorV2 } = useThemeContext()
 const { showSideDrawer, hideSideDrawer, setSideDrawer } = useAppContext()
 const { width, height } = Dimensions.get('window')
 const [selectedItem, setSelectedItem] = useState<number | null>(null)
 const { setParentOpacity, setisParentDisabled } = useAppContext()

 const onboardingItems = [
 { icon: <IconWaterDrop width={width*.05} height={width*.05} color={textColorV2}/>, title: 'Beginner',
 description: `I'm just starting out, looking for inspiration` },
 { icon: <IconWrenchTool width={width*.05} height={width*.05} color={textColorV2}/>, title: 'Hobby Artist',
 description: `I create for fun and want to grow my skills` },
 { icon: <IconMonitorDesk width={width*.05} height={width*.05} color={textColorV2}/>, title: 'Professional',
 description: `want refined critique and advanced feedback.` },
 ];

 useEffect(() => {
 setTimeout(() => {
 setParentOpacity(.5);
 setisParentDisabled(true)
 }, 700);
 },[])

 return (
 <View style={[styles.parentLayout]}>
 <Pad direction="column" style={[styles.wFull,styles.alignStart,styles.justifyStart,styles.hFull]}>
 <View style={[styles.sizeFull,styles.alignStart]}>
 <Pad direction="column" px={width*.07} py={70} style={[styles.wFull,styles.alignStart,styles.justifyStart]}>
 <Pad style={[styles.center]} direction="row">
 <View style={[styles.absolute,{left:width*-.02}]}>
 <TouchableOpacity onPress={()=>{hideSideDrawer()}}>
 <LiquidGlassObject radius={100} px={width*.025} py={width*.012} style={[styles.center]}
 touchAction={()=>{hideSideDrawer()}}>
 <TextBold size={width*.035}>Back</TextBold>
 </LiquidGlassObject>
 </TouchableOpacity>
 </View>
 <TextHeavy size={width*.05}>ArtBlock AI&trade;</TextHeavy>
 </Pad>

 <Break py={height*.02}/>
 <View style={[styles.column,{gap:height*.01}]}>
 <TextMed size={width*.06} opacity={.55}>What's your</TextMed>
 <Pad direction="row" justify="flex-start" align="center" gap={width*.035}>
 <TextHeavy size={width*.1} opacity={.9}>Artistic</TextHeavy>
 <View style={{width:width*.3,height:height*.06,borderRadius:100,overflow:'hidden',
 borderWidth:2.5,borderColor:'#ffffffc0',backgroundColor:'#fff'}}>
 <LayerFill fill={require('../assets/images/gen1.jpeg')}/>
 </View>
 </Pad>
 <View>
 <TextHeavy size={width*.09} opacity={.9}>Proficiency Scope</TextHeavy>
 </View>
 <Pad direction="row" justify="flex-start" align="center" gap={width*.035}>
 <TextMed size={width*.07} opacity={.55}>in</TextMed>
 <View style={{width:width*.23,height:height*.055,borderRadius:100,overflow:'hidden',
 backgroundColor:'#fff',borderWidth:2.5,borderColor:'#ffffffc0',}}>
 <LayerFill fill={require('../assets/images/gen2.jpeg')}/>
 </View>
 </Pad>
 <Pad direction="row" justify="flex-start" align="center" gap={width*.035}>
 <TextMed size={width*.07} opacity={.55}>General</TextMed>
 </Pad>
 </View>
 <Break py={height*.015}/>
 <View>
 <View style={[styles.absolute,styles.wFull,{top:0,left:0,flexDirection:'column',gap:height*.016}]}>
 {onboardingItems.map((item, index) => (
 <OnbardingItems
 key={index} 
 icon={item.icon} 
 title={item.title} 
 description={item.description} 
 onPress={() => {setSelectedItem(index);setParentOpacity(1);setisParentDisabled(false)}} 
 fill={selectedItem === index ? 'flex' : 'none'}/>
 ))}
 </View>
 </View>
 </Pad>
 <Pad px={width*.07} style={[styles.flex,styles.wFull,styles.absolute,{bottom:height*.045}]}>

<LiquidGlassObjectFunction 
 radius={100} 
 py={height*.018} 
 width={'100%'} 
 touchAction={async () => {
 if (selectedItem === null) {
 Alert.alert('Selection Required', 'Please select your artistic proficiency level');
 return;
 }
 
 // Get the selected skill level
 const selectedSkill = onboardingItems[selectedItem].title;
 
 try {
 // Save skill level temporarily (we'll send it after registration)
 await AsyncStorage.setItem('pendingSkillLevel', selectedSkill);
 setSideDrawer(<AuthScreen/>);
 } catch (error) {
 console.error('Error saving skill level:', error);
 Alert.alert('Error', 'Something went wrong. Please try again.');
 }
 }}>
 Continue
</LiquidGlassObjectFunction>

 </Pad>
 </View>
 </Pad>
 </View>
 )
}

import { KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';

export const AuthScreen: React.FC = () => {
 const { showSideDrawer, hideSideDrawer, setSideDrawer, setRoute } = useAppContext()
 const { width, height } = Dimensions.get('window')
 const [selectedItem, setSelectedItem] = useState<number | null>(null)
 const [password, setPassword] = useState('');
 const [show, setShow] = useState(false);
 const { setParentOpacity, setisParentDisabled } = useAppContext()

 const [firstName, setFirstName] = useState('');
 const [lastName, setLastName] = useState('');
 const [dateOfBirth, setDateOfBirth] = useState('');
 const [email, setEmail] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [keyboardVisible, setKeyboardVisible] = useState(false);

 useEffect(() => {
 setTimeout(() => {
 setParentOpacity(.5);
 setisParentDisabled(true)
 }, 1000);

 // Keyboard listeners
 const keyboardDidShowListener = Keyboard.addListener(
 'keyboardDidShow',
 () => setKeyboardVisible(true)
 );
 const keyboardDidHideListener = Keyboard.addListener(
 'keyboardDidHide',
 () => setKeyboardVisible(false)
 );

 return () => {
 keyboardDidShowListener.remove();
 keyboardDidHideListener.remove();
 };
 }, [])

 const handleRegister = async () => {
 console.log('=== REGISTER DEBUG ===');
 console.log('First Name:', firstName);
 console.log('Last Name:', lastName);
 console.log('Email:', email);
 console.log('Password:', password);
 console.log('DOB:', dateOfBirth);

 // Validation
 if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !dateOfBirth.trim()) {
 Alert.alert('Missing Information', 'Please fill in all fields');
 return;
 }

 // Email validation
 const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 if (!emailRegex.test(email.trim())) {
 Alert.alert('Invalid Email', 'Please enter a valid email address');
 return;
 }

 // Password validation
 if (password.length < 6) {
 Alert.alert('Weak Password', 'Password must be at least 6 characters long');
 return;
 }

 // Date validation
 const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
 if (!dobRegex.test(dateOfBirth)) {
 Alert.alert('Invalid Date', 'Please enter date in YYYY-MM-DD format (e.g., 1990-01-15)');
 return;
 }

 setIsLoading(true);

 try {
 console.log('Calling register API...');
 const response = await authAPI.register({
 firstName: firstName.trim(),
 lastName: lastName.trim(),
 email: email.trim().toLowerCase(),
 password: password,
 dateOfBirth: dateOfBirth
 });

 console.log('Register response:', response);

 if (response.success) {
 // Get pending skill level from onboarding
 const skillLevel = await AsyncStorage.getItem('pendingSkillLevel');
 
 console.log('Pending skill level:', skillLevel);

 // Set skill level if available
 if (skillLevel) {
 try {
 await authAPI.setSkillLevel(skillLevel);
 await AsyncStorage.removeItem('pendingSkillLevel');
 } catch (error) {
 console.log('Skill level error (non-critical):', error);
 }
 }

 // ✅ SAVE AUTH STATE TO ASYNCSTORAGE
 await AsyncStorage.setItem('isAuthenticated', 'true');
 await AsyncStorage.setItem('userEmail', email.trim().toLowerCase());
 
 // Success - navigate to home
 Alert.alert(
 'Welcome!', 
 `Your account has been created successfully. You have ${response.data.subscription.daysLeft} days of free trial.`,
 [{ 
 text: 'Get Started', 
 onPress: () => {
 setRoute(<Home/>);
 setTimeout(() => hideSideDrawer(), 10);
 }
 }]
 );
 }
 } catch (error: any) {
 console.error('Registration error:', error);
 Alert.alert(
 'Registration Failed', 
 error.message || 'Unable to create account. Please check your internet connection and try again.'
 );
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <View style={[styles.parentLayout]}>
 <KeyboardAvoidingView 
 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
 style={[styles.sizeFull]}
 keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
 >
 <ScrollView 
 contentContainerStyle={{ flexGrow: 1 }}
 keyboardShouldPersistTaps="handled"
 showsVerticalScrollIndicator={false}
 >
 <Pad direction="column" style={[styles.wFull, styles.alignStart, styles.justifyStart]}>
 <View style={[styles.wFull, styles.alignStart]}>
 <Pad direction="column" px={width * .07} py={70} style={[styles.wFull, styles.alignStart, styles.justifyStart]}>
 <Pad style={[styles.center]} direction="row">
 <View style={[styles.absolute, { left: width * -.02 }]}>
 <TouchableOpacity onPress={() => { hideSideDrawer() }}>
 <LiquidGlassObject radius={100} px={width * .025} py={width * .012} style={[styles.center]}
 touchAction={() => { hideSideDrawer() }}>
 <TextBold size={width * .035}>Back</TextBold>
 </LiquidGlassObject>
 </TouchableOpacity>
 </View>
 <TextHeavy size={width * .05}>ArtBlock AI&trade;</TextHeavy>
 </Pad>

 <Break py={height * .02} />
 <View style={[styles.column, { gap: height * .01 }]}>
 <TextBold size={width * .07} opacity={.9}>Personal Information</TextBold>
 <View style={[{ paddingRight: width * .03 }]}>
 <TextMed size={width * .037} opacity={.55}>Enter your full name so we can keep your account accurate and personalized.
 We'll use this information to set things up smoothly for you.</TextMed>
 </View>
 </View>
 <Break py={height * .015} />
 <Pad direction="column" style={[styles.wFull]} gap={height * .02}>
 <SimulatedTextInput 
 placeHolder="First Name" 
 keyboardtype="name-phone-pad"
 value={firstName}
 onChange={(text: string) => {
 console.log('First name changed:', text);
 setFirstName(text);
 }}
 />
 <SimulatedTextInput 
 placeHolder="Last Name" 
 keyboardtype="name-phone-pad"
 value={lastName}
 onChange={(text: string) => {
 console.log('Last name changed:', text);
 setLastName(text);
 }}
 />
 <SimulatedDateTextInput 
 keyboardtype="numbers-and-punctuation"
 value={dateOfBirth}
 onChange={(text: string) => {
 console.log('DOB changed:', text);
 setDateOfBirth(text);
 }}
 />
 <SimulatedTextInput 
 placeHolder="Email address" 
 keyboardtype="email-address"
 value={email}
 onChange={(text: string) => {
 console.log('Email changed:', text);
 setEmail(text);
 }}
 />
 <SimulatedPasswordTextInput 
 keyboardtype="password" 
 secureTextEntry={!show} 
 value={password}
 onPress={() => { setParentOpacity(1); setisParentDisabled(false) }} 
 onChange={(text: string) => {
 console.log('Password changed:', text);
 setPassword(text);
 }}
 />
 </Pad>
 <Break py={height * .015} />

 <Pad px={width * .07} direction="row" style={[styles.flex, styles.wFull]}>
 <TextMed size={width * .036} opacity={.55}>Already have an account? </TextMed>
 <TouchableOpacity activeOpacity={.5} onPress={() => setSideDrawer(<LoginScreen />)}>
 <TextBold size={width * .036}> Login</TextBold>
 </TouchableOpacity>
 </Pad>
 </Pad>
 </View>
 </Pad>
 {!keyboardVisible && (
 <>
 <Pad px={width * .07} direction="row" style={[styles.wFull,styles.absolute,{bottom:height*.13}]}>
 <TextMed size={width * .036} opacity={.55}>By clicking continue, you agree to our</TextMed>
 <TextBold size={width * .036}> Policy</TextBold>
 <TextMed size={width * .036} opacity={.55}> &</TextMed>
 <TextBold size={width * .036}> Terms</TextBold>
 </Pad>
 <Pad px={width * .07} style={[styles.wFull,styles.absolute,{bottom:height*.045}]}>
 <LiquidGlassObjectFunction 
 radius={100} 
 py={height * .018} 
 width={'100%'}
 touchAction={handleRegister}>
 {isLoading ? 'Creating Account...' : 'Continue'}
 </LiquidGlassObjectFunction>
 </Pad>
 </>
 )}
 </ScrollView>
 </KeyboardAvoidingView>
 </View>
 )
}

export const LoginScreen:React.FC = () => {
 const { showSideDrawer, hideSideDrawer, setSideDrawer, setRoute } = useAppContext()
 const { width, height } = Dimensions.get('window')
 const [selectedItem, setSelectedItem] = useState<number | null>(null)
 const [password, setPassword] = useState('');
 const [show, setShow] = useState(false);
 const { setParentOpacity, setisParentDisabled } = useAppContext()

 const [email, setEmail] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
 setTimeout(() => {
 setParentOpacity(.5);
 setisParentDisabled(true)
 }, 1000);
 },[])

const handleLogin = async () => {
 console.log('=== LOGIN DEBUG ===');
 console.log('Email:', email);
 console.log('Password length:', password.length);

 if (!email.trim() || !password.trim()) {
 Alert.alert('Missing Information', 'Please enter email and password');
 return;
 }

 setIsLoading(true);

 try {
 console.log('Calling login API...');
 const response = await authAPI.login(email.trim(), password);

 console.log('Login response:', response);

 if (response.success) {
 // Check subscription status
 const subscriptionInfo = response.data.subscription;
 
 if (!subscriptionInfo.hasAccess) {
 Alert.alert(
 'Subscription Expired',
 'Your trial has ended. Please subscribe to continue using the app.',
 [
 { text: 'Maybe Later', style: 'cancel' },
 { 
 text: 'Subscribe Now', 
 onPress: () => {
 Alert.alert('Info', 'Subscription screen coming soon!');
 }
 }
 ]
 );
 } else {
 // ✅ SAVE AUTH STATE TO ASYNCSTORAGE
 await AsyncStorage.setItem('isAuthenticated', 'true');
 await AsyncStorage.setItem('userEmail', email.trim().toLowerCase());
 
 // Navigate to home
 setRoute(<Home/>);
 setTimeout(() => hideSideDrawer(), 10);
 }
 }
 } catch (error: any) {
 console.error('Login error:', error);
 Alert.alert(
 'Login Failed', 
 error.message || 'Invalid email or password. Please try again.'
 );
 } finally {
 setIsLoading(false);
 }
 };

 const handleForgotPassword = async () => {
 if (!email.trim()) {
 Alert.alert('Email Required', 'Please enter your email address first');
 return;
 }

 try {
 const response = await authAPI.forgotPassword(email.trim());
 
 if (response.success) {
 Alert.alert(
 'Email Sent', 
 'Password reset link has been sent to your email. Please check your inbox.'
 );
 }
 } catch (error: any) {
 Alert.alert('Error', error.message || 'Failed to send reset email');
 }
 };

 return (
 <View style={[styles.parentLayout]}>
 <Pad direction="column" style={[styles.wFull,styles.alignStart,styles.justifyStart,styles.hFull]}>
 <View style={[styles.sizeFull,styles.alignStart]}>
 <Pad direction="column" px={width*.07} py={70} style={[styles.wFull,styles.alignStart,styles.justifyStart]}>
 <Pad style={[styles.center]} direction="row">
 <View style={[styles.absolute,{left:width*-.02}]}>
 <TouchableOpacity onPress={()=>{hideSideDrawer()}}>
 <LiquidGlassObject radius={100} px={width*.025} py={width*.012} style={[styles.center]}
 touchAction={()=>{hideSideDrawer()}}>
 <TextBold size={width*.035}>Back</TextBold>
 </LiquidGlassObject>
 </TouchableOpacity>
 </View>
 <TextHeavy size={width*.05}>ArtBlock AI&trade;</TextHeavy>
 </Pad>

 <Break py={height*.02}/>
 <View style={[styles.column,{gap:height*.01}]}>
 <TextBold size={width*.07} opacity={.9}>Welcome Back</TextBold>
 <View style={[{paddingRight:width*.03}]}>
 <TextMed size={width*.037} opacity={.55}>Let's make sure everything's set up just for you
 login to your account to get started.</TextMed>
 </View>
 </View>
 <Break py={height*.015}/>
 <Pad direction="column" style={[styles.wFull]} gap={height*.02}>
 <SimulatedTextInput 
 placeHolder="Email address" 
 keyboardtype="email-address"
 value={email}
 onChange={(text: string) => {
 console.log('Email changed:', text);
 setEmail(text);
 }}
 />
 <SimulatedPasswordTextInput 
 keyboardtype="password" 
 secureTextEntry={!show} 
 value={password}
 onChange={(text: string) => {
 console.log('Password changed:', text);
 setPassword(text);
 setParentOpacity(1);setisParentDisabled(false)
 }}
 />
 </Pad>

 <Break py={height*.015}/>

 <Pad px={width*.07} direction="row" style={[styles.flex,styles.wFull]}>
 <TextMed size={width*.036} opacity={.55}>Forgot Password? </TextMed>
 <TouchableOpacity activeOpacity={.5} onPress={handleForgotPassword}>
 <TextBold size={width*.036}> Reset</TextBold>
 </TouchableOpacity>
 </Pad>

 </Pad>
 <Pad px={width*.07} direction="row" style={[styles.flex,styles.wFull,styles.absolute,{bottom:height*.13}]}>
 <TextMed size={width*.036} opacity={.55}>By clicking continue, you agree to our</TextMed>
 <TextBold size={width*.036}> Policy</TextBold>
 <TextMed size={width*.036} opacity={.55}> &</TextMed>
 <TextBold size={width*.036}> Terms</TextBold>
 </Pad>
 <Pad px={width*.07} style={[styles.flex,styles.wFull,styles.absolute,{bottom:height*.045}]}>
 <LiquidGlassObjectFunction 
 radius={100} 
 py={height*.018} 
 width={'100%'}
 touchAction={handleLogin}>
 {isLoading ? 'Signing In...' : 'Continue'}
 </LiquidGlassObjectFunction>
 </Pad>
 </View>
 </Pad>
 </View>
 )
}