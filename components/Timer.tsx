import React, { FC, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Styles } from '../GlobalStyles';

interface Props {
    time: number;
    onComplete: () => void;
}

const Timer: FC<Props> = (props) => {
    const [timeLeft, setTimeLeft] = useState(props.time);
    
    useEffect(() => {
        let counter = props.time;
        const interval = setInterval(() => {
            counter--;
            setTimeLeft(counter)
            if (counter === 0) {
                clearInterval(interval)
                props.onComplete();
                return;
            } 
            
        }, 1000)
        return () => clearInterval(interval)
    },[]);
    return (
        <View>
            <Text>{timeLeft}</Text>
        </View>
    )
}

const buttonStyles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: Colors.pink,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white'
    }
})

export default Timer