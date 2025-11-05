import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;

export interface BlurViewProps {
 backgroundColor?: RGBA;
 blurRadius?: number;
 borderRadius?: number;
 bottomRadius?: number;
}

const BlurView = ({
 backgroundColor = 'rgba(255, 255, 255, 0.18)',
 blurRadius = 8,
 borderRadius,
 bottomRadius,
 ...props
}: BlurViewProps) => {
 const [ready, setReady] = useState(false);
 const wv = useRef<any>(null);

 const html = `
 <!doctype html>
 <html>
 <head>
 <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
 <style>
 html,body{height:100%;margin:0;background:transparent; -webkit-text-size-adjust:100%;}
 /* container that applies the backdrop blur */
 .blur {
 position: fixed;
 inset: 0;
 background: ${backgroundColor};
 -webkit-backdrop-filter: blur(${blurRadius}px) saturate(1.2) contrast(1.05) brightness(1.11);
 backdrop-filter: blur(${blurRadius}px) saturate(1.2) contrast(1.05) brightness(1.11);
 ${typeof borderRadius === 'number' ? `border-radius: ${borderRadius}px;` : ''}
 ${typeof bottomRadius === 'number' ? `
 border-bottom-left-radius: ${bottomRadius}px;
 border-bottom-right-radius: ${bottomRadius}px;` : ''}
 will-change: backdrop-filter;
 transform: translateZ(0); /* hint for GPU compositing */
 backface-visibility: hidden;
 -webkit-backface-visibility: hidden;
 }
 </style>
 </head>
 <body>
 <div class="blur"></div>
 </body>
 </html>
 `;

 return (
 <View
 style={{
 position: 'absolute',
 top: 0, left: 0, right: 0, bottom: 0,
 backgroundColor: 'transparent',
 overflow: 'hidden',
 }}
 pointerEvents="none">
 <WebView
 ref={wv}
 originWhitelist={['*']}
 source={{ html }}
 style={{
 flex: 1,
 backgroundColor: 'transparent',
 opacity: ready ? 1 : 0.999,
 }}
 javaScriptEnabled
 domStorageEnabled
 allowsInlineMediaPlayback
 injectedJavaScriptBeforeContentLoaded={`
 (function(){
 document.documentElement.style.background = 'transparent';
 document.body.style.background = 'transparent';
 document.body.style.margin = '0';
 // ensure the blur element exists early
 var el = document.querySelector('.blur');
 if (!el) {
 el = document.createElement('div');
 el.className = 'blur';
 document.body.appendChild(el);
 }
 true;
 })();
 `}
 onLoadEnd={() => {
 setReady(true);
 try { wv.current && wv.current.injectJavaScript("document.querySelector('.blur').style.transform = 'translateZ(0)'; true;"); } catch(e) {}
 }}
 scrollEnabled={false}
 {...props}/>
 </View>
 );
};

export default BlurView;