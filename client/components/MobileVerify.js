import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native";
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

  const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const isValidPhoneNumber = (phoneNumber) => {
    return phoneRegex.test(phoneNumber);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>Welcome! Can I have your digits?</Text>
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
          // Style of the country selector box
          containerStyle={styles.input}
          textContainerStyle={styles.input}
          onChangeText={(text) => {
            setValue(text);
          }}
          onChangeFormattedText={(text) => {
            setFormattedValue(text);
          }}
          countryPickerProps={{ withAlphaFilter: true }}
        />
        <TouchableOpacity
          onPress={() => {
            if (isValidPhoneNumber(value)) {
              return sendSmsVerification(formattedValue).then((sent) => {
                navigation.navigate("Otp", {
                  phoneNumber: formattedValue,
                });
              });
            }
            // !! Replace this alert with a prompt
            Alert.alert("Invalid Phone");
          }}
        >
          <View style={styles.continueBtn}>
            <Text style={{ fontSize: 16 }}>Continue</Text>
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: 10 }}>
          <Button
            title="Already a member?"
            onPress={() => navigation.navigate("SignIn")}
          />
        </View>
      </View>
      <View></View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: Dimensions.get("screen").width / 2,
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderRadius: 10,
  },
  header: { width: 300, marginTop: 100, fontSize: 30 },
  continueBtn: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 15,
    height: 50,
    backgroundColor: "#7CDB8A",
    borderRadius: 5,
  },
});

export default MobileVerify;
