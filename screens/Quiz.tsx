import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, View, StyleSheet, Dimensions, Alert } from "react-native";
import { Styles } from "../GlobalStyles";
import axios from "axios";
import AnswerButton from "../components/AnswerButton";
import Timer from "../components/Timer";
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const QUESTIONS_URL = 'https://scs-interview-api.herokuapp.com/questions';

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

const width = Dimensions.get('screen').width;

type RootStackParamList = {
    Home: undefined;
    Quiz: undefined;
    Summary: {numOfQuestions: number, numCorrect: number};
  };

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export default function Quiz ({navigation}: Props) {

    const [questions, setQuestions] = useState<Array<Question>>([]);
    const [numCorrect, setNumCorrect] = useState<number>(0);
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [buttonData, setButtonData] = useState<Array<ButtonData>>([]);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const answerRef = useRef(9001);

    const timerDone = () => {
        console.log('but data', buttonData)
        checkAnswer(answerRef.current);
    }

    const checkAnswer = async (answerSelected: number) => {
        console.log('option selected', answerSelected, questions[questionNumber].answer)
        if (answerSelected === questions[questionNumber].answer) {
            setNumCorrect(num => num+1)
            let newButtonData = [...buttonData];
            newButtonData[answerSelected] = {...newButtonData[answerSelected], isSelected: false, isCorrect: true}
            console.log('correct',newButtonData, buttonData)
            setButtonData(newButtonData)
        }
        else {
            let newButtonData = [...buttonData];
            newButtonData[answerSelected] = {...newButtonData[answerSelected], isSelected: false, isWrong: true}
            newButtonData[questions[questionNumber].answer] = {...newButtonData[questions[questionNumber].answer], isCorrect: true}
            console.log('wrong',newButtonData, buttonData)
            setButtonData(newButtonData)
        }
        setTimeout(async() => {
            console.log('should nav?',questionNumber,questions.length - 1)
            if (questionNumber === questions.length - 1){
                navigation.navigate('Summary', { numOfQuestions: questions.length, numCorrect: numCorrect });
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
            }
            catch {
                Alert.alert('An error has occurred during retrieval of the quiz questions :(', 
                'Please try again later',
                [{
                    text: 'Okay',
                    onPress: () => navigation.navigate('Home') 
                }])
                
            }
            
            
        })()
    }, []);
    
    const optionPress = (index: number) => {
        console.log('option selected',index)
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
                <Text style={Styles.text}>{questions[questionNumber].question}</Text>
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
        width: 300
    }
})