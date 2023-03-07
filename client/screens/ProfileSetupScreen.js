import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TextInput,
  Button,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";

import React, { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/core";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileSetup = ({ route }) => {
  // !! Clean up the form ui, its very messy

  // Extract the phone number that was passed from previous screen
  const { phoneNumber, success } = route.params.data;

  const navigation = useNavigation();

  const getIndexOfLabel = (labelToFind) => {
    const objIndex = questions.findIndex((obj) =>
      obj.label.includes(labelToFind)
    );
    return questions[objIndex].label.indexOf(labelToFind);
  };

  const startYear = 1950; // You can replace this with any year you like
  const endYear = new Date().getFullYear(); // Get the current year

  // Create an array of years using a loop
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  const year = 2023; // Replace this with the year you want
  const month = 3; // Replace this with the month you want (1 = January, 2 = February, etc.)

  const numDays = daysInMonth(month, year);

  // Create an array of days of the month using a loop
  const days = [];
  for (let day = 1; day <= numDays; day++) {
    days.push(day);
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const heights = [];

  for (let i = 60; i <= 225; i++) {
    const cm = `${i}cm`;
    const ft = `${Math.floor(i / 30.48)}'${Math.round((i % 30.48) / 2.54)}"`;
    const height = `${cm} - ${ft}`;
    heights.push(height);
  }

  const [user, setUser] = useState({});

  const [formProgress, setFormProgress] = useState(0);

  const questions = [
    // {
    //   label: ["Enter a username", "Enter a password"],
    //   stateLabel: ["username", "password"],
    // },
    { label: ["What is your first name?"], stateLabel: ["firstName"] },
    {
      isDatePrompt: true,
      label: ["What is your date of birth?"],
      stateLabel: ["dateOfBirth"],
    },
    {
      hasBothInputTypes: true,
      label: [
        "How do you describe your gender?",
        "Optional: Describe more about your gender here",
      ],
      options: ["Male", "Female", "Intersex"],
      stateLabel: ["gender", "additionalGenderInfo"],
    },
    {
      label: ["What is your sexuality?"],
      options: [
        "Straight",
        "Gay",
        "Lesbian",
        "Bi-sexual",
        "Allosexual",
        "Demisexual",
      ],
      stateLabel: ["sexuality"],
    },
    {
      label: ["Who are you looking for?"],
      options: ["Men", "Women", "Intersex", "All genders"],
      stateLabel: ["interest"],
    },
    {
      label: ["How tall are you?"],
      stateLabel: ["height"],
      options: heights,
    },
    {
      label: ["What's your ethnicity?"],
      options: [
        "Indigenous",
        "Black",
        "East Asian",
        "Hispanic/Latino/LatinX",
        "Middle Eastern",
        "Pacific Islander",
        "South Asian",
        "Southeast Asian",
        "White",
        "Other",
      ],
      stateLabel: ["ethnicity"],
    },
    {
      label: ["Children?"],
      options: ["Yes", "No", "Want one day", "Don't want"],
      stateLabel: ["children"],
    },
    {
      label: ["Where's home?"],
      stateLabel: ["home"],
    },
    {
      label: ["Where do you work?", "What's your job title?"],
      stateLabel: ["jobLocation", "jobTitle"],
    },
    {
      hasBothInputTypes: true,
      label: ["Highest level of education", "Where did you go to school?"],
      options: ["High school", "Undergrad", "Postgrad"],
      stateLabel: ["educationAttained", "school"],
    },
    {
      label: ["What are your religious beliefs?"],
      options: [
        "Agnostic",
        "Atheist",
        "Buddhist",
        "Catholic",
        "Christian",
        "Hindu",
        "Jewish",
        "Muslim",
        "Sikh",
      ],
      stateLabel: ["religiousBelief"],
    },
    {
      label: ["What are your political beliefs?"],
      options: [
        "Liberal",
        "Moderate",
        "Conservative",
        "Non political",
        "Other",
      ],
      stateLabel: ["politicalBelief"],
    },
    {
      label: ["Do you drink?", "Do you smoke?", "Do you do drugs?"],
      options: ["Yes", "Sometimes", "No"],
      stateLabel: ["drinker", "smoker", "drugUse"],
    },
  ];

  useEffect(() => {
    phoneNumber && setUser({ ...user, phoneNumber: phoneNumber });
  }, [phoneNumber]);

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

  console.log(user);
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
            <Text style={{ left: -20, fontSize: 20 }}>Nice to meet you!</Text>
          </View>
          <View style={styles.inputWrapper}>
            {/* Iterate through the questions.label array  */}
            {questions[formProgress].label.map((prompt, i) => {
              return (
                <View key={i}>
                  <Text style={styles.inputHeader}>
                    {questions[formProgress].label[i]}
                  </Text>
                  {questions[formProgress].isDatePrompt ? (
                    <>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <SelectDropdown
                          buttonStyle={{
                            ...styles.dropDown,
                            flex: 0.5,
                          }}
                          buttonTextStyle={{
                            textAlign: "left",
                          }}
                          key={0}
                          data={years}
                          onSelect={(selectedItem) => {
                            setUser({
                              ...user,
                              dateOfBirth: {
                                ...(user.dateOfBirth || {}),
                                year: selectedItem,
                              },
                            });
                          }}
                          defaultButtonText={"Year"}
                          defaultValue={
                            user.dateOfBirth &&
                            user.dateOfBirth.year &&
                            user.dateOfBirth.year
                          }
                        />
                        <SelectDropdown
                          buttonStyle={{
                            ...styles.dropDown,
                            flex: 0.5,
                            marginHorizontal: 10,
                          }}
                          key={1}
                          data={monthNames}
                          onSelect={(selectedItem) => {
                            setUser({
                              ...user,
                              dateOfBirth: {
                                ...(user.dateOfBirth || {}),
                                month: selectedItem,
                              },
                            });
                          }}
                          defaultButtonText={"Month"}
                          defaultValue={
                            user.dateOfBirth &&
                            user.dateOfBirth.month &&
                            user.dateOfBirth.month
                          }
                        />
                        <SelectDropdown
                          buttonStyle={{
                            ...styles.dropDown,
                            flex: 0.5,
                          }}
                          key={3}
                          data={days}
                          onSelect={(selectedItem) => {
                            setUser({
                              ...user,
                              dateOfBirth: {
                                ...(user.dateOfBirth || {}),
                                day: selectedItem,
                              },
                            });
                          }}
                          defaultButtonText={"Day"}
                          defaultValue={
                            user.dateOfBirth &&
                            user.dateOfBirth.day &&
                            user.dateOfBirth.day
                          }
                        />
                      </View>
                    </>
                  ) : // ? If the current data has 'hasBothInputTypes', that means we are rendering an input and a select box
                  questions[formProgress].hasBothInputTypes ? (
                    <>
                      {/* // ? For the first one, render a regular text input. The second is always the select input */}
                      {i != 0 ? (
                        <TextInput
                          style={{ ...styles.textInput, marginBottom: 10 }}
                          fontSize={28}
                          placeholder={prompt}
                          onChangeText={(text) =>
                            setUser({
                              ...user,
                              [questions[formProgress].stateLabel[1]]: text,
                            })
                          }
                          defaultValue={
                            user[questions[formProgress].stateLabel[1]] &&
                            user[questions[formProgress].stateLabel[1]]
                          }
                        />
                      ) : (
                        <SelectDropdown
                          // By adding the key, every time we generate a new SelectDropdown element, it re-renders
                          key={formProgress}
                          buttonStyle={styles.dropDown}
                          data={questions[formProgress].options}
                          onSelect={(selectedItem, index) => {
                            setUser({
                              ...user,
                              // Index of the label is equal to the index of the state label
                              // Label index is associated with state label index
                              [questions[formProgress].stateLabel[0]]:
                                selectedItem,
                            });
                          }}
                          defaultButtonText={"Choose option..."}
                          defaultValue={
                            user[questions[formProgress].stateLabel[0]] &&
                            user[questions[formProgress].stateLabel[0]]
                          }
                        />
                      )}
                    </>
                  ) : // ? If it doesn't have both input types but it has options, that means it is meant to be a select input
                  questions[formProgress].options ? (
                    <>
                      <SelectDropdown
                        buttonStyle={styles.dropDown}
                        buttonTextStyle={{
                          textAlign: "left",
                        }}
                        key={formProgress}
                        data={questions[formProgress].options}
                        onSelect={(selectedItem, index) => {
                          setUser({
                            ...user,
                            // Index of the label is equal to the index of the state label
                            // Label index is associated with state label index
                            [questions[formProgress].stateLabel[
                              getIndexOfLabel(prompt)
                            ]]: selectedItem,
                          });
                        }}
                        defaultButtonText={"Choose option..."}
                        defaultValue={
                          user[
                            questions[formProgress].stateLabel[
                              getIndexOfLabel(prompt)
                            ]
                          ] &&
                          user[
                            questions[formProgress].stateLabel[
                              getIndexOfLabel(prompt)
                            ]
                          ]
                        }
                      />
                    </>
                  ) : (
                    // If it doesn't have both input types and doesn't have options, that means its just a regular input field
                    <TextInput
                      style={{ ...styles.textInput, marginBottom: 10 }}
                      fontSize={28}
                      placeholder={prompt}
                      onChangeText={(text) => {
                        setUser({
                          ...user,
                          [questions[formProgress].stateLabel[
                            getIndexOfLabel(prompt)
                          ]]: text,
                        });
                      }}
                      defaultValue={
                        user[questions[formProgress].stateLabel[i]] &&
                        user[questions[formProgress].stateLabel[i]]
                      }
                    />
                  )}
                </View>
              );
            })}
          </View>

          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                formProgress == questions.length - 1
                  ? handleFormSubmit()
                  : setFormProgress(formProgress + 1)
              }
            >
              <View style={styles.continueBtn}>
                <Text style={{ fontSize: 16 }}>Continue</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                formProgress == 0
                  ? navigation.navigate("Welcome")
                  : setFormProgress(formProgress - 1);
              }}
            >
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
          <View></View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { width: 300, marginTop: 75, fontSize: 30, left: -20 },
  wrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputWrapper: {
    height: 100,
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
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 10,
  },
});

export default ProfileSetup;
