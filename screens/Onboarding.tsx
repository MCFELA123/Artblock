import { BackAction, Break, Pad, PrimaryButton, SimulatedPhoneTextBox, SimulatedTextBox } from "@/components/elements/Components";
import { TextBold, TextHeavy, TextMed } from "@/components/fonts/TextBox";
import { ProfileIcon } from "@/components/icons/Icons";
import { styles } from "@/components/styles/computed/styles";
import { useThemeContext } from "@/components/styles/computed/themes"
import { useAppContext } from "@/context/AppContext";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Home } from "./Home";

export const Register = () => {
 const { textColor, textColorV2 } = useThemeContext();
 const { width, height } = Dimensions.get('window')
 const { hideSideDrawer, setSideDrawer, setRoute } = useAppContext()
 const login = <Login/>
 const home = <Home/>
 return (
 <Pad style={[styles.wFull,styles.hFull,styles.alignStart,styles.justifyStart]} px={width*.08} py={height*.05}>
 <BackAction touchAction={hideSideDrawer}/>
 <View style={[styles.wFull,styles.justify,styles.alignStart,{height:'30%'}]}>
 <Break py={height*.014}/>
 <Pad direction="column" py={height*.013} style={[styles.justify,{borderRadius:width*.015,backgroundColor:textColor}]} px={width*.105}>
 <View style={[styles.absolute]}><TextMed color={textColorV2} size={width*.036}>Payérn beta</TextMed></View>
 </Pad>
 <Pad direction="column" gap={width*.042} style={[styles.alignStart]}>
 <Pad direction="row">
 <View style={[{opacity:.5}]}><TextHeavy size={width*.079} color={textColor}>Create an</TextHeavy></View>
 <View style={[{opacity:1}]}><TextHeavy size={width*.079} color={textColor} opacity={1}> Account</TextHeavy></View>
 </Pad>
 <View style={[styles.absolute]}>
 <Pad direction="row">
 <View style={[{opacity:1}]}><TextHeavy size={width*.082} color={textColor} opacity={1}>now</TextHeavy></View>
 <View style={[{opacity:.5}]}><TextHeavy size={width*.082} color={textColor}> to set-up your</TextHeavy></View>
 </Pad>
 </View>
 <View style={[{opacity:.5}]}><TextHeavy size={width*.078} color={textColor}>wallet and experience.</TextHeavy></View>
 </Pad>
 </View>
 <Break py={height*.008}/>
 <SimulatedTextBox label="First Name" title="Your first name" keyboardType="name-phone-pad"/><Break py={height*.005}/>
 <SimulatedTextBox label="Last Name" title="Your last name" keyboardType="name-phone-pad"/><Break py={height*.005}/>
 <SimulatedPhoneTextBox label="Phone Number" title="+234 (505) 903 860" keyboardType="number-pad" focusable={true} /><Break py={height*.005}/>
 <SimulatedTextBox label="Password" title="Your Password" keyboardType="visible-password" />

 <Break py={height*.0205}/>
 <Pad direction="column" px={10}>
 <Pad style={[styles.wFull]} align="flex-start" justify="center">
 <Pad direction="row">
 <TextMed color={textColor} size={width * .031} opacity={.5} lnh={width*.035}>By creating an account, you aggree to our</TextMed>
 <TouchableOpacity activeOpacity={.3}>
 <TextBold size={width * .031} opacity={1} lnh={width*.035}>  Policy & Terms</TextBold>
 </TouchableOpacity>
 </Pad>
 <TextMed color={textColor} size={width * .031} opacity={.5} lnh={width*.055}>you are entering into a legally binded contract with us.</TextMed>
 </Pad>
 </Pad>
 <Break py={height*.01}/>
 <PrimaryButton touchAction={()=>{setRoute(home);setTimeout(() => {hideSideDrawer()}, 10);}}>Create Account</PrimaryButton>
 <Break py={height*.005}/>
 <Pad style={[styles.center]} direction="row">
 <TextMed color={textColor} size={width * .035} opacity={.5}>Already have an account?</TextMed>
 <TouchableOpacity activeOpacity={.3} onPress={()=>{setSideDrawer(login)}}>
 <TextBold size={width * .035} opacity={1}>  Login</TextBold>
 </TouchableOpacity>
 </Pad>
 </Pad>
 )
}




