import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Button, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { checkVerification } from "../api/verify";
import OTPInputView from "@twotalltotems/react-native-otp-input";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useMutation } from "@apollo/client";
import { LOGIN_USER_PHONE } from "../utils/mutations";

const OtpScreen = ({ route }) => {
  const navigation = useNavigation();

  const { phoneNumber } = route.params;
  const [invalidCode, setInvalidCode] = useState(false);

  const [loginPhone, { data, error }] = useMutation(LOGIN_USER_PHONE, {
    onCompleted: (data) => {
      // If data exists, that means account exists with verified number
      AsyncStorage.setItem("id_token", data.loginPhone.token).then(() => {
        navigation.navigate("Home");
      });
    },
    // onError means no account was found based on inputted number
    onError: () => {
      navigation.navigate("ProfileSetup", {
        data: { phoneNumber },
      });
    },
  });

  const handleFormSubmit = () => {
    try {
      loginPhone({
        variables: { phoneNumber: phoneNumber },
      });
    } catch (e) {
      console.log(e);
      Alert.alert("An error occurred while logging in.");
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.prompt}>Enter the code we sent you</Text>
      <Text style={styles.message}>
        {`Your phone (${phoneNumber}) will be used to protect your account each time you log in.`}
      </Text>
      <Button
        title="Edit Phone Number"
        onPress={() => navigation.replace("Welcome")}
      />
      <OTPInputView
        style={{ width: "80%", height: 200 }}
        pinCount={5}
        autoFocusOnLoad
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={(code) => {
          checkVerification(phoneNumber, code).then((success) => {
            if (!success) return setInvalidCode(true);
            // Upon verification of phone, check the phone number against the data in DB
            // If account exists, login and load up the main application
            // If account doesn't exist, direct users to the 'profileCreation' page while also attaching the number they used/verified (to be posted to the account)
            handleFormSubmit();
          });
        }}
      />
      {invalidCode && <Text style={styles.error}>Incorrect code.</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "black",
    fontSize: 20,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  prompt: {
    fontSize: 24,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },

  message: {
    fontSize: 16,
    paddingHorizontal: 30,
  },

  error: {
    color: "red",
  },
});

export default OtpScreen;
