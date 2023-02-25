import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/core";

import Auth from "../utils/auth";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = () => {
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

  useEffect(() => {
    async function checkToken() {
      const token = await Auth.getToken();
      if (token) {
        navigation.navigate("Home");
      }
    }
    checkToken();
  }, []);

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
        <View style={{ marginTop: 20 }}>
          <Button title="Sign In" onPress={handleFormSubmit} />
        </View>
        <Button title="Sign Up" onPress={() => navigation.navigate("Signup")} />
      </View>
    </View>
  );
};

export default LoginScreen;
