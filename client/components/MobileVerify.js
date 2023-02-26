import { View, Text, TouchableOpacity, Button, Alert } from "react-native";
import React, { useState, useRef, useEffect } from "react";

import PhoneInput from "react-native-phone-number-input";
import { sendSmsVerification } from "../api/verify";
import { useNavigation } from "@react-navigation/core";

import Auth from "../utils/auth";

const MobileVerify = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const phoneInput = useRef(null);

  useEffect(() => {
    async function checkToken() {
      const token = await Auth.getToken();
      if (token) {
        navigation.navigate("Home");
      }
    }
    checkToken();
  }, []);

  const phoneRegex =
    /^(\d{3}[- ]?\d{3}[- ]?\d{4}|\(\d{3}\)[- ]?\d{3}[- ]?\d{4})$/;
  const isValidPhoneNumber = (phoneNumber) => {
    return phoneRegex.test(phoneNumber);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ marginTop: 100, fontSize: 30 }}>
        Welcome! Can I have your digits?
      </Text>
      <View>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          Reveal uses your phone number to authenticate. Please enter our phone
          number:
        </Text>
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="US"
          layout="first"
          onChangeText={(text) => {
            setValue(text);
          }}
          onChangeFormattedText={(text) => {
            setFormattedValue(text);
          }}
          countryPickerProps={{ withAlphaFilter: true }}
          withShadow
        />
        <TouchableOpacity
          onPress={() => {
            if (isValidPhoneNumber(phoneInput)) {
              sendSmsVerification(formattedValue).then((sent) => {
                navigation.navigate("Otp", { phoneNumber: formattedValue });
              });
            }
            // !! Replace this alert with a prompt
            Alert.alert("Invalid Phone");
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginTop: 15,
              width: 312,
              height: 50,
              backgroundColor: "#7CDB8A",
            }}
          >
            <Text style={{ fontSize: 16 }}>Continue</Text>
          </View>
        </TouchableOpacity>
        <Button
          title="Already a member?"
          onPress={() => navigation.navigate("SignIn")}
        />
      </View>
      <View></View>
      <View></View>
    </View>
  );
};

export default MobileVerify;
