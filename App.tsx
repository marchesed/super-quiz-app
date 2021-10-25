import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { Styles } from './GlobalStyles';
import { useFonts } from 'expo-font';
import Button from './components/Button';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Quiz from './screens/Quiz';
import Summary from './screens/Summary';

function Home({navigation}: any) {
  let [fontsLoaded] = useFonts({
    'CompFont': require('./assets/fonts/robothead.ttf'),
  });

  const startQuiz = () => {
    navigation.navigate('Quiz');
    navigation.reset({
      index: 0,
      routes: [{name: 'Quiz'}]
    });
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
    <SafeAreaView style={Styles.container}>
      <Text style={Styles.text}>Welcome to</Text>
      <Text style={Styles.header}>SuperQuizApp!</Text>
      <Button 
        buttonText={'START QUIZ'} 
        buttonPress={() => startQuiz()}
      />
      <Text style={Styles.subtext}>Click the start quiz button above to start the quiz!</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        <Stack.Screen name="Quiz" component={Quiz} options={{headerShown: false}} />
        <Stack.Screen name="Summary" component={Summary} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