export const Login = () => {
 const { textColor, textColorV2 } = useThemeContext();
 const { width, height } = Dimensions.get('window')
 const { hideSideDrawer, setSideDrawer } = useAppContext()
 const register = <Register/>
 return (
 <Pad style={[styles.wFull,styles.hFull,styles.alignStart,styles.justifyStart]} px={width*.08} py={height*.05}>
 <BackAction touchAction={hideSideDrawer}/>
 <View style={[styles.wFull,styles.justify,styles.alignStart,{height:'30%'}]}>
 <Break py={height*.013}/>
 <Pad direction="column" py={height*.013} style={[styles.justify,{borderRadius:width*.015,backgroundColor:textColor}]} px={width*.105}>
 <View style={[styles.absolute]}><TextMed color={textColorV2} size={width*.036}>Payérn beta</TextMed></View>
 </Pad>
 <Pad direction="column" gap={width*.042} style={[styles.alignStart]}>
 <Pad direction="row">
 <View style={[{opacity:.5}]}><TextHeavy size={width*.081} color={textColor}>Welcome </TextHeavy></View>
 <View style={[{opacity:1}]}><TextHeavy size={width*.081} color={textColor} opacity={1}> Back!</TextHeavy></View>
 </Pad>
 <View style={[styles.absolute]}>
 <Pad direction="row">
 <View style={[{opacity:1}]}><TextHeavy size={width*.075} color={textColor} opacity={1}>Login</TextHeavy></View>
 <View style={[{opacity:.5}]}><TextBold size={width*.075} color={textColor}> to your account</TextBold></View>
 </Pad>
 </View>
 <View style={[{opacity:.5}]}><TextBold size={width*.075} color={textColor}>to get started.</TextBold></View>
 </Pad>
 </View>
 <Break py={height*.015}/>
 <SimulatedPhoneTextBox label="Phone Number" title="(505) 903 8609" keyboardType="number-pad" focusable={true} />
 <Break py={height*.01}/>
 <SimulatedTextBox label="Password" title="Your Password" keyboardType="visible-password" />
 <Break py={height*.006}/>
 <Pad style={[styles.center]} direction="row">
 <TextMed color={textColor} size={width * .035} opacity={.5}>Forgot password?</TextMed>
 <TouchableOpacity activeOpacity={.3}>
 <TextBold size={width * .035} opacity={1}>  Reset it</TextBold>
 </TouchableOpacity>
 </Pad>
 <Break py={height*.0825}/>
 <Pad direction="column" px={10}>
 <Pad style={[styles.wFull]} align="flex-start" justify="center">
 <Pad direction="row" justify="center" align="center">
 <TextMed color={textColor} size={width * .031} opacity={.5} lnh={width*.035}>By login to your account, you aggree to our</TextMed>
 <TouchableOpacity activeOpacity={.3}>
 <TextBold size={width * .031} opacity={1} lnh={width*.035}>  Policy & Terms</TextBold>
 </TouchableOpacity>
 </Pad>
 <TextMed color={textColor} size={width * .031} opacity={.5} lnh={width*.055}>you are entering into a legally binded contract with us.</TextMed>
 </Pad>
 </Pad>
 <Break py={height*.01}/>
 <PrimaryButton>Login</PrimaryButton>
 <Break py={height*.005}/>
 <Pad style={[styles.center]} direction="row">
 <TextMed color={textColor} size={width * .035} opacity={.5}>Don't have an account?</TextMed>
 <TouchableOpacity activeOpacity={.3} onPress={()=>{setSideDrawer(register)}}>
 <TextBold size={width * .035} opacity={1}>  Signup</TextBold>
 </TouchableOpacity>
 </Pad>
 </Pad>
 )
}

