import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  HomeScreen,
  ChatScreen,
  SignUpScreen,
  SignInScreen,
  WelcomeScreen,
  OtpScreen,
  ProfileScreen,
  TestScreen,
} from "./screens/Index";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        // Removes default header styling
        options={{ headerShown: false }}
        name="Test"
        component={TestScreen}
      /> */}
      <Stack.Screen
        // Removes default header styling
        options={{ headerShown: false }}
        name="Welcome"
        component={WelcomeScreen}
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
        component={OtpScreen}
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
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
        name="Chat"
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
