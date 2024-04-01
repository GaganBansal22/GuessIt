import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function NewCategoryScreen({ navigation }) {
    const [wordsFromUser, setWordsFromUser] = useState("")
    const [categoryName, setCategoryName] = useState("")
    async function addCategory(){
        try {
            if(wordsFromUser=="")
                return;
            let storedCategories = await AsyncStorage.getItem('AllCategoriesNames');
            if(storedCategories)
                storedCategories=JSON.parse(storedCategories)
            else
                storedCategories=[]
            storedCategories=storedCategories.filter(c=>c!=categoryName)
            storedCategories.push(categoryName)
            let words=wordsFromUser.split(',')
            words=words.filter(w=>w!="")
            await AsyncStorage.setItem('AllCategoriesNames', JSON.stringify(storedCategories));
            await AsyncStorage.setItem(`${categoryName}`, JSON.stringify(words));
            navigation.pop()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Enter Category name
            </Text>
            <TextInput
                editable={true}
                placeholder=""
                value={categoryName}
                onChangeText={setCategoryName}
                style={{ ...styles.input, marginBottom: "5%" }}
            />
            <Text style={styles.heading}>
                Enter words seperated by comma(,)
            </Text>
            <TextInput
                multiline={true}
                editable={true}
                placeholder=""
                value={wordsFromUser}
                onChangeText={setWordsFromUser}
                style={styles.input}
            />
            <Pressable style={styles.button} onPress={addCategory} >
                <Text style={styles.buttonText}>
                    Add
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: "5%",
        alignItems: "center",
    },
    input: {
        backgroundColor: '#8CD9B1',
        fontSize: 20,
        paddingHorizontal: "5%",
        paddingVertical: "2%",
        borderRadius: 10,
        width:"100%",
    },
    heading: {
        fontSize: 20,
        marginBottom: "2%",
        alignSelf:"flex-start",
    },
    button: {
        marginTop: "5%",
        width: "30%",
        paddingVertical:"5%",
        textAlign: "center",
        textAlignVertical: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#8CD9B1",
        borderRadius:10,
    },
    buttonText: {
        fontSize: 20
    }
});