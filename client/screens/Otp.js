import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { checkVerification } from "../api/verify";
import OTPInputView from "@twotalltotems/react-native-otp-input";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Otp = ({ route }) => {
  const navigation = useNavigation();

  const { phoneNumber } = route.params;
  const [invalidCode, setInvalidCode] = useState(false);
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

            // !! Temporary data passed, need to revise this section
            const user = {
              username: "Logged in via Code",
              email: "c@gmail.com",
              password: "asdiogn239",
            };
            AsyncStorage.setItem("id_token", JSON.stringify(user)).then(() => {
              navigation.navigate("Home");
            });
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

export default Otp;
