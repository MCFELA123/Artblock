import { StyleSheet } from 'react-native';
import { ThemeContext, useThemeContext } from './themes';

export const styles = StyleSheet.create({
 parentLayout: {
 width: '100%',
 height: '100%',
 },
 wFull: {
 width: '100%',
 display: 'flex',
 },
 wHalf: {
 width: '50%',
 display: 'flex',
 },
 hFull: {
 height: '100%',
 display: 'flex',
 },
 hHalf: {
 height: '50%',
 display: 'flex',
 },
 sizeFull: {
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 position: 'absolute',
 },
 flex: {
 display: 'flex'
 },
 column: {
 flexDirection:'column'
 },
 row: {
 flexDirection: 'row'
 },
 center: {
 width: '100%',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center'
 },
 centerFill: {
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center'
 },
 align: {
 display: 'flex',
 alignItems: 'center'
 },
 justify: {
 display: 'flex',
 justifyContent: 'center'
 },
 alignStart: {
 display: 'flex',
 alignItems: 'flex-start'
 },
 alignEnd: {
 display: 'flex',
 alignItems: 'flex-end'
 },
 justifyStart: {
 display: 'flex',
 justifyContent: 'flex-start'
 },
 justifyEnd: {
 display: 'flex',
 justifyContent: 'flex-end'
 },
 absolute: {
 position: 'absolute'
 },
 scrollShadowCover: {
 top: 0,
 left: 0,
 zIndex: 1,
 width: '100%',
 paddingVertical: 10,
 position: 'absolute'
 },
 layoutScroll: {
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 position: 'absolute',
 },
 pinnedItemsWrapper: {
 flexDirection: 'row',
 flexWrap: 'wrap',
 marginBottom: 20,
 },
 pinnedItems: {
 height: 115,
 width: '31%',
 },
 pinnedObject: {
 width: '100%',
 height: '80%',
 overflow: 'hidden',
 borderRadius: 11
 },
 navItems: {
 width: '20%',
 height: '100%',
 borderRadius: 100,
 },
 homeStartView: {
 width: '100%',
 height: 480,
 borderRadius: 27,
 overflow: 'hidden'
 },
 paginationBullets: {
 width: '25%',
 height: 5,
 borderRadius: 100,
 backgroundColor: '#afb3b35b'
 },
 activePaginationBullets: {
 backgroundColor: '#111518'
 },
});