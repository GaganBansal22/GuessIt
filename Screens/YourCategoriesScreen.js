import { StyleSheet, Text, View, Pressable, ScrollView, LogBox, ImageBackground, Image } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

colors = ['#78D2AF', '#AC9CF3', '#F48CA3', '#CC8BD8', '#F5AF68', '#9AD8A2', '#E3A6E1', '#F5C4A7', '#B4B7F0', '#FFD75E']
Array.prototype.getRamdonElement = function () {
    return this[Math.floor(Math.random() * this.length)];
}

export default function YourCategoriesScreen({ navigation }) {
    LogBox.ignoreLogs(['new NativeEventEmitter()']);
    useFocusEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    })
    useEffect(() => { loadData() }, [])
    const loadData = async () => {
        try {
            const AllCategoriesNames = await AsyncStorage.getItem('AllCategoriesNames');
            if (AllCategoriesNames !== null)
                setAllCategories(JSON.parse(AllCategoriesNames));
        } catch (error) {
            ;
        }
    };
    const [allCategories, setAllCategories] = useState([])
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/homeScreenBackgroundImage.jpg')} style={styles.header}>
                <Text style={styles.headerText}>Your Categories</Text>
                <Image source={require('../assets/guessItIcon.png')} style={styles.headerImage}></Image>
            </ImageBackground>
            <ScrollView style={styles.categories}
                contentContainerStyle={styles.categoriesContent}
                indicatorStyle="white"
            >
                <Pressable
                    style={{ ...styles.categoryContainer, backgroundColor: '#8CD9B1' }}
                    onPress={() => { navigation.navigate("NewCategory") }}
                >
                    <Text style={styles.categoryText}>Add new Category</Text>
                </Pressable>
                {allCategories.map((cat) => {
                    let clr = colors.getRamdonElement();
                    return (
                        <Pressable
                            key={cat}
                            style={{ ...styles.categoryContainer, backgroundColor: `${clr}` }}
                            onPress={() => { navigation.navigate("CustomCategory", { category: cat, backgroundColor: clr }) }}
                        >
                            <Text style={styles.categoryText}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: 'black',
        borderTopWidth: 1,
        borderTopColor: 'black',
    },
    header: {
        height: 40,
        fontSize: 40,
        textAlign: "center",
        backgroundColor: "black",
        color: "whit",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white',
    },
    headerImage: {
        width: 26,
        height: 26,
        marginHorizontal: 10,
    },
    categories: {
        flex: 1,
        display: "flex",
        marginTop: "5%"
    },
    categoriesContent: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly"
    },
    categoryContainer: {
        display: "flex",
        width: "45%",
        padding: "10%",
        textAlign: "center",
        textAlignVertical: "center",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "2%",
        borderRadius: 10,
        fontSize: 20
    },
    blurContainer: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
    },
});