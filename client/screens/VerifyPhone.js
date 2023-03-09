import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useState, useRef } from "react";

import PhoneInput from "react-native-phone-number-input";
import { sendSmsVerification } from "../api/verify";
import { useNavigation } from "@react-navigation/core";

const VerifyPhone = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const phoneInput = useRef(null);

  const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const isValidPhoneNumber = (phoneNumber) => {
    return phoneRegex.test(phoneNumber);
  };

  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.wrapper}>
          <View>
            <Text style={styles.header}>Welcome,</Text>
            <Text style={{ left: -20, fontSize: 20 }}>
              Can I have your digits?
            </Text>
          </View>
          <View>
            <View style={{ marginBottom: 50 }}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Reveal uses your phone number to authenticate.
              </Text>
              <Text>Please enter our phone number:</Text>
            </View>
            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode="US"
              withShadow
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
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Welcome");
              }}
            >
              <View
                style={{ ...styles.continueBtn, backgroundColor: "#CCCBDA" }}
              >
                <Text style={{ fontSize: 16 }}>Go back</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ProfileSetup", {
                  data: { phoneNumber: "645-343-3433", success: "True" },
                });
              }}
            >
              <View
                style={{ ...styles.continueBtn, backgroundColor: "#CCCBDA" }}
              >
                <Text style={{ fontSize: 16 }}>Bypass (testing)</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View></View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderRadius: 10,
  },
  header: { width: 300, marginTop: 75, fontSize: 30, left: -20 },
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

export default VerifyPhone;
