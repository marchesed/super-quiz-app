import React, { FC, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Styles } from '../GlobalStyles';

interface Props {
    time: number;
    questionNumber: number;
    onComplete: () => void;
}
const width = Dimensions.get('screen').width - 20;

const Timer: FC<Props> = (props) => {
    const [timeLeft, setTimeLeft] = useState(props.time);
    let barLength = useRef(new Animated.Value(width));
    let barColorValue = useRef(new Animated.Value(0));

    const barColor =  barColorValue.current.interpolate({
        inputRange: [0, 1],
        outputRange:["lime" , "red"]
      })
    useEffect(() => {
        let counter = props.time;
        Animated.parallel([
            Animated.timing(barLength.current, {
                toValue: 0,
                duration: props.time * 1000,
                useNativeDriver: false
            }),
            Animated.timing(barColorValue.current, {
                toValue:1,
                duration: props.time * 1000,
                useNativeDriver: false
            })
        ]).start(() => {
            Animated.parallel([
                Animated.timing(barLength.current, {
                    delay: 1000,
                    toValue: width,
                    duration: 1000,
                    useNativeDriver: false
                }),
                Animated.timing(barColorValue.current, {
                    delay: 1000,
                    toValue:0,
                    duration: 1000,
                    useNativeDriver: false
                })
            ]).start();
        });
        
        const interval = setInterval(() => {
            counter--;
            setTimeLeft(counter)
            if (counter === 0) {
                clearInterval(interval);
                setTimeLeft(10)
                props.onComplete();
                return;
            }
        }, 1000)
        return () => clearInterval(interval)
    },[props.questionNumber]);

    return (
        <SafeAreaView style={timerStyles.container}>
            <Animated.View style={[timerStyles.timeBar, {width: barLength.current, backgroundColor: barColor}]}></Animated.View>
            <Text style={[Styles.header, timerStyles.text]}>{timeLeft}</Text>
        </SafeAreaView>
    )
}

const timerStyles = StyleSheet.create({
    timeBar: {
        backgroundColor: 'lime',
        height: 20,
        left: 0,
        top: 10,
        position: 'absolute'
    },
    container: {
        position: 'absolute',
        top: 30,
        left: 10
    },
    text: {
        left: width/2
    }
})

export default Timer