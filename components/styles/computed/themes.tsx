import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
 parentBackground: string;
 scrollShadowCoverBG: string;
 bottomShadowCoverBG: string;
 textColor: string;
 textColorV2: string;
 textInputColor: string;
 textInputBorderColor: string;
 objectColor: string;
 optionColor: string;
 objectBorderColor: string;
 flatListLineColoe: string;
 setDarkMode: () => void;
 setLightMode: () => void;
}

const ThemeMainContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [ parentBackground, setParentBackground ] = useState<"#ebeded" | "#020202">('#ebeded')
 const [ scrollShadowCoverBG, setScrollShadowCoverBG ] = useState<"#ffffff" | "#020202">('#ffffff')
 const [ bottomShadowCoverBG, setBottomShadowCoverBG ] = useState<"#666666" | "#020202">('#666666')
 const [ textColor, setTextColor ] = useState<"#111518" | "#ffffff">('#111518')
 const [ textColorV2, setTextColorV2 ] = useState<"#ffffff" | "#111518">('#ffffff')
 const [ textInputColor, setTextInputColor ] = useState<"#e0e1e1ff" | "#171c20ff">('#e0e1e1ff')
 const [ textInputBorderColor, setTextInputBorderColor ] = useState<"#a0a0a051" | "#1d2429ff">('#a0a0a051')
 const [ objectColor, setObjectColor ] = useState<"#ffffff" | "#18171cff">('#ffffff')
 const [ optionColor, setOptionColor ] = useState<"#e3e2e6ff" | "#e3e2e619">('#e3e2e6ff')
 const [ objectBorderColor, setObjectBorderColor ] = useState<"#e6e9f0ff" | "#202020">('#e6e9f0ff')
 const [ flatListLineColoe, setFlatListLineColor ] = useState<"#00000017" | "#ffffff20">('#00000017')
 
 const setDarkMode = () => {
 setTextColor('#ffffff')
 setTextColorV2('#111518')
 setParentBackground('#020202')
 }

 const setLightMode = () => {
 setTextColor('#111518')
 }

//  useEffect(() => {setDarkMode()},[])

 return (
 <ThemeMainContext.Provider value={{
 parentBackground,
 scrollShadowCoverBG,
 textColor,
 textColorV2,
 textInputColor,
 textInputBorderColor,
 objectColor,
 optionColor,
 objectBorderColor,
 flatListLineColoe,
 bottomShadowCoverBG,
 setDarkMode,
 setLightMode
 }}>
 {children}
 </ThemeMainContext.Provider>
 );
};

export const useThemeContext = (): ThemeContextType => {
 const context = useContext(ThemeMainContext);
 if (context === undefined) {
 throw new Error('useThemeContext must be used within a AppContext');
 }
 return context;
};