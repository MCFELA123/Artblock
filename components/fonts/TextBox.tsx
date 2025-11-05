import React from 'react';
import { Text, TextProps } from 'react-native';
import { useThemeContext } from '../styles/computed/themes';

interface TextBoxProps extends TextProps {
  children?: React.ReactNode;
  color?: string;
  align?: 'left' | 'right' | 'center';
  size?: number;
  opacity?: number;
  ltsp?: number;
  lnh?: number;
}

export const TextMed: React.FC<TextBoxProps> = ({ children, size, color, opacity=.7, ltsp, align, lnh, style, ...rest }) => {
  const { textColor } = useThemeContext()
  return (
  <Text style={{fontFamily:'Font-Regular',fontSize:size,color:color,opacity:opacity,lineHeight:lnh,letterSpacing:ltsp,textAlign:align}} {...rest}>{children}</Text>
  );
};

export const TextBold: React.FC<TextBoxProps> = ({ children, size, color, opacity=.7, ltsp, align, lnh, style, ...rest }) => {
  const { textColor } = useThemeContext()
  return (
  <Text style={{fontFamily:'Font-Bold',fontSize:size,color:color,opacity:opacity,lineHeight:lnh,letterSpacing:ltsp,textAlign:align}} {...rest}>{children}</Text>
  );
};

export const TextHeavy: React.FC<TextBoxProps> = ({ children, size, color, opacity=.7, ltsp, align, lnh, style, ...rest }) => {
  const { textColor } = useThemeContext()
  return (
  <Text style={{fontFamily:'Font-Heavy',fontSize:size,color:color,opacity:opacity,lineHeight:lnh,letterSpacing:ltsp,textAlign:align}} {...rest}>{children}</Text>
  );
};