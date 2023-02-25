import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

import { useNavigation } from "@react-navigation/core";

import Auth from "../utils/auth";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = () => {
  const navigation = useNavigation();

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [addUser, { data, error }] = useMutation(ADD_USER);

  // Handle submit, if either data is missing or email is invalid, alert the user
  const handleFormSubmit = () => {
    if (!formState.username || !formState.email || !formState.password) {
      return Alert.alert("All Data must be filled.");
    }
    if (!emailRegex.test(formState.email)) {
      return Alert.alert("Please enter a valid email address.");
    }
    try {
      addUser({
        variables: { ...formState },
      });
    } catch (e) {
      Alert.alert(e);
    }
  };

  // If data returned is valid, redirect to home page
  if (data) {
    AsyncStorage.setItem("id_token", data.addUser.token).then(() => {
      navigation.navigate("Home");
    });
  }

  // Check the token, if they are already logged in, redirect to home page
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
        <Text>Username</Text>
        <TextInput
          style={{
            width: 300,
            fontSize: 18,
            paddingLeft: 5,
            paddingVertical: 6,
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
          type="text"
          placeholder="Your username"
          name="username"
          onChangeText={(text) =>
            setFormState({ ...formState, username: text })
          }
          value={formState.username}
          required
        />
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
          <Button title="Sign Up" onPress={handleFormSubmit} />
        </View>
        <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} />
      </View>
    </View>
  );
};

export default SignUpScreen;
