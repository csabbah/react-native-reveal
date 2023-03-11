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
  PanResponder,
  Animated,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";

import React, { useState, useEffect, useRef } from "react";

import { useNavigation } from "@react-navigation/core";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as AppleAuthentication from "expo-apple-authentication";
import jwtDecode from "jwt-decode";

import Helpers from "../utils/helpers";

import { useQuery } from "@apollo/client";
import { ACCOUNT_EXISTS } from "../utils/queries";

import allPrompts from "../utils/prompts.json";

const ProfileSetup = ({ route }) => {
  // !! Clean up the form ui, its very messy
  // !! Replace all Alerts with UI updates

  const [user, setUser] = useState({});
  const [formProgress, setFormProgress] = useState(0);

  const [appleVerified, setAppleVerified] = useState(false);

  useAccountExists(user?.email, user?.apple, setAppleVerified).data;

  // This will check the email and apple account the user is attempting to use to secure their profile
  // Important note, this useQUery will only execute when there is a change in user.email and user.apple
  // That means in any other prompt, this query will not execute
  function useAccountExists(email, apple) {
    const { data, loading, error } = useQuery(ACCOUNT_EXISTS, {
      onCompleted: (data) => {
        if (data.isExistingUser.appleExists) {
          alert("Apple exists");
          setAppleVerified(false);
        }
        if (data.isExistingUser.emailExists) {
          alert("Email exists");
          setUser({ ...user, email: "" });
        }
      },
      variables: { email, apple },
    });

    return { data, loading, error };
  }

  // Extract the phone number that was passed from previous screen
  const { phoneNumber, success } = route.params.data;

  const navigation = useNavigation();

  const getIndexOfLabel = (labelToFind) => {
    const objIndex = questions.findIndex((obj) =>
      obj.label.includes(labelToFind)
    );
    return questions[objIndex].label.indexOf(labelToFind);
  };

  // Make sure only iOS users have the option to secure with Apple
  const secureProp =
    Platform.OS === "ios"
      ? [
          ["Enter an Email", "Enter a Password", "Apple"],
          ["email", "password", "apple"],
        ]
      : [
          ["Enter an Email", "Enter a Password"],
          ["email", "password"],
        ];

  const questions = [
    {
      label: secureProp[0],
      stateLabel: secureProp[1],
    },
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
      options: Helpers.returnHeights(),
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

  const attachAppleId = async () => {
    try {
      const { identityToken } = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      // If identity token exists, the login was successful
      if (identityToken) {
        const decodedToken = jwtDecode(identityToken);

        setAppleVerified(true);
        // Pass the sub property because it is a unique ID that is specific to this application and the user's apple ID
        // the Sub property will remain consistent even if user decides not to share their data
        setUser({ ...user, apple: decodedToken.sub });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ? ---------- --------- ---------- ---------- --------- --------- --------- All functions below are for handling prompts
  const [showPrompts, setShowPrompts] = useState(false);
  const [promptProgress, setPromptProgress] = useState(0);

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        Animated.event(
          [
            null,
            {
              dx: pan.x, // x,y are Animated.Value
              dy: pan.y,
            },
          ],
          { useNativeDriver: false }
        )(evt, gestureState);
      },
      onPanResponderRelease: () => {
        // Keeps the same position it had upon release
        pan.extractOffset();
      },
    })
  ).current;

  const [selectedItems, setSelectedItems] = useState([]);

  function handleItemClick(item) {
    // Find the index of the item that was clicked on
    const selectedItemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem === item
    );

    // If the index is -1, that means the item is not in the selected array
    if (selectedItemIndex === -1) {
      // In that case, add the item we selected to the selected items array IF there are less then 6 items
      if (selectedItems.length < 5) {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      // If item is found, spread the active items array
      const newSelectedItems = [...selectedItems];
      // Then remove the selected item
      newSelectedItems.splice(selectedItemIndex, 1);
      // Then updated the array
      setSelectedItems(newSelectedItems);
    }
  }

  function handleAnswerChange(question, text) {
    // If prompts object exists in the user object, return the object
    const prompts = user.prompts || [];
    // Get index of the current prompt by looking through the user state object 'prompts' object
    const existingPromptIndex = prompts.findIndex(
      (prompt) => prompt.question === question
    );

    // If text is empty
    if (!text) {
      // Remove that prompt from the array using splice method
      if (existingPromptIndex !== -1) {
        const newPrompts = [...prompts];
        newPrompts.splice(existingPromptIndex, 1);
        setUser({ ...user, prompts: newPrompts });
      }
    } else {
      // If text is valid, execute these:
      // If prompt EXISTS...
      if (existingPromptIndex !== -1) {
        // Updates the value of the prompt inside the user.prompts object
        // First spread the current array
        const newPrompts = [...prompts];
        // Then take the prompt index and update the answer key
        newPrompts[existingPromptIndex].answer = text;
        // Finally update the user object
        setUser({ ...user, prompts: newPrompts });
      } else {
        // If prompt DOES NOT EXIST
        // Simply add it
        setUser({ ...user, prompts: [...prompts, { question, answer: text }] });
      }
    }
  }

  useEffect(() => {
    phoneNumber && setUser({ ...user, phoneNumber: phoneNumber });

    // If promptProgress is 1, that means we're on the page where users are answering prompts....
    // If prompts already exists then...
    if (promptProgress == 1 && user.prompts) {
      // Check the current prompts and remove any prompts that weren't selected
      setUser({
        ...user,
        prompts: [
          // Spread the user.prompts and filter at the same time
          ...user.prompts
            .filter((prompt) => selectedItems.includes(prompt.question))
            .map((prompt) => ({ ...prompt })),
        ],
      });
    }
  }, [phoneNumber, promptProgress]);

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
            {!showPrompts &&
              questions[formProgress].label.map((prompt, i) => {
                return (
                  <View key={i}>
                    {formProgress == 0 && i == 0 && (
                      <Text>Secure your account. (Optional)</Text>
                    )}
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
                            data={Helpers.returnDates().years}
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
                            data={Helpers.returnDates().monthNames}
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
                            data={Helpers.returnDates().days}
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
                      <>
                        {/* // ? If it doesn't have both input types and doesn't have options, that means its just a regular input field */}
                        {prompt == "Apple" ? (
                          !appleVerified ? (
                            <Button
                              onPress={attachAppleId}
                              title="Secure with Apple"
                            />
                          ) : (
                            <Text>Apple Secured</Text>
                          )
                        ) : (
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
                      </>
                    )}
                  </View>
                );
              })}
          </View>
          {showPrompts && (
            <View
              style={{
                ...styles.inputWrapper,
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 100,
              }}
            >
              <Text style={{ ...styles.inputHeader, marginBottom: 20 }}>
                Let's add some prompts to your profile
              </Text>
              <View
                style={{
                  height: 400,
                  overflow: "scroll",
                }}
              >
                {promptProgress == 0 ? (
                  <Animated.View
                    style={{
                      zIndex: 1,
                      transform: [{ translateY: pan.y }],
                    }}
                    {...panResponder.panHandlers}
                  >
                    {allPrompts.map((prompt, i) => {
                      if (i >= 15) return;

                      const selectedItem = selectedItems.find(
                        (selectedItem) => selectedItem === prompt
                      );

                      return (
                        <TouchableOpacity
                          key={i}
                          style={{ marginVertical: 10 }}
                          onPress={() => {
                            handleItemClick(prompt);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 22,
                              color: selectedItem ? "red" : "black",
                            }}
                          >
                            {prompt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </Animated.View>
                ) : (
                  <View>
                    {selectedItems.map((item, i) => {
                      return (
                        <View key={i}>
                          <Text>{item}</Text>
                          <TextInput
                            style={{ ...styles.textInput, marginBottom: 10 }}
                            fontSize={28}
                            placeholder={"Enter your answer"}
                            onChangeText={(text) =>
                              handleAnswerChange(item, text)
                            }
                            defaultValue={
                              user.prompts &&
                              user.prompts.find((p) => p.question === item)
                                ?.answer
                            }
                          />
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          )}

          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                // If show prompts is false then progress through the regular form
                !showPrompts
                  ? formProgress == questions.length - 1
                    ? setShowPrompts(true)
                    : setFormProgress(formProgress + 1)
                  : // If show prompts true, that means we're looking through the prompts so progress them
                  promptProgress == 1
                  ? handleFormSubmit()
                  : selectedItems.length !== 5
                  ? alert("Need to choose 5 prompts to continue")
                  : setPromptProgress(promptProgress + 1)
              }
            >
              <View style={styles.continueBtn}>
                <Text style={{ fontSize: 16 }}>Continue</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // If show prompts is false then progress through the regular form
                !showPrompts
                  ? formProgress == 0
                    ? navigation.navigate("Welcome")
                    : setFormProgress(formProgress - 1)
                  : // If show prompts true, that means we're looking through the prompts so progress them
                  promptProgress == 0
                  ? setShowPrompts(false)
                  : setPromptProgress(promptProgress - 1);
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
