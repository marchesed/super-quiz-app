import React, { FC } from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';
import { Colors, Styles } from '../GlobalStyles';

interface Props {
    buttonText: string;
    buttonPress: () => void;
    buttonData: ButtonData;
    isDisabled: boolean;
}

interface ButtonData {
    isSelected: boolean;
    isCorrect: boolean;
    isWrong: boolean;
}

const AnswerButton: FC<Props> = (props) => {
    return (
        <TouchableHighlight 
            style={[buttonStyles.button, 
                props?.buttonData?.isSelected ? buttonStyles.buttonSelected : {},
                props?.buttonData?.isCorrect ? buttonStyles.buttonCorrect : {},
                props?.buttonData?.isWrong ? buttonStyles.buttonWrong : {}]} 
            onPress={() => props.buttonPress()}
            underlayColor={Colors.yellow}
            disabled={props.isDisabled}>
            <Text style={[Styles.text, buttonStyles.buttonText]}>{props.buttonText}</Text>
        </TouchableHighlight>
    )
}

const buttonStyles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: Colors.pink,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5
    },
    buttonSelected: {
        backgroundColor: Colors.yellow,
    },
    buttonCorrect: {
        backgroundColor: 'lime'
    },
    buttonWrong: {
        backgroundColor: 'red'
    },
    buttonText: {
        color: 'white'
    }
})

export default AnswerButton