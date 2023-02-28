import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

// run this in terminal 'expo install expo-apple-authentication'
import * as AppleAuthentication from "expo-apple-authentication";

import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = () => {
  const navigation = useNavigation();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [login, { data, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      AsyncStorage.setItem("id_token", data.login.token).then(() => {
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
      login({
        variables: { ...formState },
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
        // const decodedToken = jwtDecode(identityToken);
        // !! The identityToken reveals information about the users apple account (no username though)
        // !! Need to sign the user (similar to how we do for manual signup) so we can validate token after
        AsyncStorage.setItem("id_token", JSON.stringify(identityToken)).then(
          () => {
            navigation.navigate("Home");
          }
        );
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
          onPress={() => navigation.navigate("Welcome")}
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <Button
          title="Sign up manually"
          onPress={() => navigation.navigate("Signup")}
        />
      </View>
    </View>
  );
};

export default SignInScreen;
