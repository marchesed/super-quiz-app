import React, { FC } from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';
import { Colors, Styles } from '../GlobalStyles';

interface Props {
    buttonText: string;
    buttonPress: () => void;
}

const Button: FC<Props> = (props) => {
    return (
        <TouchableHighlight 
            style={buttonStyles.button} 
            onPress={() => props.buttonPress()}
            underlayColor={Colors.yellow}
        >
            <Text style={[Styles.text, buttonStyles.buttonText]}>{props.buttonText}</Text>
        </TouchableHighlight>
    )
}

const buttonStyles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10,
        backgroundColor: Colors.pink,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: Colors.white
    }
})

export default Button