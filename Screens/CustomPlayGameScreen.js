import { StyleSheet, Text, View, LogBox, StatusBar } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import CountdownTimerForStartingGame from '../components/CountdownTimerForStartingGame';
import { formatTime } from "../utils";
import { Accelerometer } from 'expo-sensors';
import * as ScreenOrientation from 'expo-screen-orientation';
import Gif from 'react-native-gif';
import AsyncStorage from '@react-native-async-storage/async-storage';

Array.prototype.getRamdonElement = function () {
    return this[Math.floor(Math.random() * this.length)];
}

export default function CustomPlayGameScreen({ navigation }) {
    useFocusEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        StatusBar.setHidden(true);
    })
    LogBox.ignoreLogs(['new NativeEventEmitter()']);
    const route = useRoute();
    const category = route.params?.category;
    const backgroundColor = route.params?.backgroundColor;
    const duration = route.params?.duration;
    const [words,setWords] = useState([])
    const [gameStarted, setGameStarted] = useState(false)
    const [totalgameTime] = useState(duration)
    const [timeLeft, setTimeLeft] = useState(0)
    const [totalScore, setTotalScore] = useState(0)
    const [answers, setAnswers] = useState([])
    const [currentWord, setCurrentWord] = useState("")
    const [tiltedUp, setTiltedUp] = useState(false)
    const [tiltedDown, setTiltedDown] = useState(false)
    const timeout = (time) => new Promise(resolve => setTimeout(resolve, time));
    let intervalId, gameStartedLocal = false, currentWordLocal = "", isTiltedLocal = false;
    useEffect(()=>{
        (async()=>{
            try {
                let storedWords = await AsyncStorage.getItem(`${category}`);
                storedWords=JSON.parse(storedWords)
                setWords(storedWords)
            } catch (error) {
                ;
            }
        })()
    },[])
    async function startGame() {
        currentWordLocal = words.getRamdonElement()
        setCurrentWord(currentWordLocal)
        setGameStarted(true)
        gameStartedLocal = true
        setTimeLeft(totalgameTime)
        intervalId = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000)
    }
    useEffect(() => {
        if (gameStarted && timeLeft == 0) {
            clearInterval(intervalId);
            navigation.navigate("CustomCategory", { category, answers, totalScore, backgroundColor })
        }
    }, [timeLeft])
    useEffect(() => {
        let subscription;
        Accelerometer.setUpdateInterval(1000);
        subscription = Accelerometer.addListener(async (accelerometerData) => {
            if (!gameStartedLocal && !isTiltedLocal) return;
            const threshold = 0.5;
            const isTiltedTowardsFloor = accelerometerData.z < -threshold;
            const isTiltedTowardsSky = accelerometerData.z > threshold;
            if (isTiltedTowardsFloor)
                setTotalScore(s => s + 1)
            if (isTiltedTowardsSky) {
                isTiltedLocal = true
                setTiltedUp(true)
                await timeout(1000)
                isTiltedLocal = false
                setTiltedUp(false)
            }
            if (isTiltedTowardsFloor) {
                isTiltedLocal = true
                setTiltedDown(true)
                await timeout(1000)
                isTiltedLocal = false
                setTiltedDown(false)
            }
            if (isTiltedTowardsFloor || isTiltedTowardsSky) {
                setAnswers(ans => {
                    ans.push({ word: currentWordLocal, answered: isTiltedTowardsFloor })
                    return ([...ans])
                })
                currentWordLocal = words.getRamdonElement()
                setCurrentWord(currentWordLocal)
            }
        });
        return () => {
            if (subscription)
                subscription.remove();
        };
    }, []);
    return (
        <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
            {tiltedDown && (
                <>
                    <View style={styles.gifContainerLeft}>
                        <Gif source={require('../assets/partypopper.gif')} style={styles.gif}/>
                    </View>
                    <View style={styles.gifContainerRight}>
                        <Gif source={require('../assets/partypopper.gif')} style={styles.gif}/>
                    </View>
                </>
            )}
            {!gameStarted ?
                <CountdownTimerForStartingGame startGame={startGame} backgroundColor={backgroundColor} />
                :
                <>
                    <Text style={{ ...styles.text, color: tiltedUp ? "#FF0000" : tiltedDown ? "#00FF00" : "black" }}>{currentWord}</Text>
                    <Text style={styles.text}>{formatTime(timeLeft)}</Text>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 50,
        textAlign: 'center'
    },
    gifContainerLeft: {
        position: 'absolute',
        top: 0,
        left: 20,
    },
    gifContainerRight: {
        position: 'absolute',
        right: 0,
        bottom: 20,
    },
    gif: {
        width: 200,
        height: 200,
    },
})