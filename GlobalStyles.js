import { StyleSheet } from 'react-native';

export var Colors = {
    pink: '#EF476F',
    yellow: '#FFD166',
    grey: '#06D6A0',
    blue: '#118AB2',
    darkBlue: '#073B4C',
    brightGreen: 'lime',
    brightRed: 'red'
}

export var Styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.blue,
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
        fontFamily: 'CompFont',
        fontSize: 26
    },
    subtext: {
        fontFamily: 'CompFont',
        fontSize: 20,
        textAlign: 'center'
    },
    header: {
        fontFamily: 'CompFont',
        fontSize: 42,
    }
});
  