import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { useMutation } from "@apollo/client";
import { LOGIN_USER_EMAIL, LOGIN_USER_APPLE } from "../utils/mutations";

// run this in terminal 'expo install expo-apple-authentication'
import * as AppleAuthentication from "expo-apple-authentication";
import jwtDecode from "jwt-decode";

import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = () => {
  const navigation = useNavigation();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [loginEmail, { data: loginEmailData, error: loginEmailError }] =
    useMutation(LOGIN_USER_EMAIL, {
      onCompleted: (data) => {
        AsyncStorage.setItem("id_token", data.loginEmail.token).then(() => {
          navigation.navigate("Home");
        });
      },
      onError: () => {
        Alert.alert("Incorrect Credentials");
      },
    });

  const [loginApple, { data: loginAppleData, error: loginAppleError }] =
    useMutation(LOGIN_USER_APPLE, {
      onCompleted: (data) => {
        AsyncStorage.setItem("id_token", data.loginApple.token).then(() => {
          navigation.navigate("Home");
        });
      },
      onError: () => {
        Alert.alert("Incorrect Credentials");
      },
    });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleFormSubmit = () => {
    if (!formState.email || !formState.password) {
      return Alert.alert("All Data must be filled.");
    }

    if (!emailRegex.test(formState.email)) {
      return Alert.alert("Please enter a valid email address.");
    }

    try {
      loginEmail({
        variables: { ...formState },
      });
    } catch (e) {
      console.log(e);
      Alert.alert("An error occurred while logging in.");
    }
  };

  const handleAppleSubmit = (sub) => {
    try {
      loginApple({
        variables: { sub: sub },
      });
    } catch (e) {
      console.log(e);
      Alert.alert("An error occurred while logging in.");
    }
  };

  const appleLoginOrRegister = async () => {
    try {
      const { identityToken } = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      // If identity token exists, the login was successful
      if (identityToken) {
        const decodedToken = jwtDecode(identityToken);
        // decodedToken.sub is the data we passed when we created the account
        // the sub property is a unique identifier (that is always consistent when using apple login)
        const sub = decodedToken.sub;
        handleAppleSubmit(sub);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        <Text style={{ marginTop: 7 }}>Email</Text>
        <TextInput
          style={{
            width: 300,
            fontSize: 18,
            paddingLeft: 5,
            paddingVertical: 6,
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
          type="email"
          placeholder="Your email address"
          name="email"
          onChangeText={(text) => setFormState({ ...formState, email: text })}
          value={formState.email}
          required
        />
        <Text style={{ marginTop: 7 }}>Password</Text>
        <TextInput
          style={{
            width: 300,
            fontSize: 18,
            paddingLeft: 5,
            paddingVertical: 6,
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
          type="password"
          placeholder="Your password"
          name="password"
          value={formState.password}
          required
          onChangeText={(text) =>
            setFormState({ ...formState, password: text })
          }
        />
        {/* Logs in using data from MongoDB  */}
        <View style={{ marginTop: 10 }}>
          <Button title="Login" onPress={handleFormSubmit} />
        </View>
        {/* Standard Apple Login  */}
        {Platform.OS === "ios" && (
          <Button onPress={appleLoginOrRegister} title="Apple login" />
        )}
        <Button
          title="Phone login"
          onPress={() => navigation.navigate("VerifyPhone")}
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <Button
          title="Go back"
          onPress={() => navigation.navigate("Welcome")}
        />
      </View>
    </View>
  );
};

export default SignInScreen;
