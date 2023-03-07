import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

import { useNavigation } from "@react-navigation/core";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = () => {
  // !! This code uses previous functionality that allows users to signup with an email, username and password
  // !! Figure out if this screen is even necessary at all? Considering they can fully signup and login with phone verification
  // const navigation = useNavigation();

  // const [formState, setFormState] = useState({
  //   username: "",
  //   email: "",
  //   password: "",
  // });

  // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // const [addUser, { data, error }] = useMutation(ADD_USER, {
  //   onCompleted: (data) => {
  //     // If data returned is valid, redirect to home page
  //     AsyncStorage.setItem("id_token", data.addUser.token).then(() => {
  //       navigation.navigate("Home");
  //     });
  //   },
  // });

  // // Handle submit, if either data is missing or email is invalid, alert the user
  // const handleFormSubmit = () => {
  //   if (!formState.username || !formState.email || !formState.password) {
  //     return Alert.alert("All Data must be filled.");
  //   }
  //   if (!emailRegex.test(formState.email)) {
  //     return Alert.alert("Please enter a valid email address.");
  //   }
  //   try {
  //     addUser({
  //       variables: { ...formState },
  //     });
  //   } catch (e) {
  //     Alert.alert("An error occurred while signing in.");
  //   }
  // };

  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        {/* <Text>Username</Text>
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
        /> */}
        {/* <View style={{ marginTop: 10 }}>
          <Button title="Sign Up" onPress={handleFormSubmit} />
        </View> */}
        <View style={{ marginTop: 30 }}>
          <Button
            title="Go back"
            onPress={() => navigation.navigate("SignIn")}
          />
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
