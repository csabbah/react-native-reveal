import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from "react-native";

import React, { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/core";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PromptForm from "../components/profileSetup/PromptForm";
import GeneralForm from "../components/profileSetup/GeneralForm";

const ProfileSetup = ({ route }) => {
  // !! Replace all Alerts with UI updates

  const [user, setUser] = useState({});
  const [formProgress, setFormProgress] = useState(0);

  // Extract the phone number that was passed from previous screen
  const { phoneNumber, success } = route.params.data;

  const navigation = useNavigation();

  const [addUser, { data, error }] = useMutation(ADD_USER, {
    onCompleted: (data) => {
      // If data returned is valid, redirect to home page
      AsyncStorage.setItem("id_token", data.addUser.token).then(() => {
        navigation.navigate("Home");
      });
    },
  });

  const handleFormSubmit = () => {
    try {
      addUser({
        variables: { userToSave: user },
      });
    } catch (e) {
      Alert.alert("An error occurred while signing in.");
    }
  };

  const [showPrompts, setShowPrompts] = useState(false);
  const [promptProgress, setPromptProgress] = useState(0);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    phoneNumber && setUser({ ...user, phoneNumber: phoneNumber });
  }, [phoneNumber]);

  // Handle progressing through the forms
  const handleContinue = () => {
    // If show prompts is false then progress through the regular form
    if (!showPrompts) {
      return formProgress == questions.length - 1
        ? setShowPrompts(true)
        : setFormProgress(formProgress + 1);
    }
    // If show prompts true, that means we're looking through the prompts so progress them
    promptProgress == 1
      ? handleFormSubmit()
      : selectedItems.length !== 5
      ? alert("Need to choose 5 prompts to continue")
      : setPromptProgress(promptProgress + 1);
  };

  // Handle going back through the forms
  const handlePrevious = () => {
    // If show prompts is false then progress through the regular form
    if (!showPrompts) {
      return formProgress == 0
        ? navigation.navigate("Welcome")
        : setFormProgress(formProgress - 1);
    }

    // If show prompts true, that means we're looking through the prompts so progress them
    promptProgress == 0
      ? setShowPrompts(false)
      : setPromptProgress(promptProgress - 1);
  };

  return (
    <View style={styles.mainWrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.wrapper}>
          <View>
            <Text style={styles.header}>Welcome,</Text>
            <Text style={{ left: -20, fontSize: 20 }}>Nice to meet you!</Text>
          </View>

          {/* // ? The general questions i.e. 'What is your first name?' 'Want to secure your account?' */}
          {!showPrompts && (
            <GeneralForm
              styles={styles}
              formProgress={formProgress}
              user={user}
              setUser={setUser}
            />
          )}
          {/* // ? The prompts (questions and answers) */}
          {showPrompts && (
            <PromptForm
              styles={styles}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              promptProgress={promptProgress}
              user={user}
              setUser={setUser}
            />
          )}

          {/* // ? Below handles the progression of the form */}
          <View style={{ ...styles.inputWrapper, marginBottom: 100 }}>
            <TouchableOpacity onPress={handleContinue}>
              <View style={styles.continueBtn}>
                <Text style={{ fontSize: 16 }}>Continue</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePrevious}>
              <View
                style={{
                  ...styles.continueBtn,
                  backgroundColor: "#CCCBDA",
                }}
              >
                <Text style={{ fontSize: 16 }}>Go back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { width: 300, marginTop: 75, fontSize: 30, left: -20 },
  mainWrapper: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputWrapper: {
    width: Dimensions.get("screen").width,
    paddingHorizontal: 20,
  },
  inputHeader: {
    fontSize: 20,
    marginBottom: 5,
  },
  textInput: {
    borderBottomColor: "rgba(0,0,0,0.2)",
    paddingBottom: 4,
    borderBottomWidth: 0.5,
  },
  continueBtn: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 15,
    height: 50,
    backgroundColor: "#7CDB8A",
    borderRadius: 5,
  },
  dropDown: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.03)",
    marginBottom: 10,
  },
});

export default ProfileSetup;
