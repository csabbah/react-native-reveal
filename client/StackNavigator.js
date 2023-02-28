import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Otp from "./screens/Otp";
import Welcome from "./screens/Welcome";
import {
  HomeScreen,
  ChatScreen,
  SignUpScreen,
  SignInScreen,
} from "./screens/Index";
import ProfileScreen from "./screens/ProfileScreen";
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        // Removes default header styling
        options={{ headerShown: false }}
        name="Welcome"
        component={Welcome}
      />
      <Stack.Screen
        // Removes default header styling
        options={{ headerShown: false }}
        name="SignIn"
        component={SignInScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Otp"
        component={Otp}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_left",
        }}
        name="Signup"
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
        name="Profile"
        component={ProfileScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Chat"
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
