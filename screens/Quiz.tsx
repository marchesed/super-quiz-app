import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, View, StyleSheet, Dimensions, Alert } from "react-native";
import { Colors, Styles } from "../GlobalStyles";
import axios from "axios";
import AnswerButton from "../components/AnswerButton";
import Timer from "../components/Timer";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

const QUESTIONS_URL = 'https://scs-interview-api.herokuapp.com/questions';
const TOAST_VISIBILITY = 2000;

interface Question {
    imageUrl: string;
    question: string;
    options: Array<string>;
    answer: number;
    time: string;
}

interface ButtonData {
    isSelected: boolean;
    isCorrect: boolean;
    isWrong: boolean;
}

type RootStackParamList = {
    Home: undefined;
    Quiz: undefined;
    Summary: {numOfQuestions: number, numCorrect: number};
  };

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export default function Quiz ({navigation}: Props) {

    const [questions, setQuestions] = useState<Array<Question>>([]);
    // const [numCorrect, setNumCorrect] = useState<number>(0);
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [buttonData, setButtonData] = useState<Array<ButtonData>>([]);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const answerRef = useRef(9001);
    const numCorrectRef = useRef(0);

    const timerDone = () => {
        checkAnswer(answerRef.current);
    }

    const checkAnswer = async (answerSelected: number) => {
        if (answerSelected === questions[questionNumber].answer) {
            Toast.show({
                type: 'success',
                text1: 'Correct!!',
                text2: 'Nice one 👏',
                visibilityTime: TOAST_VISIBILITY,
                position: 'bottom'
            });
            numCorrectRef.current = numCorrectRef.current + 1
            let newButtonData = [...buttonData];
            newButtonData[answerSelected] = {...newButtonData[answerSelected], isSelected: false, isCorrect: true}
            setButtonData(newButtonData)
        }
        else {
            Toast.show({
                type: 'error',
                text1: 'Incorrect',
                text2: 'Close!!',
                visibilityTime: TOAST_VISIBILITY,
                position: 'bottom'
            });
            let newButtonData = [...buttonData];
            newButtonData[answerSelected] = {...newButtonData[answerSelected], isSelected: false, isWrong: true}
            newButtonData[questions[questionNumber].answer] = {...newButtonData[questions[questionNumber].answer], isCorrect: true}
            setButtonData(newButtonData)
        }
        setTimeout(async() => {
            if (questionNumber === questions.length - 1){
                navigation.navigate('Summary', { numOfQuestions: questions.length, numCorrect: numCorrectRef?.current });
                return;
            } else {
                setButtonsDisabled(false);
                generateButtonData(questions[questionNumber+1].options);
                await setQuestionNumber(num => num+1);
                answerRef.current = 9001;
            }
        }, 3000)
    }

    useEffect(() => {
        (async () => {
            try {
                const questionsResponse = await axios.get<Array<Question>>(QUESTIONS_URL);
                await setQuestions(questionsResponse.data);
                await setQuestionNumber(0);
                await generateButtonData(questionsResponse.data[0].options);
                await setButtonsDisabled(false);
                numCorrectRef.current = 0;
            }
            catch {
                Alert.alert('An error has occurred during retrieval of the quiz questions :(', 
                'Please try again later',
                [{
                    text: 'Okay',
                    onPress: () => navigation.navigate('Home')
                }])
            }
        })();
    }, []);
    
    const optionPress = (index: number) => {
        answerRef.current = index;
        let newButtonData = [...buttonData];
        newButtonData[index] = {...newButtonData[index], isSelected: true}
        setButtonData(newButtonData)
        setButtonsDisabled(true);
        return;
    }

    const generateButtonData = (options: Array<string>) => {
        const defaultObj: ButtonData = {
            isCorrect: false,
            isSelected: false,
            isWrong: false
        }
        let buttonDataArray = []
        for(let i = 0; i < options.length; i++) {
            buttonDataArray.push(defaultObj)
        }
        setButtonData(buttonDataArray);
    }

    if (questions.length > 0) {
        return(
            <View style={Styles.container}>
                <Timer 
                    time={Number(questions[questionNumber].time)}
                    questionNumber={questionNumber}
                    onComplete={() => timerDone()}
                />
                <Image
                    style={quizStyles.questionImage} 
                    source={{ uri: questions[questionNumber].imageUrl }} 
                    resizeMode={'cover'}
                />
                <Text style={[Styles.text, quizStyles.question]}>{questions[questionNumber].question}</Text>
                <FlatList 
                    data = {questions[questionNumber].options}
                    style={{flexGrow: 0.5}}
                    renderItem = {({item, index}) => 
                        <AnswerButton 
                            buttonText={item} 
                            buttonPress={() => optionPress(index)}
                            buttonData={buttonData[index]}
                            isDisabled={buttonsDisabled}
                            />
                    }
                    keyExtractor={(item) => item}
                    scrollEnabled={false}
                />
                <Toast ref={(ref) => Toast.setRef(ref)}/>
            </View>
        )
    }
    return (
        <View style={Styles.container}>
            <Text>Loading...</Text>
        </View>
    )
}

const quizStyles = StyleSheet.create({
    questionImage: {
        height: 200,
        width: 300,
        margin: 10,
        borderRadius: 5,
        borderWidth: 5,
        borderColor: Colors.pink
    },
    question: {
        margin: 10,
        textAlign: 'center'
    }
})