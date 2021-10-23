import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View, StyleSheet, Dimensions } from "react-native";
import { Styles } from "../GlobalStyles";
import axios from "axios";
import AnswerButton from "../components/AnswerButton";

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

export default function Quiz () {

    const [questions, setQuestions] = useState<Array<Question>>([]);
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [buttonData, setButtonData] = useState<Array<ButtonData>>([]);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [answerSelected, setAnswerSelected] = useState<number>(420);

    const startTimer = (time: number, quizQuestions: Array<Question>) => {
        setTimeLeft(time);
        let timer = setInterval(() => {
            setTimeLeft(timeLeft => timeLeft - 1);
            if(timeLeft < 1) {
                console.log('check answer', answerSelected)
                // checkAnswer(answerSelected, quizQuestions);
                clearInterval(timer);
                // setTimeout(() => {
                //     console.log('move to next Q',questionNumber)
                //     if (questionNumber < questions.length - 1) {
                //         // setButtonsDisabled(false);
                //         // setQuestionNumber(questionNumber => questionNumber+1);
                //         // generateButtonData(questions[questionNumber + 1].options)
                //         // startTimer(Number(questions[questionNumber + 1].time), quizQuestions)
                //     }
                // },3000);
            }
        }, 1000);
        
        setTimeout(() => {
            console.log('after interval is done')
            console.log('check answer', answerSelected)
        }, 10000)
    }

    function checkAnswer (answerSelected: number, quizQuestions: Array<Question>) {
        // console.log('input',answerSelected);
        // console.log('answer',questions[questionNumber].answer);
        if (answerSelected && quizQuestions && questionNumber) {
            if (answerSelected === quizQuestions[questionNumber].answer) {
                console.log('correct')
                let newButtonData = [...buttonData];
                newButtonData[answerSelected] = {...newButtonData[answerSelected], isSelected: false, isCorrect: true}
                setButtonData(newButtonData)
            }
            else {
                console.log('wrong')
                let newButtonData = [...buttonData];
                newButtonData[answerSelected] = {...newButtonData[answerSelected], isSelected: false, isWrong: true}
                newButtonData[quizQuestions[questionNumber].answer] = {...newButtonData[quizQuestions[questionNumber].answer], isCorrect: true}
                setButtonData(newButtonData)
            }
        }
        
    }

    useEffect(() => {
        (async () => {
          const questionsResponse = await axios.get<Array<Question>>(QUESTIONS_URL);
          console.log('time init', Number(questionsResponse.data[0].time));
          setQuestions(questionsResponse.data);
          generateButtonData(questionsResponse.data[0].options);
          startTimer(Number(questionsResponse.data[0].time), questionsResponse.data);
          setButtonsDisabled(false);
        })()
    }, []);

    useEffect(() => {
        console.log('question updated')
    }, [questionNumber])
    
    const optionPress = (index: number) => {
        console.log('option selected',index)
        setAnswerSelected(index);
        let newButtonData = [...buttonData];
        newButtonData[index] = {...newButtonData[index], isSelected: true}
        setButtonData(newButtonData)
        setButtonsDisabled(true);
        // if (questionNumber < questions.length - 1) {
        //     setQuestionNumber(questionNumber+1);
        //     generateButtonData(questions[questionNumber + 1].options)
        //     startTimer(Number(questions[questionNumber + 1].time))
        //     return;
        // }
        // return;
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
                <Text>{timeLeft}</Text>
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