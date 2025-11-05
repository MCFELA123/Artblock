import { Dimensions, ScrollView, TextInput, TouchableOpacity, View, Image, Alert, Clipboard, Modal, ActionSheetIOS, Platform, Share, ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent, Animated as RNAnimated } from "react-native"
import { useThemeContext } from "../components/styles/computed/themes"
import { useRef, useState, useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import { Break, LiquidGlassNode, LiquidGlassObject, OnbardingItems, Pad, SimulatedView, UserProfile } from "../components/elements/Components"
import { styles } from "../components/styles/computed/styles"
import { TextMed, TextBold, TextHeavy } from "../components/fonts/TextBox"
import { IconPlus, IconVoice, IconWaterDrop, IconWrenchTool, IconHistory, IconSend, IconChevronDown, IconThumbsUp, IconThumbsUpV2, IconThumbsDown, IconThumbsDownV2, IconRefresh, IconCopy, IconCancel } from "../components/icons/Icons"
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import * as Haptics from 'expo-haptics'
import { Blury } from "../components/elements/Blurry"
import * as FileSystem from 'expo-file-system/legacy'
import * as MediaLibrary from 'expo-media-library'
import { Text } from "react-native"
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler'
import { buildSystemPrompt, UserLevel, Mode } from './prompts'
import { chatAPI, paymentAPI, userAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionScreen } from "./Subscription"
import { UserProfileScreen } from "./UserProfile"
import { WelcomeScreen } from "./WelcomScreen"

interface Message {
 id: string
 text: string
 isUser: boolean
 timestamp: Date
 attachments?: Array<{ uri: string; type: string; name: string }>
 generatedImage?: string
 displayText?: string
 isTyping?: boolean
 replyTo?: {
 id: string
 text: string
 isUser: boolean
 }
}

interface ChatHistory {
 id: string
 title: string
 messages: Message[]
 timestamp: Date
 mode: 'inspire' | 'reflect'
}

interface ContextMenuPosition {
 x: number
 y: number
 width: number
 height: number
}

// Replace with your OpenAI API key

export const Home: React.FC = () => {
 const { textColor, textColorV2 } = useThemeContext()
 const {
 subTextInputTranslateY,
 subTextInputOpacity,
 chatBoxHelperIndex,
 chatBoxHelperOpacity,
 chatBoxTranslateY,
 defTextInputIndex,
 defTextInputOpacity,
 subTextInputPointerEvents,
 simulateChatboxExpand,
 simulateChatboxcollapse,
 simulateChatboxcollapseWithValue,
 hideBottomDrawer,
 showBottomDrawer,
 setBottomDrawer,
 setRoute
 } = useAppContext()

 const { width, height } = Dimensions.get("window")
 const [subTextInputValue, setSubTextInputValue] = useState("")
 const [defTextInputValue, setDefTextInputValue] = useState("")
 const [messages, setMessages] = useState<Message[]>([])
 const [showChatScreen, setShowChatScreen] = useState(false)
 const [chatMode, setChatMode] = useState<Mode>('inspire')
 const [userLevel, setUserLevel] = useState<UserLevel>('hobby')
 const [isAiTyping, setIsAiTyping] = useState(false)
 const [imagePreview, setImagePreview] = useState<string | null>(null)
 const [showImageModal, setShowImageModal] = useState(false)
 const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
 const [showMessageOptions, setShowMessageOptions] = useState(false)
 const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition | null>(null)
 const [showHistoryModal, setShowHistoryModal] = useState(false)
 const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
 const [currentChatId, setCurrentChatId] = useState<string | null>(null)
 const [isGeneratingImage, setIsGeneratingImage] = useState(false)
 const [pendingImages, setPendingImages] = useState<Array<{ uri: string; name: string }>>([])
 const [showScrollButton, setShowScrollButton] = useState(false)
 const [isImageLoading, setIsImageLoading] = useState<{ [key: string]: boolean }>({})
 const [imageScale, setImageScale] = useState(1)
 const [showUserProfile, setShowUserProfile] = useState(false)
 const [replyingTo, setReplyingTo] = useState<Message | null>(null)
 const [swipedMessageId, setSwipedMessageId] = useState<string | null>(null)
 const [subInputHeight, setSubInputHeight] = useState(height * 0.04)
 const [defInputHeight, setDefInputHeight] = useState(height * 0.04)
 const [isFinished, setIsFinished] = useState(false)
 const [chatBoxHeight, setChatBoxHeight] = useState(height * 0.09)
 const [messageFeedback, setMessageFeedback] = useState<{ [key: string]: 'up' | 'down' | null }>({})
 const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

 const MAX_IMAGES = 5
 const MIN_INPUT_HEIGHT = height * 0.04
 const MAX_INPUT_HEIGHT = height * 0.15
 const BASE_CHATBOX_HEIGHT = height * 0.09
 const CHATBOX_PADDING = height * 0.05

 const messageOptionScale = useSharedValue(1)
 const messageOptionOpacity = useSharedValue(0)
 const contextMenuScale = useSharedValue(0.8)
 const contextMenuOpacity = useSharedValue(0)
 const historyModalScale = useSharedValue(1)
 const historyModalOpacity = useSharedValue(0)
 const scrollButtonOpacity = useSharedValue(0)
 const scrollButtonY = useSharedValue(7)
 const scrollButtonScale = useSharedValue(.9)
 const scrollButtonZIndex = useSharedValue(-99)
 const modeTogglePosition = useSharedValue(0)
 const userProfileScale = useSharedValue(1)
 const userProfileOpacity = useSharedValue(0)

 const subTextInputRef = useRef<TextInput>(null)
 const defTextInputRef = useRef<TextInput>(null)
 const scrollViewRef = useRef<ScrollView>(null)
 const messageRefs = useRef<{ [key: string]: View | null }>({})
 const messageSwipeX = useRef<{ [key: string]: RNAnimated.Value }>({})
 const lastScrollY = useRef(0)
 const isScrollingDown = useRef(true)
 const isUserScrolling = useRef(false)
 const scrollContentHeight = useRef(0)
 const scrollViewHeight = useRef(0)

 const messageSendScale = useSharedValue(1)
 const messageSendOpacity = useSharedValue(0)
 const messageSendTranslateY = useSharedValue(0)

 const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
 const currentTypingMessageRef = useRef<string | null>(null)

 const chatBoxHelperAnimatedStyle = useAnimatedStyle(() => ({
 opacity: chatBoxHelperOpacity.value,
 zIndex: chatBoxHelperIndex,
 }))

 const chatBoxAnimatedStyle = useAnimatedStyle(() => ({
 bottom: chatBoxTranslateY.value
 }))

 const subTextInputAnimatedStyle = useAnimatedStyle(() => ({
 marginBottom: subTextInputTranslateY.value,
 opacity: subTextInputOpacity.value,
 }))

 const defTextInputAnimatedStyle = useAnimatedStyle(() => ({
 opacity: defTextInputOpacity.value,
 zIndex: defTextInputIndex,
 }))

 const messageSendAnimatedStyle = useAnimatedStyle(() => ({
 transform: [
 { scale: messageSendScale.value },
 { translateY: messageSendTranslateY.value }
 ],
 opacity: messageSendOpacity.value,
 }))

 const contextMenuAnimatedStyle = useAnimatedStyle(() => ({
 transform: [{ scale: contextMenuScale.value }],
 opacity: contextMenuOpacity.value,
 }))

 const historyModalAnimatedStyle = useAnimatedStyle(() => ({
 transform: [{ scale: historyModalScale.value }],
 opacity: historyModalOpacity.value,
 }))

 const scrollButtonAnimatedStyle = useAnimatedStyle(() => ({
 transform: [{translateY:scrollButtonY.value},{scale:scrollButtonScale.value}],
 opacity: scrollButtonOpacity.value,
 zIndex: scrollButtonZIndex.value,
 }))

 const modeToggleAnimatedStyle = useAnimatedStyle(() => {
 const modes = ['inspire', 'reflect', 'analyze', 'brainstorm']
 const currentIndex = modes.indexOf(chatMode)
 const translateX = (width * 0)
 
 return {
 transform: [{ translateX: withSpring(translateX, { damping: 15, stiffness: 200 }) }]
 }
 })

 const userProfileAnimatedStyle = useAnimatedStyle(() => ({
 transform: [{ scale: userProfileScale.value }],
 opacity: userProfileOpacity.value,
 }))

const typewriterEffect = (fullText: string, messageId: string) => {
 if (typingIntervalRef.current) {
 clearInterval(typingIntervalRef.current)
 }

 currentTypingMessageRef.current = messageId
 let currentIndex = 0
 const words = fullText.split(' ')
 const wordsPerWrite = 7
 let hapticCount = 0
 
 const typeNextWord = () => {
 if (currentTypingMessageRef.current !== messageId) {
 if (typingIntervalRef.current) {
 clearInterval(typingIntervalRef.current)
 }
 return
 }

 if (currentIndex < words.length) {
 const displayText = words.slice(0, Math.min(currentIndex + wordsPerWrite, words.length)).join(' ')
 
 setMessages(prev => prev.map(msg => 
 msg.id === messageId 
 ? { ...msg, displayText, isTyping: true }
 : msg
 ))
 
 // Add 5 haptic feedbacks during typing
 if (hapticCount < 5) {
 const triggerAt = Math.floor(words.length / 5) * (hapticCount + 1)
 if (currentIndex >= triggerAt) {
 Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium)
 hapticCount++
 }
 }
 
 currentIndex += wordsPerWrite
 
 if (!isUserScrolling.current) {
 setTimeout(() => {
 scrollViewRef.current?.scrollToEnd({ animated: true })
 }, 0)
 }
 } else {
 if (typingIntervalRef.current) {
 clearInterval(typingIntervalRef.current)
 }
 setMessages(prev => prev.map(msg => 
 msg.id === messageId 
 ? { ...msg, displayText: fullText, isTyping: false }
 : msg
 ))
 setIsAiTyping(false)
 }
 }

 typingIntervalRef.current = setInterval(typeNextWord, 30)
}

const handleStopGeneration = () => {
 if (typingIntervalRef.current) {
 clearInterval(typingIntervalRef.current)
 }
 
 setMessages(prev => prev.map(msg => 
 msg.isTyping ? { ...msg, isTyping: false, displayText: msg.displayText || msg.text } : msg
 ))
 
 setIsAiTyping(false)
 Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
}

 useEffect(() => {
 return () => {
 if (typingIntervalRef.current) {
 clearInterval(typingIntervalRef.current)
 }
 }
 }, [])

 useEffect(() => {
 const replyPreviewHeight = replyingTo ? height * 0.06 : 0
 const pendingImagesHeight = pendingImages.length > 0 ? width * 0.25 + height * 0.025 : 0
 const activeInputHeight = subInputHeight > MIN_INPUT_HEIGHT ? subInputHeight : defInputHeight
 const bottomControlsHeight = height * 0.055
 
 const totalHeight = BASE_CHATBOX_HEIGHT + (activeInputHeight - MIN_INPUT_HEIGHT) + replyPreviewHeight + pendingImagesHeight + bottomControlsHeight
 const maxChatBoxHeight = height * 0.5
 
 setChatBoxHeight(Math.min(totalHeight, maxChatBoxHeight))
 }, [replyingTo, pendingImages.length])

const callOpenAI = async (userMessage: string, imageUris?: string[], documentUri?: string, replyToMessage?: Message): Promise<{ text: string; imageUrl?: string }> => {
  try {
    const finishedKeywords = ['finished', 'done', 'complete', 'final', "that's it"]
    const userSaysFinished = finishedKeywords.some(kw => userMessage.toLowerCase().includes(kw))
    
    if (userSaysFinished) {
      setIsFinished(true)
    }

    let conversationHistory = messages.slice(-8).map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }))

    // Build system prompt using your prompt system
    const hasImage = (imageUris && imageUris.length > 0) || false
    const systemPrompt = buildSystemPrompt(
      userLevel as UserLevel, 
      chatMode as Mode, 
      hasImage, 
      isFinished
    )

    let content: any = userMessage

    if (replyToMessage) {
      const replyContext = replyToMessage.isUser 
        ? `The user previously said: "${replyToMessage.text}"\n\nNow they are saying: ${userMessage}`
        : `You previously said: "${replyToMessage.text}"\n\nThe user is now responding: ${userMessage}`
      
      content = replyContext
    }

    if (imageUris && imageUris.length > 0) {
      const imageContents = await Promise.all(
        imageUris.map(async (uri) => {
          const base64Image = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
          })
          return {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: 'high'
            }
          }
        })
      )
      
      content = [
        { type: 'text', text: typeof content === 'string' ? content : userMessage },
        ...imageContents
      ]
    }

    if (documentUri && (!imageUris || imageUris.length === 0)) {
      try {
        const fileContent = await FileSystem.readAsStringAsync(documentUri, {
          encoding: 'utf8',
        })
        const textContent = typeof content === 'string' ? content : userMessage
        content = `${textContent}\n\nDocument content:\n${fileContent.substring(0, 4000)}`
      } catch (error) {
        const textContent = typeof content === 'string' ? content : userMessage
        content = `${textContent}\n\n[Document uploaded but could not be read as text. Please analyze based on context.]`
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${'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'}`,
      },
      body: JSON.stringify({
        model: (imageUris && imageUris.length > 0) ? 'gpt-4o' : 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content }
        ],
        max_tokens: (imageUris && imageUris.length > 0) ? 1500 : 1000,
        temperature: chatMode === 'inspire' ? 0.8 : 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API request failed')
    }

    const data = await response.json()
    const aiText = data.choices[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again."
    
    if (aiText.includes('GENERATE_IMAGE:')) {
      const promptMatch = aiText.match(/GENERATE_IMAGE:\s*(.+?)(?:\n|$)/s)
      if (promptMatch) {
        const imagePrompt = promptMatch[1].trim()
        const imageUrl = await generateImage(imagePrompt)
        
        const textWithoutPrompt = aiText.replace(/GENERATE_IMAGE:.+?(?:\n|$)/s, '').trim()
        
        return {
          text: textWithoutPrompt || "Here's the image I generated for you:",
          imageUrl: imageUrl || undefined
        }
      }
    }
    
    return { text: aiText }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    Alert.alert('Error', 'Failed to get AI response. Please check your connection and try again.')
    return { text: "I'm having trouble connecting right now. Please try again in a moment." }
  }
}

 const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    setIsGeneratingImage(true);
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error?.message || 'Image generation failed';
      
      if (errorMessage.includes('billing') || errorMessage.includes('limit')) {
        Alert.alert(
          'Billing Limit Reached',
          'Your OpenAI account has reached its billing limit. Please add billing at platform.openai.com',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Image Generation Error', errorMessage);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data[0]?.url || null;
  } catch (error) {
    console.error('Image Generation Error:', error);
    return null;
  } finally {
    setIsGeneratingImage(false);
  }
 };

 const saveImageToGallery = async (uri: string) => {
 try {
 const { status } = await MediaLibrary.requestPermissionsAsync()
 
 if (status !== 'granted') {
 Alert.alert('Permission Required', 'Please grant media library permissions to save images.')
 return
 }

 await MediaLibrary.saveToLibraryAsync(uri)
 Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
 Alert.alert('Success', 'Image saved to gallery!')
 } catch (error) {
 console.error('Save error:', error)
 Alert.alert('Error', 'Failed to save image to gallery.')
 }
 }

 const animateMessageSend = (callback: () => void) => {
 messageSendScale.value = withSpring(0.95, { damping: 15 })
 messageSendOpacity.value = withTiming(0.7, { duration: 200 })
 messageSendTranslateY.value = withTiming(-30, { duration: 300 })

 setTimeout(() => {
 callback()
 messageSendScale.value = withSpring(1)
 messageSendOpacity.value = withTiming(1, { duration: 200 })
 messageSendTranslateY.value = withTiming(0, { duration: 300 })
 }, 300)
 }

const saveChatHistory = async (msgs: Message[]) => {
  if (msgs.length === 0) return;

  const chatId = currentChatId || Date.now().toString();
  const firstUserMessage = msgs.find(m => m.isUser)?.text || 'New Chat';
  const title = firstUserMessage.substring(0, 50) + (firstUserMessage.length > 50 ? '...' : '');

  // Save locally first (with original URIs)
  const existingIndex = chatHistories.findIndex(h => h.id === chatId);
  
  const updatedHistory: ChatHistory = {
    id: chatId,
    title,
    messages: msgs,
    timestamp: new Date(),
    mode: chatMode
  };

  if (existingIndex >= 0) {
    const updated = [...chatHistories];
    updated[existingIndex] = updatedHistory;
    setChatHistories(updated);
  } else {
    setChatHistories(prev => [updatedHistory, ...prev]);
  }

  setCurrentChatId(chatId);

  // Helper function to convert image to base64
  const convertImageToBase64 = async (uri: string): Promise<string | null> => {
    try {
      // Check if it's already a base64 string or URL
      if (uri.startsWith('data:') || uri.startsWith('http')) {
        return uri;
      }
      
      // Convert local file to base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  // Helper function to convert attachments to base64
  const convertAttachmentsToBase64 = async (attachments?: Array<{ uri: string; type: string; name: string }>) => {
    if (!attachments || attachments.length === 0) return [];
    
    const convertedAttachments = await Promise.all(
      attachments.map(async (attachment) => {
        if (attachment.type === 'image') {
          const base64Uri = await convertImageToBase64(attachment.uri);
          return {
            ...attachment,
            uri: base64Uri || attachment.uri
          };
        }
        return attachment;
      })
    );
    
    return convertedAttachments;
  };

  // Save to backend with base64 images
  try {
    if (!currentSessionId) {
      const response = await chatAPI.createSession(title);
      if (response.success) {
        const newSessionId = response.data.chatHistory.sessionId;
        setCurrentSessionId(newSessionId);
        
        // Save all messages with base64 converted attachments
        for (const msg of msgs) {
          const convertedAttachments = await convertAttachmentsToBase64(msg.attachments);
          const convertedGeneratedImage = msg.generatedImage 
            ? await convertImageToBase64(msg.generatedImage) 
            : null;

          await chatAPI.addMessage(newSessionId, {
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text,
            attachments: convertedAttachments,
            generatedImage: convertedGeneratedImage,
            metadata: {
              timestamp: msg.timestamp,
              hasAttachments: convertedAttachments.length > 0
            }
          });
        }
      }
    } else {
      // Save only the last message with base64 converted data
      const lastMessage = msgs[msgs.length - 1];
      const convertedAttachments = await convertAttachmentsToBase64(lastMessage.attachments);
      const convertedGeneratedImage = lastMessage.generatedImage 
        ? await convertImageToBase64(lastMessage.generatedImage) 
        : null;

      await chatAPI.addMessage(currentSessionId, {
        role: lastMessage.isUser ? 'user' : 'assistant',
        content: lastMessage.text,
        attachments: convertedAttachments,
        generatedImage: convertedGeneratedImage,
        metadata: {
          timestamp: lastMessage.timestamp,
          hasAttachments: convertedAttachments.length > 0
        }
      });
    }
  } catch (error) {
    console.error('Error saving to backend:', error);
  }
};

// Load chat history from backend on mount
// Update in Home.tsx - Fix the loadChatHistoryFromBackend useEffect:

useEffect(() => {
  const loadChatHistoryFromBackend = async () => {
    try {
      const response = await chatAPI.getSessions(50, 0);
      if (response.success && response.data.sessions) {
        // Convert backend format to your local format
        const backendChats = response.data.sessions.map((session: any) => ({
          id: session.sessionId, // Use sessionId consistently
          title: session.title,
          messages: [], // Messages loaded separately when opening a chat
          timestamp: new Date(session.lastMessageAt || session.createdAt),
          mode: 'inspire' // Default mode
        }));
        
        // Remove duplicates by sessionId
        const uniqueChats = backendChats.filter((chat: ChatHistory, index: number, self: ChatHistory[]) =>
          index === self.findIndex((c) => c.id === chat.id)
        );
        
        setChatHistories(uniqueChats);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  loadChatHistoryFromBackend();
}, []);

 const handleContentSizeChange = (contentWidth: number, contentHeight: number, isSubInput: boolean) => {
 const newHeight = Math.max(MIN_INPUT_HEIGHT, Math.min(MAX_INPUT_HEIGHT, contentHeight))
 
 if (isSubInput) {
 setSubInputHeight(newHeight)
 } else {
 setDefInputHeight(newHeight)
 }
 
 const activeInputHeight = isSubInput ? newHeight : defInputHeight
 const replyPreviewHeight = replyingTo ? height * 0.06 : 0
 const pendingImagesHeight = pendingImages.length > 0 ? width * 0.25 + height * 0.025 : 0
 const bottomControlsHeight = height * 0.055
 
 const totalHeight = BASE_CHATBOX_HEIGHT + (activeInputHeight - MIN_INPUT_HEIGHT) + replyPreviewHeight + pendingImagesHeight + bottomControlsHeight
 const maxChatBoxHeight = height * 0.5
 
 setChatBoxHeight(Math.min(totalHeight, maxChatBoxHeight))
 }

const handleSendMessage = async (messageText?: string, attachmentUri?: string, attachmentType?: string, attachmentName?: string) => {
  const textToSend = messageText || subTextInputValue || defTextInputValue
  const hasAttachment = attachmentUri || pendingImages.length > 0
  
  if (!textToSend.trim()) {
    if (!hasAttachment) {
      handleChatboxCollapse()
    }
    return
  }

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

  const finalAttachmentUri = attachmentUri
  const finalAttachmentName = attachmentName || 'attachment'

  animateMessageSend(async () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend.trim(),
      isUser: true,
      timestamp: new Date(),
      attachments: pendingImages.length > 0 
        ? pendingImages.map(img => ({
          uri: img.uri,
          type: 'image',
          name: img.name
        }))
        : finalAttachmentUri 
        ? [{
          uri: finalAttachmentUri,
          type: attachmentType || 'image',
          name: finalAttachmentName
        }] 
        : undefined,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.text,
        isUser: replyingTo.isUser
      } : undefined
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    
    // Save user message immediately
    saveChatHistory(updatedMessages)
    
    setShowChatScreen(true)
    setSubTextInputValue("")
    setDefTextInputValue("")
    setPendingImages([])
    const currentReply = replyingTo
    setReplyingTo(null)
    setIsAiTyping(true)

    setSubInputHeight(MIN_INPUT_HEIGHT)
    setDefInputHeight(MIN_INPUT_HEIGHT)
    setChatBoxHeight(BASE_CHATBOX_HEIGHT)

    isUserScrolling.current = false

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)

    try {
      const imageUris = pendingImages.length > 0 
        ? pendingImages.map(img => img.uri)
        : attachmentType === 'image' && finalAttachmentUri 
        ? [finalAttachmentUri]
        : undefined

      const aiResponse = await callOpenAI(
        textToSend.trim(), 
        imageUris,
        attachmentType === 'document' ? finalAttachmentUri : undefined,
        currentReply || undefined
      )
      
      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: Message = {
        id: aiMessageId,
        text: aiResponse.text,
        isUser: false,
        timestamp: new Date(),
        generatedImage: aiResponse.imageUrl,
        displayText: '',
        isTyping: true,
        replyTo: currentReply ? {
          id: currentReply.id,
          text: currentReply.text,
          isUser: currentReply.isUser
        } : undefined
      }

      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)
      
      typewriterEffect(aiResponse.text, aiMessageId)
      
      // Save AI message after typewriter effect completes
      setTimeout(() => {
        saveChatHistory(finalMessages)
      }, 500)
      
      setTimeout(() => {
        if (!isUserScrolling.current) {
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      }, 100)
    } catch (error) {
      console.error('Error:', error)
      setIsAiTyping(false)
    }
  })

  setTimeout(() => {
    simulateChatboxcollapse()
  }, 1500);

  handleChatboxCollapse()
}

 const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
 const currentScrollY = event.nativeEvent.contentOffset.y
 const contentHeight = event.nativeEvent.contentSize.height
 const scrollViewHeightValue = event.nativeEvent.layoutMeasurement.height
 
 scrollContentHeight.current = contentHeight
 scrollViewHeight.current = scrollViewHeightValue

 const isAtBottom = currentScrollY + scrollViewHeightValue >= contentHeight - 50
 const scrollPercentageFromBottom = ((contentHeight - scrollViewHeightValue - currentScrollY) / (contentHeight - scrollViewHeightValue)) * 100

 if (currentScrollY < lastScrollY.current - 10) {
 isUserScrolling.current = true
 }

 if (isAtBottom) {
 isUserScrolling.current = false
 scrollButtonY.value = withTiming(7, { duration: 200 })
 scrollButtonScale.value = withTiming(.9, { duration: 200 })
 scrollButtonOpacity.value = withTiming(0, { duration: 200 })
 scrollButtonZIndex.value = -99
 setShowScrollButton(false)
 } else if (scrollPercentageFromBottom > 10 && isUserScrolling.current) {
 scrollButtonY.value = withTiming(0, { duration: 200 })
 scrollButtonScale.value = withTiming(1, { duration: 200 })
 scrollButtonOpacity.value = withTiming(1, { duration: 200 })
 scrollButtonZIndex.value = 99
 setShowScrollButton(true)
 }

 lastScrollY.current = currentScrollY
 }

 const scrollToBottom = () => {
 scrollViewRef.current?.scrollToEnd({ animated: true })
 isUserScrolling.current = false
 Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium)
 }

 const handleLongPressImage = (uri: string, isGenerated: boolean = false) => {
 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
 
 if (Platform.OS === 'ios') {
 ActionSheetIOS.showActionSheetWithOptions(
 {
 options: ['Cancel', 'Save to Gallery', 'Share'],
 cancelButtonIndex: 0,
 },
 (buttonIndex) => {
 if (buttonIndex === 1) {
 saveImageToGallery(uri)
 } else if (buttonIndex === 2) {
 Share.share({ url: uri })
 }
 }
 )
 }
 }

 const handleMessageSwipe = (messageId: string, translationX: number, isUser: boolean) => {
 const isValidSwipe = isUser ? translationX < -50 : translationX > 50
 
 if (isValidSwipe) {
 const message = messages.find(m => m.id === messageId)
 if (message) {
 setReplyingTo(message)
 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
 setSwipedMessageId(null)
 
 setTimeout(() => {
 subTextInputRef.current?.focus()
 simulateChatboxExpand?.()
 }, 100)
 }
 }
 }

 const handleLongPressMessage = (message: Message, event: any) => {
 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
 
 if (Platform.OS === 'ios') {
 ActionSheetIOS.showActionSheetWithOptions(
 {
 options: ['Cancel', 'Copy', 'Reply', 'Share'],
 cancelButtonIndex: 0,
 },
 (buttonIndex) => {
 if (buttonIndex === 1) {
 Clipboard.setString(message.text)
 Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
 } else if (buttonIndex === 2) {
 setReplyingTo(message)
 setTimeout(() => {
 subTextInputRef.current?.focus()
 simulateChatboxExpand?.()
 }, 100)
 } else if (buttonIndex === 3) {
 Share.share({ message: message.text })
 }
 }
 )
 }
 }

 const handleCloseMessageOptions = () => {
 contextMenuScale.value = withTiming(0.8, { duration: 150 })
 contextMenuOpacity.value = withTiming(0, { duration: 150 })
 setTimeout(() => {
 setShowMessageOptions(false)
 setSelectedMessage(null)
 setContextMenuPosition(null)
 }, 150)
 }

 const handleCopyMessage = () => {
 if (selectedMessage) {
 Clipboard.setString(selectedMessage.text)
 Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
 handleCloseMessageOptions()
 }
 }

 const handleImagePress = (uri: string) => {
 setImagePreview(uri)
 setShowImageModal(true)
 setImageScale(1)
 Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium)
 }

 const handleFileUpload = async () => {
 Alert.alert(
 "Upload File",
 "Choose upload type",
 [
 {
 text: "Image",
 onPress: async () => {
 if (pendingImages.length >= MAX_IMAGES) {
 Alert.alert('Limit Reached', `You can only upload up to ${MAX_IMAGES} images at a time.`)
 return
 }

 const result = await ImagePicker.launchImageLibraryAsync({
 mediaTypes: ImagePicker.MediaTypeOptions.Images,
 allowsMultipleSelection: false,
 quality: 0.8,
 allowsEditing: true,
 })

 if (!result.canceled && result.assets[0]) {
 const imageUri = result.assets[0].uri
 setPendingImages(prev => [...prev, {
 uri: imageUri,
 name: `image-${prev.length + 1}.jpg`
 }])
 Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium)
 }
 }
 },
 {
 text: "Document",
 onPress: async () => {
 const result = await DocumentPicker.getDocumentAsync({
 type: ['application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
 copyToCacheDirectory: true,
 })

 if (!result.canceled && result.assets && result.assets[0]) {
 // FIXED: Don't auto-send, just focus input for user to add their message
 simulateChatboxExpand?.()
 setTimeout(() => {
 subTextInputRef.current?.focus()
 }, 100)
 Alert.alert('Document Uploaded', 'Please type your message about this document.')
 }
 }
 },
 {
 text: "Cancel",
 style: "cancel"
 }
 ]
 )
 }

 const handleMainInputFocus = () => {
 simulateChatboxExpand?.()
 setTimeout(() => {
 subTextInputRef.current?.focus()
 }, 0)
 }

 const handleChatboxCollapse = () => {
 subTextInputRef.current?.blur()
 defTextInputRef.current?.blur()

 setTimeout(() => {
 const hasValues =
 subTextInputValue.trim() !== "" || defTextInputValue.trim() !== "" || pendingImages.length > 0 || replyingTo !== null
 if (hasValues) {
 simulateChatboxcollapseWithValue?.()
 } else {
 simulateChatboxcollapse?.()
 setChatBoxHeight(BASE_CHATBOX_HEIGHT)
 setSubInputHeight(MIN_INPUT_HEIGHT)
 setDefInputHeight(MIN_INPUT_HEIGHT)
 }
 }, 50)
 }

 const handleOnboardingItemPress = (mode: Mode, description: string) => {
 setChatMode(mode)
 setIsFinished(false)
 handleSendMessage(description)
 }

 const handleShowHistory = () => {
 showBottomDrawer();
 setBottomDrawer(<History/>)
 }

 const handleCloseHistory = () => {
 historyModalScale.value = withTiming(0.8, { duration: 150 })
 historyModalOpacity.value = withTiming(0, { duration: 150 })
 setTimeout(() => {
 setShowHistoryModal(false)
 }, 150)
 }

const handleLoadChat = async (history: ChatHistory) => {
  try {
    if (history.messages.length === 0) {
      const response = await chatAPI.getConversation(history.id);
      
      if (response.success && response.data.conversation) {
        const backendMessages = response.data.conversation.messages.map((msg: any) => ({
          id: msg._id || Date.now().toString(),
          text: msg.content,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.timestamp),
          displayText: msg.role === 'user' ? undefined : msg.content,
          isTyping: false,
          attachments: msg.attachments || [], // Load attachments
          generatedImage: msg.generatedImage || null // Load generated image
        }));

        setMessages(backendMessages);
      }
    } else {
      setMessages(history.messages.map(msg => ({
        ...msg,
        displayText: msg.isUser ? undefined : msg.text,
        isTyping: false
      })));
    }

    handleStopGeneration();
    setChatMode(history.mode);
    setCurrentChatId(history.id);
    setCurrentSessionId(history.id);
    setShowChatScreen(true);
    setIsFinished(false);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);

    hideBottomDrawer();
  } catch (error) {
    console.error('Error loading chat:', error);
    Alert.alert('Error', 'Failed to load chat history');
  }
};

 const handleDeleteChat = async (chatId: string) => {
  Alert.alert(
    'Delete Chat',
    'Are you sure you want to delete this chat?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Delete from backend
            await chatAPI.deleteSession(chatId);
            
            // Delete locally
            setChatHistories(prev => prev.filter(h => h.id !== chatId));
            
            if (currentChatId === chatId) {
              handleNewChat();
            }
            
            Alert.alert('Success', 'Chat deleted successfully');
          } catch (error) {
            console.error('Error deleting chat:', error);
            Alert.alert('Error', 'Failed to delete chat from server, but removed locally');
            
            // Still delete locally even if backend fails
            setChatHistories(prev => prev.filter(h => h.id !== chatId));
            if (currentChatId === chatId) {
              handleNewChat();
            }
          }
        }
      }
    ]
  );
 };

 const handleNewChat = () => {
 setTimeout(() => {
 setMessages([])
 setShowChatScreen(false)
 setCurrentChatId(null)
 setPendingImages([])
 setReplyingTo(null)
 setIsFinished(false)
 handleCloseHistory()
 }, 600);
 hideBottomDrawer()
 }

 const handleRemovePendingImage = (index: number) => {
 setPendingImages(prev => prev.filter((_, i) => i !== index))
 Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium)
 
 setTimeout(() => {
 const replyPreviewHeight = replyingTo ? height * 0.06 : 0
 const pendingImagesHeight = (pendingImages.length - 1) > 0 ? width * 0.25 + height * 0.025 : 0
 const activeInputHeight = subInputHeight > MIN_INPUT_HEIGHT ? subInputHeight : defInputHeight
 const bottomControlsHeight = height * 0.055
 
 const totalHeight = BASE_CHATBOX_HEIGHT + (activeInputHeight - MIN_INPUT_HEIGHT) + replyPreviewHeight + pendingImagesHeight + bottomControlsHeight
 const maxChatBoxHeight = height * 0.5
 
 setChatBoxHeight(Math.min(totalHeight, maxChatBoxHeight))
 }, 50)
 }

const handleShowUserProfile = () => {
  showBottomDrawer();
  setBottomDrawer(<UserProfileSheet onClose={hideBottomDrawer} />);
};

interface UserProfileSheetProps {
  onClose: () => void;
}

const UserProfileSheet: React.FC<UserProfileSheetProps> = ({ onClose }) => {
  const { width, height } = Dimensions.get('window');
  const [userData, setUserData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const { userAPI } = require('../services/api');
      
      const [storedUser, subResponse] = await Promise.all([
        AsyncStorage.getItem('userData'),
        userAPI.getSubscriptionStatus()
      ]);

      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
      if (subResponse.success) {
        setSubscriptionData(subResponse.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
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
            const { authAPI } = require('../services/api');
            await authAPI.logout();
            onClose();
            // Navigate to welcome screen
          }
        }
      ]
    );
  };

  const MenuItem: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    destructive?: boolean;
    hideChevron?: boolean;
  }> = ({ icon, title, subtitle, onPress, destructive, hideChevron }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.012,
        paddingHorizontal: width * 0.04,
        backgroundColor: '#fff',
      }]}>
      <TextBold size={width * 0.055}>{icon}</TextBold>
      <View style={[{flex: 1, marginLeft: width * 0.03}]}>
        <TextMed 
          size={width * 0.042} 
          color={destructive ? '#FF3B30' : '#000'}>
          {title}
        </TextMed>
        {subtitle && (
          <TextMed size={width * 0.032} opacity={0.6}>
            {subtitle}
          </TextMed>
        )}
      </View>
      {!hideChevron && (
        <TextMed size={width * 0.04} opacity={0.3}>›</TextMed>
      )}
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <View style={[{
      paddingHorizontal: width * 0.04,
      paddingTop: height * 0.025,
      paddingBottom: height * 0.008,
      backgroundColor: '#F2F2F7',
    }]}>
      <TextMed size={width * 0.032} opacity={0.6}>
        {title.toUpperCase()}
      </TextMed>
    </View>
  );

  const Separator = () => (
    <View style={[{
      height: 0.5,
      backgroundColor: '#C6C6C8',
      marginLeft: width * 0.14,
    }]} />
  );

  const SectionSeparator = () => (
    <View style={[{height: height * 0.03, backgroundColor: '#F2F2F7'}]} />
  );

  if (loading) {
    return (
      <View style={[styles.parentLayout, styles.center]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <ScrollView 
        style={[styles.absolute, styles.wFull, styles.hFull, {
          paddingTop: height * 0.09,
          backgroundColor: '#F2F2F7',
        }]}
        showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={[{
          backgroundColor: '#fff',
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
            {userData?.firstName} {userData?.lastName}
          </TextBold>
          <TextMed size={width * 0.038} opacity={0.6}>
            {userData?.email}
          </TextMed>
        </View>

        <SectionSeparator />

        {/* Subscription Section */}
        <View style={[{backgroundColor: '#fff'}]}>
          <MenuItem
            icon="👑"
            title={subscriptionData?.status === 'trial' ? 'Free Trial' : 
                   subscriptionData?.hasAccess ? 'Premium' : 'Subscribe'}
            subtitle={subscriptionData?.status === 'trial' 
              ? `${subscriptionData.daysLeft} days remaining`
              : subscriptionData?.hasAccess 
                ? 'All features unlocked'
                : 'Upgrade to Premium'}
            onPress={() => {
              // Navigate to subscription screen
              Alert.alert('Subscription', 'Subscription management coming soon');
            }}
          />
        </View>

        <SectionSeparator />

        {/* Account Section */}
        <SectionHeader title="Account" />
        <View style={[{backgroundColor: '#fff'}]}>
          <MenuItem
            icon="👤"
            title="Edit Profile"
            onPress={() => Alert.alert('Edit Profile', 'Coming soon')}
          />
          <Separator />
          <MenuItem
            icon="🎨"
            title="Skill Level"
            subtitle={userData?.skillLevel?.charAt(0).toUpperCase() + userData?.skillLevel?.slice(1)}
            onPress={() => {
              // Show skill level selector
              Alert.alert('Skill Level', 'Update your artistic skill level', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Beginner', onPress: () => console.log('Beginner') },
                { text: 'Intermediate', onPress: () => console.log('Intermediate') },
                { text: 'Advanced', onPress: () => console.log('Advanced') },
              ]);
            }}
          />
          <Separator />
          <MenuItem
            icon="🔔"
            title="Notifications"
            onPress={() => Alert.alert('Notifications', 'Coming soon')}
          />
        </View>

        <SectionSeparator />

        {/* App Section */}
        <SectionHeader title="App" />
        <View style={[{backgroundColor: '#fff'}]}>
          <MenuItem
            icon="⚙️"
            title="Settings"
            onPress={() => Alert.alert('Settings', 'Coming soon')}
          />
          <Separator />
          <MenuItem
            icon="❓"
            title="Help & Support"
            onPress={() => Alert.alert('Help', 'Coming soon')}
          />
          <Separator />
          <MenuItem
            icon="ℹ️"
            title="About ArtBlock"
            subtitle={`Version 1.0.0`}
            onPress={() => Alert.alert('About', 'ArtBlock AI - Your creative companion')}
          />
          <Separator />
          <MenuItem
            icon="⭐"
            title="Rate App"
            onPress={() => Alert.alert('Rate App', 'Thank you for your support!')}
          />
        </View>

        <SectionSeparator />

        {/* Sign Out */}
        <View style={[{backgroundColor: '#fff'}]}>
          <MenuItem
            icon="🚪"
            title="Sign Out"
            onPress={handleSignOut}
            destructive={true}
            hideChevron={true}
          />
        </View>

        <View style={[{height: height * 0.1}]} />
      </ScrollView>

      {/* Header */}
      <View style={[{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.016,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderBottomWidth: 0.5,
        borderBottomColor: '#C6C6C8',
      }]}>
        <TextBold size={width * 0.05}>Profile</TextBold>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onClose}
          style={[{padding: width * 0.02}]}>
          <TextBold size={width * 0.04} color="#007AFF">Done</TextBold>
        </TouchableOpacity>
      </View>
    </>
  );
};

const handleCloseUserProfile = () => {
 setShowUserProfile(false)
}

const handleThumbsUp = (messageId: string) => {
 setMessageFeedback(prev => ({
 ...prev,
 [messageId]: prev[messageId] === 'up' ? null : 'up'
 }))
 Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium)
}

const handleThumbsDown = (messageId: string) => {
 setMessageFeedback(prev => ({
 ...prev,
 [messageId]: prev[messageId] === 'down' ? null : 'down'
 }))
 Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium)
}

const handleRetryMessage = async (messageId: string) => {
 const messageIndex = messages.findIndex(m => m.id === messageId)
 if (messageIndex === -1) return
 
 const lastUserMessage = [...messages.slice(0, messageIndex)].reverse().find(m => m.isUser)
 if (!lastUserMessage) return
 
 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
 
 // Remove the AI message we're retrying
 const filteredMessages = messages.filter(m => m.id !== messageId)
 setMessages(filteredMessages)
 setIsAiTyping(true)
 
 try {
 const imageUris = lastUserMessage.attachments
 ?.filter(a => a.type === 'image')
 .map(a => a.uri)
 
 const documentUri = lastUserMessage.attachments?.find(a => a.type === 'document')?.uri
 
 const aiResponse = await callOpenAI(
 lastUserMessage.text,
 imageUris,
 documentUri,
 lastUserMessage.replyTo as any
 )
 
 const aiMessageId = Date.now().toString()
 const aiMessage: Message = {
 id: aiMessageId,
 text: aiResponse.text,
 isUser: false,
 timestamp: new Date(),
 generatedImage: aiResponse.imageUrl,
 displayText: '',
 isTyping: true,
 }
 
 const finalMessages = [...filteredMessages, aiMessage]
 setMessages(finalMessages)
 
 typewriterEffect(aiResponse.text, aiMessageId)
 saveChatHistory(finalMessages)
 
 setTimeout(() => {
 if (!isUserScrolling.current) {
 scrollViewRef.current?.scrollToEnd({ animated: true })
 }
 }, 100)
 } catch (error) {
 console.error('Error retrying message:', error)
 setIsAiTyping(false)
 }
}

 // FIXED: Made async and regenerates AI response with new mode
 const handleModeChange = async (newMode: Mode) => {
 setChatMode(newMode)
 setIsFinished(false)
 scrollToBottom();
 Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium)
 
 // Find the last user message to regenerate response
 const lastUserMessage = [...messages].reverse().find(m => m.isUser)
 
 if (lastUserMessage) {
 setIsAiTyping(true)
 
 try {
 // Get attachments from the last user message
 const imageUris = lastUserMessage.attachments
 ?.filter(a => a.type === 'image')
 .map(a => a.uri)
 
 const documentUri = lastUserMessage.attachments?.find(a => a.type === 'document')?.uri
 
 // Build a context message for mode change
 const contextMessage = `[Mode switched to ${newMode}] ${lastUserMessage.text}`
 
 const aiResponse = await callOpenAI(
 contextMessage,
 imageUris,
 documentUri,
 lastUserMessage.replyTo as any
 )
 
 const aiMessageId = (Date.now() + 1).toString()
 const aiMessage: Message = {
 id: aiMessageId,
 text: aiResponse.text,
 isUser: false,
 timestamp: new Date(),
 generatedImage: aiResponse.imageUrl,
 displayText: '',
 isTyping: true,
 }
 
 const finalMessages = [...messages, aiMessage]
 setMessages(finalMessages)
 
 typewriterEffect(aiResponse.text, aiMessageId)
 saveChatHistory(finalMessages)
 
 setTimeout(() => {
 if (!isUserScrolling.current) {
 scrollViewRef.current?.scrollToEnd({ animated: true })
 }
 }, 100)
 } catch (error) {
 console.error('Error regenerating response:', error)
 setIsAiTyping(false)
 }
 }

if (chatMode === newMode) return // Don't do anything if already in this mode
 
 setChatMode(newMode)
 setIsFinished(false)
 Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium)
 }

 const onboardingItems = [
 { 
 icon: <IconWaterDrop width={width*.05} height={width*.05} color={textColorV2}/>, 
 title: 'Inspire',
 description: `Spark new art ideas.`,
 mode: 'inspire' as Mode
 },
 { 
 icon: <IconWrenchTool width={width*.05} height={width*.05} color={textColorV2}/>, 
 title: 'Reflect',
 description: `Critique my art deeply.`,
 mode: 'reflect' as Mode
 },
 ]

 const hasInputContent = subTextInputValue.trim() !== "" || defTextInputValue.trim() !== "" || pendingImages.length > 0

 const History = () => {
 return (
 <>
 <ScrollView style={[styles.absolute,styles.wFull,styles.hFull,{paddingTop:height*.09,
 borderRadius:width*.08,paddingHorizontal:width*.04}]}>
 {chatHistories.length === 0 ? (
 <View style={[styles.center,styles.hFull,{
 paddingTop: width * 0.7,
 alignItems: 'center',
 }]}>
 <TextMed size={width * 0.04} color="#000" opacity={.5}>
 No chat history yet
 </TextMed>
 </View>
 ) : (
 chatHistories.map((history) => (
 <TouchableOpacity
 key={history.id}
 activeOpacity={0.7}
 onPress={() => handleLoadChat(history)}
 style={[{
 borderRadius:width*1,
 position: 'relative',
 }]}>
 <View style={[styles.absolute,styles.wFull,styles.hFull,
 {display:currentChatId === history.id ? 'flex' : 'none'}]}>
 <Blury height={'100%'} background={'#ffffff50'} radius={width*1}/>
 </View>
 
 <View style={[{
 paddingLeft: width * 0.05,
 paddingRight: width * 0.04,
 paddingVertical: height * .014,
 borderRadius:width*1,
 gap: width*.04,
 flexDirection: 'row',
 justifyContent: 'space-between',
 alignItems: 'center',
 }]}>
 <TextMed size={width * 0.038} numberOfLines={1}>
 {history.title}
 </TextMed>

 <TouchableOpacity
 activeOpacity={0.7}
 onPress={(e) => {
 e.stopPropagation()
 handleDeleteChat(history.id)}}>
 <IconCancel width={width*.035} height={width*.035} opacity={.8}/>
 </TouchableOpacity>
 </View>
 {/* <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: height * 0.005 }]}>
 <View style={[{
 backgroundColor: 
 history.mode === 'inspire' ? '#4CAF50' : '#2196F3',
 paddingHorizontal: width * 0.02,
 paddingVertical: height * 0.003,
 borderRadius: width * 0.01,
 marginRight: width * 0.02,
 }]}>
 <TextMed size={width * 0.028} color="#fff">
 {history.mode.charAt(0).toUpperCase() + history.mode.slice(1)}
 </TextMed>
 </View>
 <TextMed size={width * 0.03} color="#999">
 {history.messages.length} messages
 </TextMed>
 </View> */}
 </TouchableOpacity>
 ))
 )}
 </ScrollView>

<View style={[{
 paddingHorizontal: width * .04,
 paddingVertical: height * .016,
 flexDirection: 'row',
 justifyContent: 'space-between',
 alignItems: 'center',
 }]}>
 <TextBold size={width * 0.045}>Chat History</TextBold>

 <View style={[{position:'relative'}]}>
 <LiquidGlassNode height={height*.045} radius={width*1} activeOpacity={.5} touchAction={handleNewChat}>
 <View style={[styles.center,styles.hFull,{paddingHorizontal:width*.04}]}>
 <TextBold size={width * 0.035} color="#000">New Chat</TextBold>
 </View>
 </LiquidGlassNode>
 </View>
 </View>
 </>
 )
 }

const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

// Load subscription status on mount
useEffect(() => {
  const loadSubscription = async () => {
    try {
      const response = await userAPI.getSubscriptionStatus();
      if (response.success) {
        setSubscriptionStatus(response.data);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };
  
  loadSubscription();
}, []);

  const [userData, setUserData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
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

  if (!userData) {
    return (
      <View style={[styles.parentLayout, styles.center]}>
    <ActivityIndicator size={'large'} color={'#000000'}/>
      </View>
    );
  }

 return (
 <View style={[styles.parentLayout]}>
 <Pad
 direction="column"
 style={[styles.wFull,styles.alignStart,styles.justifyStart,styles.hFull]}>
 <View style={[styles.sizeFull,styles.alignStart]}>
{subscriptionStatus?.status === 'trial' && subscriptionStatus?.daysLeft <= 3 && (
  <View style={[{
    position: 'absolute',
    top: height * 0.055,
    left: width * 0.07,
    right: width * 0.07,
    zIndex: 999,
  }]}>
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        showBottomDrawer();
        setBottomDrawer(<SubscriptionScreen/>);
      }}
      style={[{
        backgroundColor: '#FFF3CD',
        padding: width * 0.03,
        borderRadius: width * 0.03,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }]}>
      <View style={[{flex: 1}]}>
        <TextBold size={width * 0.035}>Trial Ending Soon</TextBold>
        <TextMed size={width * 0.03} opacity={0.7}>
          {subscriptionStatus.daysLeft} days left - Subscribe now
        </TextMed>
      </View>
      <TextBold size={width * 0.035}>›</TextBold>
    </TouchableOpacity>
  </View>
)}
 <ScrollView 
 ref={scrollViewRef}
 style={[styles.sizeFull]} 
 contentContainerStyle={[styles.align,{flexGrow:1}]}
 onScroll={handleScroll}
 scrollEventThrottle={15}>

 {!showChatScreen && (
 <View style={[styles.hFull,styles.justify,styles.align]}>
 <Pad direction={'column'}>
 <Pad direction={'row'} gap={width*.025}>
 <View style={[{width:width*.08,height:width*.08,borderRadius:100,backgroundColor:'#000',opacity:.8}]}/>
 <TextHeavy size={width*.15} opacity={.8}>ArtBlock</TextHeavy>
 </Pad>
 <Break py={height * .001}/>
 <TextMed size={width*.049} opacity={.5}>Hi 
 <Text style={[{textTransform:'capitalize'}]}> {userData.firstName}</Text>, What can I do for you today?</TextMed>
 </Pad>
 <Break py={height * .015}/>
 
 <Pad direction={'column'} gap={height*.015} style={[styles.wFull]}>
 <Pad gap={height*.015} direction="row" px={width * 0.07}>
 {onboardingItems.slice(0,2).map((item, index) => (
 <TouchableOpacity 
 key={index}
 activeOpacity={0.7}
 onPress={() => handleOnboardingItemPress(item.mode, item.description)}
 style={[{flex: 1}]}>
 <OnbardingItems
 icon={item.icon} 
 title={item.title} 
 description={item.description} />
 </TouchableOpacity>
 ))}
 </Pad>
 </Pad>
 </View>
 )}

 {showChatScreen && (
 <View style={[styles.wFull, {paddingHorizontal: width * 0.07, paddingTop: height * 0.0}]}>
 <Break py={height * .08}/>
 <View style={[{flex: 1, paddingBottom: height * 0.12}]}>
 {messages.map((message, index) => {
 if (!messageSwipeX.current[message.id]) {
 messageSwipeX.current[message.id] = new RNAnimated.Value(0)
 }
 
 const swipeX = messageSwipeX.current[message.id]
 
 return (
 <PanGestureHandler
 key={message.id}
 onGestureEvent={RNAnimated.event(
 [{ nativeEvent: { translationX: swipeX } }],
 { useNativeDriver: true }
 )}
 onHandlerStateChange={(event) => {
 if (event.nativeEvent.state === State.END) {
 const translationX = event.nativeEvent.translationX
 
 const isValidSwipe = message.isUser ? translationX < 0 : translationX > 0
 
 RNAnimated.spring(swipeX, {
 toValue: 0,
 useNativeDriver: true,
 }).start()
 
 if (isValidSwipe) {
 handleMessageSwipe(message.id, translationX, message.isUser)
 }
 }
 }}
 activeOffsetX={message.isUser ? [-20, 0] : [0, 20]}
 failOffsetY={[-10, 10]}
 maxPointers={1}>
 <RNAnimated.View
 ref={(ref:any) => (messageRefs.current[message.id] = ref)}
 style={[{
 marginBottom: height * 0.015,
 alignItems: message.isUser ? 'flex-end' : 'flex-start',
 transform: [{ 
 translateX: swipeX.interpolate({
 inputRange: message.isUser ? [-100, 0] : [0, 100],
 outputRange: message.isUser ? [-30, 0] : [0, 30],
 extrapolate: 'clamp'
 })
 }]
 }]}>
 
 {message.replyTo && (
 <View style={[{
 marginTop: height * 0.009,
 marginBottom: height * 0.011,
 padding: width * 0.02,
 borderWidth: .3,
 borderRadius: width*.03,
 borderColor: message.isUser ? '#222' : '#222',
 maxWidth: width * 0.7,
 }]}>
 <TextMed size={width * 0.032} opacity={0.6} numberOfLines={1}>
 Re: {message.replyTo.isUser ? 'You' : 'ArtBlock'} - {message.replyTo.text}
 </TextMed>
 </View>
 )}

 <TouchableOpacity
 activeOpacity={1}
 delayLongPress={400}
 onLongPress={(event) => handleLongPressMessage(message, event)}
 style={[{width: '100%', alignItems: message.isUser ? 'flex-end' : 'flex-start'}]}>
 {message.attachments && message.attachments.map((attachment, idx) => (
 <View key={idx} style={[{marginBottom: height * 0.01}]}>
 {attachment.type === 'image' ? (
 <TouchableOpacity
 activeOpacity={0.9}
 delayLongPress={500}
 onPress={() => handleImagePress(attachment.uri)}
 onLongPress={() => handleLongPressImage(attachment.uri, false)}>
 <Image 
 source={{uri: attachment.uri}} 
 style={[{
 width: width * 0.5,
 height: width * 0.5,
 borderRadius: width * 0.04,
 }]}
 resizeMode="cover"
 />
 </TouchableOpacity>
 ) : (
 <View style={[{
 backgroundColor: '#e0e0e0',
 padding: width * 0.03,
 borderRadius: width * 0.03,
 maxWidth: width * 0.7,
 }]}>
 <TextMed size={width * 0.035}>📄 {attachment.name}</TextMed>
 </View>
 )}
 </View>
 ))}
 
 {message.generatedImage && (
 <View style={[{marginBottom: height * 0.01}]}>
 <TouchableOpacity
 activeOpacity={0.9}
 delayLongPress={500}
 onPress={() => handleImagePress(message.generatedImage!)}
 onLongPress={() => handleLongPressImage(message.generatedImage!, true)}>
 <View>
 {isImageLoading[message.generatedImage] && (
 <View style={[{
 position: 'absolute',
 width: width * 0.6,
 height: width * 0.6,
 borderRadius: width * 0.04,
 justifyContent: 'center',
 alignItems: 'center',
 zIndex: 10,
 }]}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 <Blury height={'100%'} background={'#ffffff30'} radius={width * 0.04}/>
 </View>
 <ActivityIndicator size="large" color="#000"/>
 </View>
 )}
 <Image 
 source={{uri: message.generatedImage}} 
 style={[{
 width: width * 0.6,
 height: width * 0.6,
 borderRadius: width * 0.04,
 }]}
 resizeMode="cover"
 onLoadStart={() => {
 setIsImageLoading(prev => ({...prev, [message.generatedImage!]: true}))
 }}
 onLoadEnd={() => {
 setIsImageLoading(prev => ({...prev, [message.generatedImage!]: false}))
 }}
 />
 <View style={[{
 position: 'absolute',
 top: width * 0.02,
 right: width * 0.02,
 backgroundColor: 'rgba(0,0,0,0.6)',
 borderRadius: width * 0.015,
 padding: width * 0.015,
 }]}>
 <TextMed size={width * 0.025} color="#fff">AI Generated</TextMed>
 </View>
 </View>
 </TouchableOpacity>
 </View>
 )}

 <Animated.View style={[styles.justifyEnd,styles.alignEnd,{
 backgroundColor: message.isUser ? '#000' : '#ffffff10',
 maxWidth: width * 0.7,
 borderRadius: width * 0.05,
 overflow: message.isUser ? 'visible' : 'hidden',
 position: 'relative',
 opacity: message.isTyping ? 0.7 : 1,
 }]}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 {message.isUser ? (
 <View />
 ) : (
 <Blury radius={width * 0.04} intensity={30} height={'100%'} background={''}/>
 )}
 </View>
 <View style={[{
 paddingHorizontal: width * 0.04,
 paddingVertical: height * 0.0105,
 }]}>
 <TextMed 
 size={width * 0.04} 
 color={message.isUser ? '#fff' : '#000'}>
 {message.isUser ? message.text : (message.displayText || message.text)}
 </TextMed>
 </View>
 {message.isUser ? (
 <>
 <View
 style={{
 width: width * 0.04,
 height: width * 0.04,
 borderRadius: width * 1,
 position: 'absolute',
 backgroundColor: '#000',
 transform:[{translateY:height*.003}]
 }}/>
 <View
 style={{
 width: width * 0.019,
 height: width * 0.019,
 borderRadius: width * 1,
 position: 'absolute',
 backgroundColor: '#000',
 transform:[{translateY:height*.011},{translateX:width*.01}]
 }}/>
 </>
 ) : (
 <View />
 )}
 </Animated.View>
{!message.isUser && !message.isTyping && (
 <View style={[{
 flexDirection: 'row',
 marginTop: height * 0.015,
 marginBottom: height*.01,
 paddingLeft: width*.01,
 gap: width * 0.03,
 }]}>

 {/* Copy */}
 <TouchableOpacity
 activeOpacity={0.6} onPress={handleCopyMessage} style={[styles.align,styles.justify]}>
 <IconCopy width={width*.065} height={width*.065} opacity={.8}/>
 </TouchableOpacity>

 {/* Thumbs Up */}
 <TouchableOpacity
 activeOpacity={0.6}
 onPress={() => handleThumbsUp(message.id)} style={[styles.align,styles.justify]}>
 {messageFeedback[message.id] === 'up' ? 
 <IconThumbsUpV2 width={width*.049} height={width*.049} style={[{transform:[{scale:width*.0033}]}]} opacity={.8}/>
  : <IconThumbsUp width={width*.049} height={width*.049} opacity={.8}/>}
 </TouchableOpacity>
 
 {/* Thumbs Down */}
 <TouchableOpacity
 activeOpacity={0.6}
 onPress={() => handleThumbsDown(message.id)} style={[styles.align,styles.justify]}>
 {messageFeedback[message.id] === 'down' ? 
 <IconThumbsDownV2 width={width*.049} height={width*.049} style={[{transform:[{scale:width*.0034},{rotate:'180deg'}]}]} opacity={.8}/> : 
 <IconThumbsDown width={width*.049} height={width*.049} opacity={.8}/>}
 </TouchableOpacity>
 
 {/* Retry */}
 <TouchableOpacity
 activeOpacity={0.6}
 onPress={() => handleRetryMessage(message.id)} style={[styles.align,styles.justify]}>
 <IconRefresh width={width*.048} height={width*.048} strokeWidth={2.4} opacity={.8}/>
 </TouchableOpacity>
 </View>
)}
 </TouchableOpacity>
 </RNAnimated.View>
 </PanGestureHandler>
 )
 })}

 {isAiTyping && messages.filter(m => m.isTyping).length === 0 && (
 <View style={[{
 alignItems: 'flex-start',
 marginBottom: height * 0.015,
 }]}>
 <View style={[{
 overflow: 'hidden',
 borderRadius: width * 0.05,
 }]}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 <Blury radius={width * 0.04} intensity={30} height={'100%'} background={'#ffffff30'}/>
 </View>
 <View style={[{
 paddingHorizontal: width * 0.04,
 paddingVertical: height * 0.0105,
 }]}>
 <TextMed size={width * 0.04}>ArtBlock is thinking...</TextMed>
 </View>
 </View>
 </View>
 )}

 {isGeneratingImage && (
 <View style={[{
 alignItems: 'flex-start',
 marginBottom: height * 0.015,
 }]}>
 <View style={[{
 overflow: 'hidden',
 borderRadius: width * 0.05,
 }]}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 <Blury radius={width * 0.04} intensity={30} height={'100%'} background={'#ffffff30'}/>
 </View>
 <Pad style={[{
 paddingVertical: height * 0.0105,
 }]} direction="row" justify="flex-start" align="center" px={width*.03} gap={width*.035}>
 <TextMed size={width * 0.04}>Generating image</TextMed>
 <ActivityIndicator size="small" color="#000"/>
 </Pad>
 </View>
 </View>
 )}
 </View>
 </View>
 )}
 <Break py={height*.01}/>
 </ScrollView>

 {showChatScreen && (
 <Animated.View style={[styles.wFull,styles.justify,{
 position: 'absolute',
 bottom: height * 0.13,
 flexDirection: 'row'
 }, scrollButtonAnimatedStyle]}>
 <LiquidGlassObject
 touchAction={scrollToBottom} radius={width*1} width={width*.1} height={width*.1} style={[styles.align,styles.justify]}>
 <View style={[styles.wFull,styles.hFull,styles.align,styles.justify,{backgroundColor:'#ffffff30',borderRadius:width*1}]}>
 <IconChevronDown width={width * 0.075} height={width * 0.075} opacity={.8} strokeWidth={2}/>
 </View>
 </LiquidGlassObject>
 </Animated.View>
 )}

 {showChatScreen && (
 <Pad style={[{
 position: 'absolute',
 top: height * 0.081,
 left: 0,
 right: 0,
 }]} direction="row" align="center" justify="center" gap={width*.03}>
 <LiquidGlassNode width={width*.25} radius={100} touchAction={() => handleModeChange('inspire')}
 style={[styles.align,styles.justify]} activeOpacity={.5}>
 <View style={[styles.center,styles.hFull,{paddingVertical:height*.013}]}>
 <TextBold size={width * 0.035}>Inspire</TextBold>
 </View>
 </LiquidGlassNode>

 <LiquidGlassNode width={width*.25} radius={100} touchAction={() => handleModeChange('reflect')}
 style={[styles.align,styles.justify]} activeOpacity={.5}>
 <View style={[styles.center,styles.hFull,{paddingVertical:height*.013}]}>
 <TextBold size={width * 0.035}>Reflect</TextBold>
 </View>
 </LiquidGlassNode>
 </Pad>
 )}

 <Pad
 direction="column"
 px={width * 0.06}
 py={70}
 style={[styles.wFull,styles.alignStart,styles.justifyStart]}>
 <View style={[styles.center,{zIndex:999}]}>
 <Pad
 style={[styles.flex,styles.wFull,styles.absolute, { top: 0 }]}
 direction="row">
 <View style={[{ width: "10%" }]}>
 <TouchableOpacity activeOpacity={0.7} style={[{zIndex:999}]}>
 <SimulatedView size={0.095} style={[styles.absolute,{zIndex:999}]} onPress={handleShowHistory}>
 <IconHistory
 width={width * 0.055}
 strokeWidth={2}
 height={width * 0.055}/>
 </SimulatedView>
 </TouchableOpacity>
 </View>
 <View style={[{ width: "80%" }]} />
 <View style={[{ width: "10%" }]}>
 {/* FIXED: Added zIndex to make it clickable */}

 <SimulatedView size={0.095} style={[styles.absolute,{zIndex:999}]}>
 <UserProfile user={require("../assets/images/userfemale.png")} touchAction={()=>{showBottomDrawer()
 setBottomDrawer(<UserProfileScreen onClose={()=>setRoute(<WelcomeScreen/>)}/>)
 }}/>
 </SimulatedView>

 </View>
 </Pad>
 </View>
 </Pad>

 <Animated.View
 style={[
 styles.sizeFull,
 { backgroundColor: "#00000060" },
 chatBoxHelperAnimatedStyle,
 ]}
 onTouchStart={()=>{handleChatboxCollapse(),hideBottomDrawer()}}/>

 <Animated.View
 style={[
 styles.flex,
 styles.wFull,
 styles.absolute,
 chatBoxAnimatedStyle,
 {
 zIndex: 99,
 paddingHorizontal: width * 0.07,
 },
 ]}>
 <LiquidGlassNode
 radius={width * 0.07}
 height={"100%"}
 width={"100%"}>
 <Pad
 direction="column"
 align="flex-start"
 justify="flex-end"
 style={[
 styles.wFull,
 styles.hFull,
 { paddingVertical: height * 0.01, overflow: "hidden" },
 ]}
 px={width * 0.03}>

 {replyingTo && (
 <View style={[{
 width: '100%',
 marginBottom: height * 0.01,
 borderLeftWidth: 3,
 borderLeftColor: '#fff',
 borderRadius: width * 0.03,
 flexDirection: 'row',
 justifyContent: 'space-between',
 alignItems: 'center',
 position: 'relative'
 }]}>
 <View style={[styles.absolute,styles.wFull,styles.hFull]}>
 <Blury height={'100%'} background={'#ffffff50'} radius={width * 0.03}/>
 </View>
 <View style={[styles.wFull,styles.hFull,{padding: width * 0.03,flexDirection: 'row',
 justifyContent: 'space-between',
 alignItems: 'center',}]}>
 <View style={[{flex: 1}]}>
 <TextMed size={width * 0.03} opacity={0.6}>
 Replying to {replyingTo.isUser ? 'You' : 'ArtBlock'}
 </TextMed>
 <TextBold size={width * 0.035} numberOfLines={1}>
 {replyingTo.text}
 </TextBold>
 </View>
 <TouchableOpacity
 activeOpacity={0.7}
 onPress={() => {setReplyingTo(null);setTimeout(() => {
 simulateChatboxcollapse()
 }, 100);}}
 style={[{padding: width * 0.02}]}>
 <TextHeavy size={width * 0.04}>✕</TextHeavy>
 </TouchableOpacity>
 </View>
 </View>
 )}

 {pendingImages.length > 0 && (
 <View style={[{
 width: '100%',
 }]}>
 <ScrollView 
 horizontal 
 showsHorizontalScrollIndicator={false}
 style={[{ flexDirection: 'row', padding: height * 0.008 }]}>
 {pendingImages.map((image, index) => (
 <View key={index} style={[{
 position: 'relative',
 marginRight: width * 0.02,
 }]}>
 <View style={[{
 width: width * 0.25,
 height: width * 0.25,
 shadowColor: '#000',
 shadowOpacity: .3,
 shadowRadius: 2,
 shadowOffset: { width: 0, height: 0 },
 }]}>
 <Image 
 source={{uri: image.uri}} 
 style={[{
 width: '100%',
 height: '100%',
 borderRadius: width * 0.03,
 }]}
 resizeMode="cover"/>
 </View>
 <TouchableOpacity
 activeOpacity={0.7}
 onPress={() => {handleRemovePendingImage(index);handleChatboxCollapse()}}
 style={[{
 position: 'absolute',
 top: -width * 0.015,
 right: -width * 0.015,
 borderRadius: 100,
 width: width * 0.055,
 height: width * 0.055,
 justifyContent: 'center',
 alignItems: 'center',
 shadowColor: '#000',
 shadowOpacity: .2,
 shadowRadius: 4,
 shadowOffset: { width: 0, height: 2 },
 }]}>
 <Blury intensity={2} height={'100%'} radius={100} background={'#00000060'}/>
 <TextHeavy size={width * 0.03} opacity={1} color="#fff">✕</TextHeavy>
 </TouchableOpacity>
 </View>
 ))}
 </ScrollView>
 </View>
 )}

 <Animated.View
 style={[styles.wFull, subTextInputAnimatedStyle, messageSendAnimatedStyle]}>
 <TextInput
 multiline={true}
 ref={subTextInputRef}
 editable={!isAiTyping} // Add this line
 style={[
 styles.wFull,
 {
 paddingTop: height * 0.009,
 paddingBottom: height * 0.04,
 pointerEvents: subTextInputPointerEvents,
 opacity: isAiTyping ? 0.5 : 1, // Add this line
 },
 ]}
 placeholder={replyingTo ? `Reply to ${replyingTo.isUser ? 'your message' : 'ArtBlock'}...` : pendingImages.length > 0 ? "Describe what you want me to do with these images..." : "Send a message to ArtBlock..."}
 placeholderTextColor={"#00000070"}
 value={subTextInputValue}
 onFocus={handleMainInputFocus}
 onSubmitEditing={() => handleSendMessage()}
 onChangeText={setSubTextInputValue}/>
 </Animated.View>

 <Pad
 direction="row"
 align="flex-end"
 justify="flex-start"
 style={[styles.wFull]}>
 <View
 style={[
 styles.alignEnd,
 styles.justify,
 { width: "9%" },
 ]}>
 <TouchableOpacity 
 activeOpacity={0.5}
 onPress={handleFileUpload}>
 <IconPlus
 width={width * 0.08}
 height={width * 0.08}
 strokeWidth={width * 0.0045}
 opacity={0.7}/>
 </TouchableOpacity>
 </View>

 <Animated.View
 style={[
 styles.alignEnd,
 styles.justify,
 { width: "71%" },
 defTextInputAnimatedStyle,
 ]}>
<TextInput
 ref={defTextInputRef}
 editable={!isAiTyping} // Add this line
 style={[{ 
 width: "98%", 
 paddingBottom: height * 0.0085,
 opacity: isAiTyping ? 0.5 : 1, // Add this line
 }]}
 placeholder={replyingTo ? `Reply to ${replyingTo.isUser ? 'your message' : 'ArtBlock'}...` : pendingImages.length > 0 ? "Describe what you want me to do with these images..." : "Send a message to ArtBlock"}
 placeholderTextColor={"#00000070"}
 value={defTextInputValue}
 onChangeText={setDefTextInputValue}
 onFocus={handleMainInputFocus}
 onSubmitEditing={() => handleSendMessage()}/>
 </Animated.View>

<Pad
 direction="row"
 justify="flex-end"
 align="center"
 style={[{ width: "20%" }]}>
 {isAiTyping ? (
 // Show Stop button when AI is typing
 <TouchableOpacity
 style={[
 {
 width: width * 0.08,
 height: width * 0.08,
 borderRadius: 100,
 backgroundColor: "#fff",
 shadowColor: "#444444",
 shadowOpacity: 0.15,
 shadowRadius: 7,
 shadowOffset: { width: 0, height: 0 },
 },
 styles.align,
 styles.justify,
 ]}
 activeOpacity={0.5}
 onPress={handleStopGeneration}>
 <View style={[{
 width: width * 0.03,
 height: width * 0.03,
 backgroundColor: '#000',
 borderRadius: width * 0.005,
 }]} />
 </TouchableOpacity>
 ) : hasInputContent ? (
 <TouchableOpacity
 style={[
 {
 width: width * 0.08,
 height: width * 0.08,
 borderRadius: 100,
 backgroundColor: "#000",
 shadowColor: "#000",
 shadowOpacity: 0.15,
 shadowRadius: 7,
 shadowOffset: { width: 0, height: 0 },
 },
 styles.align,
 styles.justify,
 ]}
 activeOpacity={0.5}
 onPress={() => handleSendMessage()}>
 <IconSend width={width * 0.045} height={width * 0.045} color="#fff"/>
 </TouchableOpacity>
 ) : (
 <TouchableOpacity
 style={[
 {
 width: width * 0.08,
 height: width * 0.08,
 borderRadius: 100,
 backgroundColor: "#fff",
 shadowColor: "#000",
 shadowOpacity: 0.15,
 shadowRadius: 7,
 shadowOffset: { width: 0, height: 0 },
 },
 styles.align,
 styles.justify,
 ]}
 activeOpacity={0.5}
 onPress={() => handleSendMessage()}>
 <IconVoice width={width * 0.06} height={width * 0.06}/>
 </TouchableOpacity>
 )}
</Pad>
 </Pad>
 </Pad>
 </LiquidGlassNode>
 </Animated.View>
 </View>
 </Pad>

 <Modal
 visible={showImageModal}
 transparent={true}
 animationType="fade"
 onRequestClose={() => setShowImageModal(false)}>
 <View style={[{
 flex: 1,
 backgroundColor: 'rgba(0,0,0,0.9)',
 justifyContent: 'center',
 alignItems: 'center',
 }]}>

 <View style={[{position: 'absolute',top: height * 0.06,right: width * 0.05,}]}>
 <LiquidGlassObject touchAction={() => setShowImageModal(false)} radius={width*1} width={width*.1} height={width*.1}
 style={[styles.align,styles.justify]}>
 <View style={[styles.center,styles.hFull]}>
 <TextBold size={width * 0.04} color="#fff" opacity={1}>✕</TextBold>
 </View>
 </LiquidGlassObject>
 </View>

 {imagePreview && (
 <PinchGestureHandler
 onGestureEvent={(event) => {
 setImageScale(Math.max(1, Math.min(event.nativeEvent.scale, 4)))
 }}
 onHandlerStateChange={(event) => {
 if (event.nativeEvent.state === State.END) {
 if (imageScale < 1.2) {
 setImageScale(1)
 }
 }
 }}>
 <Animated.View>
 {isImageLoading[imagePreview] !== false && (
 <View style={[{
 position: 'absolute',
 width: width * 0.9,
 height: height * 0.7,
 backgroundColor: 'rgba(255,255,255,0.1)',
 borderRadius: width * 0.04,
 justifyContent: 'center',
 alignItems: 'center',
 zIndex: 10,
 }]}>
 <ActivityIndicator size="large" color="#fff"/>
 <TextMed size={width * 0.04} color="#fff" style={[{marginTop: height * 0.02}]}>
 </TextMed>
 </View>
 )}
 <Image
 source={{ uri: imagePreview }}
 style={[{
 width: width * 0.9,
 height: height * 0.7,
 borderRadius: width * 0.04,
 transform: [{ scale: imageScale }]
 }]}
 resizeMode="contain"
 onLoadStart={() => {
 setIsImageLoading(prev => ({...prev, [imagePreview]: true}))
 }}
 onLoadEnd={() => {
 setIsImageLoading(prev => ({...prev, [imagePreview]: false}))
 }}
 />
 </Animated.View>
 </PinchGestureHandler>
 )}
 </View>
 </Modal>

 <Modal
 visible={showMessageOptions}
 transparent={true}
 animationType="none"
 onRequestClose={handleCloseMessageOptions}>
 <TouchableOpacity
 activeOpacity={1}
 onPress={handleCloseMessageOptions}
 style={[{
 flex: 1,
 backgroundColor: 'rgba(0,0,0,0.3)',
 }]}>
 {contextMenuPosition && selectedMessage && (
 <Animated.View
 style={[
 {
 position: 'absolute',
 left: contextMenuPosition.x,
 top: contextMenuPosition.y + contextMenuPosition.height + 8,
 minWidth: width * 0.45,
 backgroundColor: '#fff',
 borderRadius: width * 0.035,
 overflow: 'hidden',
 shadowColor: '#000',
 shadowOpacity: 0.25,
 shadowRadius: 12,
 shadowOffset: { width: 0, height: 4 },
 elevation: 8,
 },
 contextMenuAnimatedStyle,
 ]}>
 <TouchableOpacity
 activeOpacity={0.8}
 onPress={handleCopyMessage}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.016,
 paddingHorizontal: width * 0.04,
 backgroundColor: '#fff',
 }]}>
 <TextBold size={width * 0.038}>📋</TextBold>
 <TextMed size={width * 0.038} style={[{marginLeft: width * 0.03}]}>
 Copy
 </TextMed>
 </TouchableOpacity>

 <View style={[{height: 0.5, backgroundColor: '#e0e0e0'}]} />

 <TouchableOpacity
 activeOpacity={0.8}
 onPress={() => {
 setReplyingTo(selectedMessage)
 handleCloseMessageOptions()
 setTimeout(() => {
 subTextInputRef.current?.focus()
 simulateChatboxExpand?.()
 }, 200)
 }}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.016,
 paddingHorizontal: width * 0.04,
 backgroundColor: '#fff',
 }]}>
 <TextBold size={width * 0.038}>↩️</TextBold>
 <TextMed size={width * 0.038} style={[{marginLeft: width * 0.03}]}>
 Reply
 </TextMed>
 </TouchableOpacity>

 <View style={[{height: 0.5, backgroundColor: '#e0e0e0'}]} />

 <TouchableOpacity
 activeOpacity={0.8}
 onPress={() => {
 Share.share({ message: selectedMessage.text })
 handleCloseMessageOptions()
 }}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.016,
 paddingHorizontal: width * 0.04,
 backgroundColor: '#fff',
 }]}>
 <TextBold size={width * 0.038}>📤</TextBold>
 <TextMed size={width * 0.038} style={[{marginLeft: width * 0.03}]}>
 Share
 </TextMed>
 </TouchableOpacity>
 </Animated.View>
 )}
 </TouchableOpacity>
 </Modal>

 <Modal
 visible={showUserProfile}
 transparent={true}
 animationType="slide"
 onRequestClose={handleCloseUserProfile}>
 <View style={[{
 flex: 1,
 backgroundColor: 'rgba(0,0,0,0.5)',
 justifyContent: 'flex-end',
 }]}>
 <Animated.View
 style={[
 {
 backgroundColor: '#fff',
 borderTopLeftRadius: width * 0.06,
 borderTopRightRadius: width * 0.06,
 paddingBottom: height * 0.05,
 maxHeight: height * 0.7,
 },
 userProfileAnimatedStyle,
 ]}>
 <View style={[{
 alignItems: 'center',
 paddingTop: height * 0.015,
 paddingBottom: height * 0.01,
 }]}>
 <View style={[{
 width: width * 0.12,
 height: height * 0.005,
 backgroundColor: '#ccc',
 borderRadius: 100,
 }]} />
 </View>

 <ScrollView>
 <View style={[{
 alignItems: 'center',
 paddingVertical: height * 0.03,
 }]}>
 <Image 
 source={require("../assets/images/userfemale.png")}
 style={[{
 width: width * 0.25,
 height: width * 0.25,
 borderRadius: 100,
 }]}
 />
 <TextBold size={width * 0.055} style={[{marginTop: height * 0.015}]}>
 John Doe
 </TextBold>
 <TextMed size={width * 0.038} color="#666">
 john.doe@example.com
 </TextMed>
 
 {/* Skill Level Selector */}
 <View style={[{
 marginTop: height * 0.02,
 flexDirection: 'row',
 gap: width * 0.02,
 }]}>
 {(['beginner', 'hobby', 'pro'] as UserLevel[]).map((level) => (
 <TouchableOpacity
 key={level}
 activeOpacity={0.7}
 onPress={() => setUserLevel(level)}
 style={[{
 paddingHorizontal: width * 0.04,
 paddingVertical: height * 0.008,
 borderRadius: width * 0.02,
 backgroundColor: userLevel === level ? '#007AFF' : '#f0f0f0',
 }]}>
 <TextMed 
 size={width * 0.032} 
 color={userLevel === level ? '#fff' : '#666'}>
 {level.charAt(0).toUpperCase() + level.slice(1)}
 </TextMed>
 </TouchableOpacity>
 ))}
 </View>
 </View>

 <View style={[{
 paddingHorizontal: width * 0.05,
 }]}>
 <TouchableOpacity
 activeOpacity={0.7}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.018,
 borderBottomWidth: 1,
 borderBottomColor: '#f0f0f0',
 }]}>
 <TextBold size={width * 0.05}>👤</TextBold>
 <TextMed size={width * 0.042} style={[{marginLeft: width * 0.04, flex: 1}]}>
 Edit Profile
 </TextMed>
 <TextMed size={width * 0.04} color="#999">›</TextMed>
 </TouchableOpacity>

 <TouchableOpacity
 activeOpacity={0.7}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.018,
 borderBottomWidth: 1,
 borderBottomColor: '#f0f0f0',
 }]}>
 <TextBold size={width * 0.05}>⚙️</TextBold>
 <TextMed size={width * 0.042} style={[{marginLeft: width * 0.04, flex: 1}]}>
 Settings
 </TextMed>
 <TextMed size={width * 0.04} color="#999">›</TextMed>
 </TouchableOpacity>

 <TouchableOpacity
 activeOpacity={0.7}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.018,
 borderBottomWidth: 1,
 borderBottomColor: '#f0f0f0',
 }]}>
 <TextBold size={width * 0.05}>🎨</TextBold>
 <TextMed size={width * 0.042} style={[{marginLeft: width * 0.04, flex: 1}]}>
 My Artwork
 </TextMed>
 <TextMed size={width * 0.04} color="#999">›</TextMed>
 </TouchableOpacity>

 <TouchableOpacity
 activeOpacity={0.7}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.018,
 borderBottomWidth: 1,
 borderBottomColor: '#f0f0f0',
 }]}>
 <TextBold size={width * 0.05}>📊</TextBold>
 <TextMed size={width * 0.042} style={[{marginLeft: width * 0.04, flex: 1}]}>
 Analytics
 </TextMed>
 <TextMed size={width * 0.04} color="#999">›</TextMed>
 </TouchableOpacity>

 <TouchableOpacity
 activeOpacity={0.7}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.018,
 borderBottomWidth: 1,
 borderBottomColor: '#f0f0f0',
 }]}>
 <TextBold size={width * 0.05}>ℹ️</TextBold>
 <TextMed size={width * 0.042} style={[{marginLeft: width * 0.04, flex: 1}]}>
 About ArtBlock
 </TextMed>
 <TextMed size={width * 0.04} color="#999">›</TextMed>
 </TouchableOpacity>

 <TouchableOpacity
 activeOpacity={0.7}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.018,
 borderBottomWidth: 1,
 borderBottomColor: '#f0f0f0',
 }]}>
 <TextBold size={width * 0.05}>❓</TextBold>
 <TextMed size={width * 0.042} style={[{marginLeft: width * 0.04, flex: 1}]}>
 Help & Support
 </TextMed>
 <TextMed size={width * 0.04} color="#999">›</TextMed>
 </TouchableOpacity>

 <TouchableOpacity
 activeOpacity={0.7}
 style={[{
 flexDirection: 'row',
 alignItems: 'center',
 paddingVertical: height * 0.018,
 marginTop: height * 0.02,
 }]}>
 <TextBold size={width * 0.05}>🚪</TextBold>
 <TextMed size={width * 0.042} color="#FF3B30" style={[{marginLeft: width * 0.04, flex: 1}]}>
 Sign Out
 </TextMed>
 </TouchableOpacity>
 </View>
 </ScrollView>

 <TouchableOpacity
 activeOpacity={0.7}
 onPress={handleCloseUserProfile}
 style={[{
 marginHorizontal: width * 0.05,
 marginTop: height * 0.02,
 padding: width * 0.04,
 backgroundColor: '#007AFF',
 borderRadius: width * 0.03,
 alignItems: 'center',
 }]}>
 <TextBold size={width * 0.042} color="#fff">
 Close
 </TextBold>
 </TouchableOpacity>
 </Animated.View>
 </View>
 </Modal>
 </View>
 )
}