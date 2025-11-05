import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator, Dimensions } from 'react-native';
import { authAPI, userAPI, paymentAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextBold, TextMed, TextHeavy } from '../components/fonts/TextBox';
import { Break, LiquidGlassNode } from '../components/elements/Components';
import { styles } from '../components/styles/computed/styles';
import { useAppContext } from '../context/AppContext';
import { WelcomeScreen } from './WelcomScreen';
import { Blury } from '../components/elements/Blurry';
import { IconAddCircle, IconArrowRight, IconBell, IconBriefcase, IconCalendarUser, IconChatCircle, IconDocument, IconGlobeRotate, IconHelpCircle, IconInfo, IconLanguage, IconLayers, IconLogout, IconMention, IconPrivacy, IconProfile, IconStar, IconSupport } from '../components/icons/Icons';

export const UserProfileScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
 const { width, height } = Dimensions.get('window');
 const [userData, setUserData] = useState<any>(null);
 const [subscriptionData, setSubscriptionData] = useState<any>(null);
 const { setRoute, hideBottomDrawer } = useAppContext();

 useEffect(() => {
 loadUserData();
 }, []);

 const loadUserData = async () => {
 try {
 const [userResponse, subResponse] = await Promise.all([
 userAPI.getProfile(),
 userAPI.getSubscriptionStatus()
 ]);

 if (userResponse.success) {
 setUserData(userResponse.data.user);
 }
 if (subResponse.success) {
 setSubscriptionData(subResponse.data);
 }
 } catch (error) {
 console.error('Error loading user data:', error);
 }
 };

 const handleUpdateSkillLevel = async (newLevel: string) => {
 try {
 const response = await userAPI.updateSkillLevel(newLevel);
 if (response.success) {
 setUserData(response.data.user);
 Alert.alert('Success', 'Skill level updated successfully');
 }
 } catch (error: any) {
 Alert.alert('Error', error.message || 'Failed to update skill level');
 }
 };

 const handleSignOut = () => {
 Alert.alert(
 'Sign Out',
 'Are you sure you want to sign out?',
 [
 { text: 'Cancel', style: 'cancel' },
 {
 text: 'Sign Out',
 style: 'destructive',
 onPress: async () => {
 try {
 await AsyncStorage.removeItem('isAuthenticated');
 await AsyncStorage.removeItem('userEmail');
 await authAPI.logout();
 
 onClose();
 hideBottomDrawer();
 
 setTimeout(() => {
 setRoute(<WelcomeScreen/>);
 }, 300);
 } catch (error) {
 console.error('Sign out error:', error);
 onClose();
 hideBottomDrawer();
 setTimeout(() => {
 setRoute(<WelcomeScreen/>);
 }, 300);
 }
 }
 }
 ]
 );
 };

 const handleManageSubscription = async () => {
 try {
 const response = await paymentAPI.createPortalSession();
 if (response.success && response.data.url) {
 const { Linking } = require('react-native');
 await Linking.openURL(response.data.url);
 }
 } catch (error: any) {
 Alert.alert('Error', error.message || 'Failed to open subscription portal');
 }
 };

 // Reusable Components
 const MenuItem: React.FC<{
 icon: React.ReactNode;
 title: string;
 subtitle?: string;
 onPress?: () => void;
 destructive?: boolean;
 hideChevron?: boolean;
 showBadge?: boolean;
 badgeText?: string;
 }> = ({ icon, title, subtitle, onPress, destructive, hideChevron, showBadge, badgeText }) => (
 <TouchableOpacity
 activeOpacity={0.6}
 onPress={onPress}
 style={[{position:'relative'}]}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 <Blury height={'100%'} background={'#ffffff50'}/>
 </View>
 <View style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.009,
 paddingLeft: width * 0.04,
 paddingRight: width * 0.025,
 }]}>
 <TextBold size={width * 0.055}>{icon}</TextBold>
 <View style={[{flex: 1,marginBottom:height*.002,marginLeft: width * 0.03}]}>
 <TextMed 
 size={width * 0.042} 
 color={destructive ? '#FF3B30' : '#000'}>
 {title}
 </TextMed>
 {subtitle && (
 <TextMed size={width * 0.032} opacity={0.5}>
 {subtitle}
 </TextMed>
 )}
 </View>
 {showBadge && badgeText && (
 <View style={[{
 backgroundColor: '#FF3B30',
 paddingHorizontal: width * 0.02,
 paddingVertical: height * 0.003,
 borderRadius: width * 0.03,
 marginRight: width * 0.02,
 }]}>
 <TextBold size={width * 0.028} color="#fff">
 {badgeText}
 </TextBold>
 </View>
 )}
 {!hideChevron && (
 <IconArrowRight width={width*.055} height={width*.055} opacity={.7} strokeWidth={2.3}/>
 )}
 </View>
 </TouchableOpacity>
 );

 const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
 <View style={[{
 paddingHorizontal: width * 0.04,
 paddingTop: height * 0.025,
 paddingBottom: height * 0.01,
 }]}>
 <TextBold size={width * 0.032} opacity={0.6}>
 {title.toUpperCase()}
 </TextBold>
 </View>
 );

 const Separator = () => (
 <View style={[{
 height: 0.5,
 backgroundColor: '#ffffffff',
 }]} />
 );

 const SectionSeparator = () => (
 <View style={[{height: height * 0.03}]} />
 );

 if (!userData) {
 return (
 <View style={[styles.parentLayout, styles.center]}>
 <ActivityIndicator size={'large'} color={'#000000'}/>
 </View>
 );
 }

 const trialDaysLeft = subscriptionData?.status === 'trial' ? subscriptionData?.daysLeft : null;
 const showTrialBadge = trialDaysLeft !== null && trialDaysLeft <= 3;

 return (
 <>
 <ScrollView 
 style={[styles.absolute, styles.wFull, styles.hFull, {
 paddingTop: height * 0.09,
 paddingHorizontal: width * .05,
 }]}
 showsVerticalScrollIndicator={false}>
 <TouchableOpacity style={[styles.sizeFull]} activeOpacity={1}/>
 {/* Profile Header */}
 <View style={[{
 alignItems: 'center',
 paddingVertical: height * 0.03,
 }]}>
 <Image 
 source={require("../assets/images/userfemale.png")}
 style={[{
 width: width * 0.22,
 height: width * 0.22,
 borderRadius: width * 0.11,
 }]}
 />
 <Break py={height * 0.01} />
 <TextBold size={width * 0.055}>
 {userData.firstName} {userData.lastName}
 </TextBold>
 <TextMed size={width * 0.038} opacity={0.6}>
 {userData.email}
 </TextMed>
 </View>

 <SectionSeparator />

 {/* Subscription Section */}
 <View style={[{overflow:'hidden',borderRadius:width*.035,position:'relative'}]}>
 <MenuItem
 icon={<IconAddCircle width={width*.05} height={width*.05} strokeWidth={2}/>}
 title={subscriptionData?.status === 'trial' ? 'Free Trial' : 
 subscriptionData?.hasAccess ? 'Premium' : 'Subscribe'}
 subtitle={subscriptionData?.status === 'trial' 
 ? `${subscriptionData.daysLeft} days remaining`
 : subscriptionData?.hasAccess 
 ? 'All features unlocked'
 : 'Upgrade to Premium'}
 onPress={handleManageSubscription}
 showBadge={showTrialBadge}
 badgeText={showTrialBadge ? `${trialDaysLeft}d` : ''}
 />
 </View>

 <SectionSeparator />

 {/* Account Section */}
 <SectionHeader title="Account" />
 <View style={[{overflow:'hidden',borderRadius:width*.035}]}>
 <MenuItem
 icon={<IconProfile width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Personal Information"
 subtitle={`${userData.firstName} ${userData.lastName}`}
 onPress={() => Alert.alert('Edit Profile', 'Coming soon')}
 />
 <Separator />
 <MenuItem
 icon={<IconLayers width={width*.05} height={width*.05} strokeWidth={2.1}/>}
 title="Skill Level"
 subtitle={userData.skillLevel?.charAt(0).toUpperCase() + userData.skillLevel?.slice(1)}
 onPress={() => {
 Alert.alert('Skill Level', 'Update your artistic skill level', [
 { text: 'Cancel', style: 'cancel' },
 { text: 'Beginner', onPress: () => handleUpdateSkillLevel('beginner') },
 { text: 'Intermediate', onPress: () => handleUpdateSkillLevel('intermediate') },
 { text: 'Advanced', onPress: () => handleUpdateSkillLevel('advanced') },
 { text: 'Expert', onPress: () => handleUpdateSkillLevel('expert') },
 ]);
 }}
 />
 <Separator />
 <MenuItem
 icon={<IconCalendarUser width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Member Since"
 subtitle={new Date(userData.createdAt).toLocaleDateString('en-US', { 
 year: 'numeric', 
 month: 'long', 
 day: 'numeric' 
 })}
 hideChevron
 />
 </View>

 <SectionSeparator />

 {/* Preferences Section */}
 <SectionHeader title="Preferences" />
 <View style={[{overflow:'hidden',borderRadius:width*.035,position:'relative'}]}>
 <MenuItem
 icon={<IconBell width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Notifications"
 onPress={() => Alert.alert('Notifications', 'Coming soon')}
 />
 <Separator />
 <MenuItem
 icon={<IconLanguage width={width*.05} height={width*.05} strokeWidth={2.1}/>}
 title="Language"
 subtitle="English"
 onPress={() => Alert.alert('Language', 'More languages coming soon')}
 />
 </View>

 <SectionSeparator />

 {/* Content Section */}
 <SectionHeader title="Content" />
 <View style={[{overflow:'hidden',borderRadius:width*.035,position:'relative'}]}>
 <MenuItem
 icon={<IconChatCircle width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Chat History"
 subtitle={`${userData.aiRequestsCount || 0} conversations`}
 onPress={() => Alert.alert('Chat History', 'View in main screen')}
 />
 <Separator />
 <MenuItem
 icon={<IconBriefcase width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="My Artwork"
 onPress={() => Alert.alert('My Artwork', 'Coming soon')}
 />
 <Separator />
 <MenuItem
 icon={<IconGlobeRotate width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Analytics"
 onPress={() => Alert.alert('Analytics', 'Coming soon')}
 />
 </View>

 <SectionSeparator />

 {/* Support Section */}
 <SectionHeader title="Support" />
 <View style={[{overflow:'hidden',borderRadius:width*.035,position:'relative'}]}>
 <MenuItem
 icon={<IconHelpCircle width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Help & FAQ"
 onPress={() => Alert.alert('Help', 'Visit support.artblock.ai')}
 />
 <Separator />
 <MenuItem
 icon={<IconSupport width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Contact Support"
 onPress={() => Alert.alert('Contact', 'Email: support@artblock.ai')}
 />
 <Separator />
 <MenuItem
 icon={<IconStar width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Rate ArtBlock AI"
 onPress={() => Alert.alert('Rate App', 'Thank you for your support!')}
 />
 <Separator />
 <MenuItem
 icon={<IconPrivacy width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Privacy Policy"
 onPress={() => Alert.alert('Privacy', 'View privacy policy')}
 />
 <Separator />
 <MenuItem
 icon={<IconDocument width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Terms of Service"
 onPress={() => Alert.alert('Terms', 'View terms of service')}
 />
 </View>

 <SectionSeparator />

 {/* About Section */}
 <SectionHeader title="About" />
 <View style={[{overflow:'hidden',borderRadius:width*.035,position:'relative'}]}>
 <MenuItem
 icon={<IconInfo width={width*.06} height={width*.06} strokeWidth={2.1}/>}
 title="Version"
 subtitle="1.0.0"
 hideChevron
 />
 <Separator />
 <MenuItem
 icon={<IconLanguage width={width*.05} height={width*.05} strokeWidth={2.1}/>}
 title="Website"
 subtitle="artblock.ai"
 onPress={() => Alert.alert('Website', 'Visit artblock.ai')}
 />
 <Separator />
 <MenuItem
 icon={<IconMention width={width*.05} height={width*.05} strokeWidth={2.1}/>}
 title="Follow Us"
 subtitle="@artblock_ai"
 onPress={() => Alert.alert('Social', 'Follow us on social media')}
 />
 </View>

 <SectionSeparator />

 {/* Sign Out */}
 <View style={[{overflow:'hidden',borderRadius:width*.035,position:'relative'}]}>
 <MenuItem
 icon={<IconLogout width={width*.05} height={width*.05} strokeWidth={2.1}/>}
 title="Sign Out"
 onPress={handleSignOut}
 destructive={true}
 hideChevron={true}
 />
 </View>
 <View style={[{height: height * 0.05}]} />
 </ScrollView>

 {/* Header */}
 <View style={[{
 paddingLeft: width * .05,
 paddingRight: width * .04,
 paddingVertical: height * .016,
 flexDirection: 'row',
 justifyContent: 'space-between',
 alignItems: 'center',
 }]}>
 <TextBold size={width * 0.045}>Profile</TextBold>

 <View style={[{position:'relative'}]}>
 <LiquidGlassNode height={height*.04} radius={width*1} activeOpacity={.5} touchAction={hideBottomDrawer}>
 <View style={[styles.center,styles.hFull,{paddingHorizontal:width*.04}]}>
 <TextBold size={width * 0.035} color="#000">Done</TextBold>
 </View>
 </LiquidGlassNode>
 </View>
 </View>
 </>
 );
};