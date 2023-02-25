import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeScreen,
  ChatScreen,
  SignUpScreen,
  SignInScreen,
} from "./screens/Index";
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="SignIn"
        component={SignInScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Signup"
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Chat"
        component={ChatScreen}
      />
      {/* // 'options={{ headerShown: false }}' Add this to remove default header styling */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
