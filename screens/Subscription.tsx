import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, Linking, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { paymentAPI, userAPI } from '../services/api';
import { TextBold, TextMed, TextHeavy } from '../components/fonts/TextBox';
import { LiquidGlassObjectFunction, Pad, Break } from '../components/elements/Components';
import { styles } from '../components/styles/computed/styles';

interface SubscriptionScreenProps {
 onClose?: () => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onClose }) => {
 const { width, height } = Dimensions.get('window');
 const [subscriptionData, setSubscriptionData] = useState<any>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [isProcessing, setIsProcessing] = useState(false);

 useEffect(() => {
 loadSubscriptionData();
 }, []);

 const loadSubscriptionData = async () => {
 try {
 const response = await userAPI.getSubscriptionStatus();
 if (response.success) {
 setSubscriptionData(response.data);
 }
 } catch (error) {
 console.error('Error loading subscription:', error);
 } finally {
 setIsLoading(false);
 }
 };

 const handleSubscribe = async () => {
 try {
 setIsProcessing(true);
 const response = await paymentAPI.createCheckoutSession();
 
 if (response.success && response.data.url) {
 // Open Stripe checkout in browser
 const supported = await Linking.canOpenURL(response.data.url);
 if (supported) {
 await Linking.openURL(response.data.url);
 } else {
 Alert.alert('Error', 'Cannot open payment page');
 }
 }
 } catch (error: any) {
 Alert.alert('Error', error.message || 'Failed to start checkout');
 } finally {
 setIsProcessing(false);
 }
 };

 const handleManageSubscription = async () => {
 try {
 setIsProcessing(true);
 const response = await paymentAPI.createPortalSession();
 
 if (response.success && response.data.url) {
 const supported = await Linking.canOpenURL(response.data.url);
 if (supported) {
 await Linking.openURL(response.data.url);
 } else {
 Alert.alert('Error', 'Cannot open subscription portal');
 }
 }
 } catch (error: any) {
 Alert.alert('Error', error.message || 'Failed to open subscription portal');
 } finally {
 setIsProcessing(false);
 }
 };

 if (isLoading) {
 return (
 <View style={[styles.parentLayout, styles.center]}>
 <ActivityIndicator size="large" color="#000" />
 </View>
 );
 }

 const isActive = subscriptionData?.hasAccess;
 const isTrialing = subscriptionData?.status === 'trial';
 const daysLeft = subscriptionData?.daysLeft || 0;

 return (
 <View style={[styles.sizeFull]}>
 <ScrollView style={[styles.wFull,styles.hFull]}
 contentContainerStyle={[styles.sizeFull]} showsVerticalScrollIndicator={false}>
 <Pad direction="column" justify='flex-start' px={width*.07} style={[styles.wFull,styles.hFull]}>
 <Break py={height*.025}/>
 <TextHeavy size={width*.08}>Subscription</TextHeavy>
 <Break py={height*.02}/>

 {/* Status Banner */}
 {isTrialing && (
 <View style={[{
 backgroundColor: '#FFF3CD',
 padding: width*.03,
 borderRadius: width*.03,
 marginBottom: height*.02
 }]}>
 <TextBold size={width*.04}>Free Trial Active</TextBold>
 <TextMed size={width*.035} opacity={.7}>
 {daysLeft} days remaining
 </TextMed>
 </View>
 )}

 {isActive && !isTrialing && (
 <View style={[{
 backgroundColor: '#D4EDDA',
 padding: width*.04,
 borderRadius: width*.03,
 marginBottom: height*.02
 }]}>
 <TextBold size={width*.04}>Premium Active</TextBold>
 <TextMed size={width*.035} opacity={.7}>
 You have full access to all features
 </TextMed>
 </View>
 )}

 {!isActive && (
 <View style={[{
 backgroundColor: '#F8D7DA',
 padding: width*.04,
 borderRadius: width*.03,
 marginBottom: height*.02
 }]}>
 <TextBold size={width*.04}>Subscription Expired</TextBold>
 <TextMed size={width*.035} opacity={.7}>
 Subscribe to continue using ArtBlock AI
 </TextMed>
 </View>
 )}

 {/* Features */}
 <View style={[{
 backgroundColor: '#f9f9f9',
 padding: width*.05,
 borderRadius: width*.04,
 marginTop: height*.02
 }]}>
 <TextBold size={width*.05}>Premium Features</TextBold>
 <Break py={height*.01}/>
 <TextMed size={width*.038}>✓ Unlimited AI Conversations</TextMed>
 <TextMed size={width*.038}>✓ Advanced AI Models (GPT-4)</TextMed>
 <TextMed size={width*.038}>✓ Image Generation with DALL-E</TextMed>
 <TextMed size={width*.038}>✓ Upload & Analyze Your Artwork</TextMed>
 <TextMed size={width*.038}>✓ Priority Support</TextMed>
 <TextMed size={width*.038}>✓ Export Chat History</TextMed>
 <Break py={height*.02}/>
 <TextHeavy size={width*.06}>$9.99/month</TextHeavy>
 <TextMed size={width*.032} opacity={.6}>Cancel anytime</TextMed>
 </View>

 <Break py={height*.03}/>

 {/* Action Button */}
 <View style={[styles.absolute,{bottom:height*.04}]}>
 {isActive && !isTrialing ? (
 <LiquidGlassObjectFunction 
 radius={100} 
 py={height*.018} 
 width={'100%'}
 touchAction={handleManageSubscription}>
 {isProcessing ? 'Loading...' : 'Manage Subscription'}
 </LiquidGlassObjectFunction>
 ) : (
 <LiquidGlassObjectFunction 
 radius={100} 
 py={height*.018} 
 width={'100%'}
 touchAction={handleSubscribe}>
 {isProcessing ? 'Loading...' : 'Subscribe Now'}
 </LiquidGlassObjectFunction>
 )}
 </View>

 {onClose && (
 <>
 <Break py={height*.02}/>
 <TouchableOpacity onPress={onClose} style={[styles.center]}>
 <TextMed size={width*.038} opacity={.6}>Maybe Later</TextMed>
 </TouchableOpacity>
 </>
 )}

 </Pad>
 </ScrollView>
 </View>
 );
};