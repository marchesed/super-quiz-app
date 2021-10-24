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

type Props = NativeStackScreenProps<RootStackParamList, 'Summary'>;

export default function Summary({route, navigation}: Props) {

    const {numOfQuestions, numCorrect} = route.params;

    return (
        <View style={Styles.container}>
            <Text style={Styles.header}>Quiz Complete!</Text>
            <Text style={Styles.text}>You got {numCorrect} out of {numOfQuestions} correct!</Text>
            {numCorrect === numOfQuestions &&
                <Text style={Styles.text}>That's a perfect score, great job!! 💯</Text>
            }
            <Button
                buttonText={'GO HOME'} 
                buttonPress={() => navigation.navigate('Home')} 
            />
            <Text style={Styles.subtext}>Click the button above to go back to the start</Text>
        </View>
    )
}
