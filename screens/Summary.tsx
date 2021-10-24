import React from 'react'
import { View, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Styles } from '../GlobalStyles';
import Button from '../components/Button';

type RootStackParamList = {
    Home: undefined;
    Quiz: undefined;
    Summary: {numOfQuestions: number, numCorrect: number};
  };

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;
export default function Summary({route, navigation}: Props) {

    const {numOfQuestions, numCorrect} = route.params;

    const restart = () => {
        navigation.navigate('Home');
    }

    return (
        <View style={Styles.container}>
            <Text style={Styles.header}>Quiz Complete!</Text>
            <Text style={Styles.text}>You got {numCorrect}/{numOfQuestions} correct!</Text>
            <Button
                buttonText={'GO HOME'} 
                buttonPress={() => restart()} 
            />
        </View>
    )
}
