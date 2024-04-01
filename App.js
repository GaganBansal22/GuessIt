import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './Screens/HomeScreen';
import PlayGame from './Screens/PlayGame';
import CategoryScreen from './Screens/CategoryScreen';
import YourCategoriesScreen from './Screens/YourCategoriesScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewCategoryScreen from './Screens/NewCategoryScreen';
import CustomCategoryScreen from './Screens/CustomCategoryScreen';
import CustomPlayGameScreen from './Screens/CustomPlayGameScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{flex:1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerStyle: styles.header }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PlayGame" component={PlayGame} options={{ headerShown: false }} />
          <Stack.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="YourCategories" component={YourCategoriesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NewCategory" component={NewCategoryScreen} />
          <Stack.Screen name="CustomCategory" component={CustomCategoryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CustomPlayGame" component={CustomPlayGameScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: "#78D2AF",
  }
});