import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatTime } from "../utils";
import Gif from 'react-native-gif';

const CountdownTimerForStartingGame = ({ startGame, backgroundColor }) => {
  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    if (seconds === 0) {
      startGame();
      return;
    }
    const intervalId = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 0) {
          clearInterval(intervalId);
          startGame();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [seconds]);
  return (
    <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
      <View style={styles.gifContainerTopRight}>
        <Gif
          style={styles.gif}
          source={require('./rotatescreen.gif')}
        />
      </View>
      <Text style={styles.text}>Starting in : {formatTime(seconds)}</Text>
      <View style={styles.gifContainerBottomLeft}>
        <Gif
          style={styles.gif}
          source={require('./rotatescreen.gif')}
        />
      </View>
    </View>
  );
};

export default CountdownTimerForStartingGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
  },
  gifContainerTopRight: {
    position: 'absolute',
    top: 10,
    right: -200,
    width: 100,
    height: 100,
  },
  gifContainerBottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: -200,
    width: 100,
    height: 100,
  },
  gif: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
})