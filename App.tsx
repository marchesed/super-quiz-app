import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { Styles } from './GlobalStyles';
import { useFonts } from 'expo-font';
import Button from './components/Button';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Quiz from './screens/Quiz';

function Home({navigation}: any) {
  let [fontsLoaded] = useFonts({
    'CompFont': require('./assets/fonts/robothead.ttf'),
  });

  const startQuiz = () => {
    console.log('starting quiz')
    navigation.navigate('Quiz')
    navigation.reset({
      index: 0,
      routes: [{name: 'Quiz'}]
    })
  }
  if (!fontsLoaded) {
    return (
      <View style={Styles.container}>
        <Text>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  return (
    <View style={Styles.container}>
      <Text style={Styles.text}>Welcome to</Text>
      <Text style={Styles.header}>SuperQuizApp!</Text>
      <Text style={Styles.subtext}>Click the start quiz button below to start the quiz!</Text>
      <Button 
        buttonText={'START QUIZ'} 
        buttonPress={() => startQuiz()}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        <Stack.Screen name="Quiz" component={Quiz} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

