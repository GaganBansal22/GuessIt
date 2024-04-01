import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, Pressable, FlatList, View, ImageBackground } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dropdown from 'react-native-dropdown-picker';

export default function CustomCategoryScreen({ navigation }) {
    useFocusEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    })
    const route = useRoute();
    const category = route.params?.category;
    const backgroundColor = route.params?.backgroundColor;
    const answers = route.params?.answers;
    const totalScore = route.params?.totalScore;
    const bounceValue = useRef(new Animated.Value(-750)).current;
    const [selectedDuration, setSelectedDuration] = useState(60);
    const [openDropDown, setOpenDropDown] = useState(false)
    useEffect(() => {
        Animated.spring(bounceValue, {
            toValue: 0,
            duration: 2000,
            friction: 3,
            tension: 30,
            useNativeDriver: true
        }).start()
    }, []);
    return (
        <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
            <ImageBackground source={require('../assets/categorybgImg.png')} style={styles.container}>
                <Animated.View style={[styles.popupBox, { transform: [{ translateY: bounceValue }] }]}>
                    <Pressable style={styles.closeButton} onPress={() => navigation.pop()}>
                        <Ionicons name="close" size={24} color="white" />
                    </Pressable>
                    {answers ?
                        <>
                            <Text style={styles.subHeading}>Total Score: {totalScore}</Text>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={answers}
                                renderItem={renderAnswer}
                            />
                        </>
                        :
                        <>
                            <Text style={styles.subHeading}>How to Play?</Text>
                            <Text style={styles.rules}>
                                Hold your phone on your forehead{'\n'}
                                <Text style={{ fontStyle: 'italic' }}>Tilt down to <Text style={{ color: '#00FF00' }}>ANSWER{"\n"}</Text></Text>
                                <Text style={{ fontStyle: 'italic' }}>Tilt up to <Text style={{ color: '#FF0000' }}>PASS</Text></Text>
                            </Text>
                        </>
                    }
                    <Text style={styles.rules}>Select Game duration</Text>
                    <View style={styles.durationDropdown}>
                        <Dropdown
                            open={openDropDown}
                            setOpen={setOpenDropDown}
                            items={[60,90,120].map(duration => ({
                                label: `${duration} seconds`,
                                value: duration
                            }))}
                            setValue={setSelectedDuration}
                            defaultValue={selectedDuration}
                            containerStyle={{ height: 40, width: '80%' }}
                            placeholder={`${selectedDuration} seconds`}
                        />
                    </View>
                    <Pressable
                        style={{ ...styles.playButton, backgroundColor }}
                        onPress={() => { navigation.navigate("CustomPlayGame", { category, backgroundColor,duration:selectedDuration }) }}>
                        <Text style={styles.playButtonText}>Play</Text>
                    </Pressable>
                </Animated.View>
            </ImageBackground>
        </View>
    );
}

function renderAnswer({ item }) {
    return (
        <Text style={item.answered ? styles.rightAnswer : styles.wrongAnswer}>{item.word}</Text>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    popupBox: {
        backgroundColor: "#000",
        maxHeight: "80%",
        minHeight: "30%",
        width: "80%",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
    },
    subHeading: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        marginVertical: "5%",
    },
    playButton: {
        paddingHorizontal: "20%",
        paddingVertical: "4%",
        borderRadius: 10,
        marginBottom: "5%",
        marginTop: "auto",
        textAlign: "center",
        textAlignVertical: "center",
    },
    rules: {
        color: "white",
        paddingHorizontal: "5%",
        marginBottom: "5%",
        textAlign: "center",
        fontSize: 20,
    },

    rightAnswer: {
        paddingHorizontal: "5%",
        marginBottom: "5%",
        textAlign: "center",
        fontSize: 20,
        color: "#00FF00",
    },
    wrongAnswer: {
        paddingHorizontal: "5%",
        textAlign: "center",
        marginBottom: "5%",
        fontSize: 20,
        color: "#FF0000",
    },
    playButtonText: {
        fontSize: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    closeButtonText: {
        color: 'white',
        fontSize: 20,
    },
    durationDropdown:{
        marginBottom: "10%",
    },
});