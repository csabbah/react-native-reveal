import { View, Text, TextInput, Button } from "react-native";

import React, { useState, useEffect } from "react";

import Helpers from "../../utils/helpers";

import questions from "../../utils/questions";

import * as AppleAuthentication from "expo-apple-authentication";
import jwtDecode from "jwt-decode";

import { useQuery } from "@apollo/client";
import { ACCOUNT_EXISTS } from "../../utils/queries";

import SelectDropdown from "react-native-select-dropdown";

const GeneralForm = ({
  styles,
  formProgress,
  user,
  setUser,
  setIsRequiredRilled,
  displayErr,
  setDisplayErr,
}) => {
  const [appleVerified, setAppleVerified] = useState(false);
  const [fieldMissing, setFieldMissing] = useState([formProgress, false, 0]);

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

  useAccountExists(user?.email, user?.apple, setAppleVerified).data;

  const getIndexOfLabel = (labelToFind) => {
    const objIndex = questions.findIndex((obj) =>
      obj.label.includes(labelToFind)
    );
    return questions[objIndex].label.indexOf(labelToFind);
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

  useEffect(() => {
    if (formProgress == 0) {
      if (user.password && (user.email == undefined || !user.email)) {
        // setFieldMissing['where we are at', 'if field is missing', 'the prompt index']
        setFieldMissing([formProgress, true, 0]);
        return setIsRequiredRilled(false);
      }
      if ((user.password == undefined || !user.password) && user.email) {
        setFieldMissing([formProgress, true, 1]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 1) {
      if (!user.firstName || user.firstName == undefined) {
        setFieldMissing([formProgress, true, 0]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 2) {
      if (
        !user.dateOfBirth ||
        !user.dateOfBirth.year ||
        !user.dateOfBirth.month ||
        !user.dateOfBirth.day
      ) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 3) {
      if (!user.gender || user.gender == undefined) {
        setFieldMissing([formProgress, true, 0]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 4) {
      if (!user.sexuality || user.sexuality == undefined) {
        setFieldMissing([formProgress, true, 0]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 5) {
      if (!user.interest || user.interest == undefined) {
        setFieldMissing([formProgress, true, 0]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 6) {
      if (!user.height || user.height == undefined) {
        setFieldMissing([formProgress, true, 0]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 7) {
      if (!user.ethnicity || user.ethnicity == undefined) {
        setFieldMissing([formProgress, true, 0]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 8) {
      if (!user.children || user.children == undefined) {
        setFieldMissing([formProgress, true, 0]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 9) {
      if (!user.home || user.home == undefined) {
        setFieldMissing([formProgress, true, 0]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 10) {
      if (!user.jobLocation || user.jobLocation == undefined) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
      if (!user.jobTitle || user.jobTitle == undefined) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 11) {
      if (!user.school || user.school == undefined) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
      if (!user.educationAttained || user.educationAttained == undefined) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 12) {
      if (!user.religiousBelief || user.religiousBelief == undefined) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 13) {
      if (!user.politicalBelief || user.politicalBelief == undefined) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
    } else if (formProgress == 14) {
      if (!user.drinker || user.drinker == undefined) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
      if (!user.smoker || user.smoker == undefined) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
      if (!user.drugUse || user.drugUse == undefined) {
        setFieldMissing([formProgress, true]);
        return setIsRequiredRilled(false);
      }
    }

    setFieldMissing([formProgress, false, 0]);
    setIsRequiredRilled(true);
  }, [user, formProgress]);

  return (
    <View style={styles.inputWrapper}>
      {/* Iterate through the questions.label array  */}
      {questions[formProgress].label.map((prompt, i) => {
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
                      flex: 0.33,
                      borderWidth: 0.8,
                      borderColor:
                        (displayErr &&
                          user.dateOfBirth !== undefined &&
                          (!user.dateOfBirth.year ||
                            user.dateOfBirth.year == undefined)) ||
                        (displayErr && user.dateOfBirth == undefined)
                          ? "red"
                          : "transparent",
                    }}
                    key={0}
                    data={Helpers.returnDates().years}
                    onSelect={(selectedItem) => {
                      setDisplayErr(false);
                      setUser({
                        ...user,
                        dateOfBirth: {
                          // If date of birth exists spread it, else, spread nothing
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
                      flex: 0.33,
                      marginHorizontal: 10,
                      borderWidth: 0.8,
                      borderColor:
                        (displayErr &&
                          user.dateOfBirth !== undefined &&
                          (!user.dateOfBirth.month ||
                            user.dateOfBirth.month == undefined)) ||
                        (displayErr && user.dateOfBirth == undefined)
                          ? "red"
                          : "transparent",
                    }}
                    key={1}
                    data={Helpers.returnDates().monthNames}
                    onSelect={(selectedItem) => {
                      setDisplayErr(false);
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
                      flex: 0.33,
                      borderWidth: 0.8,
                      borderColor:
                        (displayErr &&
                          user.dateOfBirth !== undefined &&
                          (!user.dateOfBirth.day ||
                            user.dateOfBirth.day == undefined)) ||
                        (displayErr && user.dateOfBirth == undefined)
                          ? "red"
                          : "transparent",
                    }}
                    key={3}
                    data={Helpers.returnDates().days}
                    onSelect={(selectedItem) => {
                      setDisplayErr(false);
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
                    style={{
                      ...styles.textInput,
                      marginBottom: 10,
                      borderBottomColor:
                        displayErr &&
                        // If the current data is missing
                        !user[questions[formProgress].stateLabel[1]] &&
                        // AND the prompt is required, display which one
                        questions[formProgress].isRequired[1] == true
                          ? "red"
                          : "black",
                    }}
                    fontSize={28}
                    placeholder={prompt}
                    onChangeText={(text) => {
                      setDisplayErr(false);
                      setUser({
                        ...user,
                        [questions[formProgress].stateLabel[1]]: text,
                      });
                    }}
                    defaultValue={
                      user[questions[formProgress].stateLabel[1]] &&
                      user[questions[formProgress].stateLabel[1]]
                    }
                  />
                ) : (
                  <SelectDropdown
                    // By adding the key, every time we generate a new SelectDropdown element, it re-renders
                    key={formProgress}
                    buttonStyle={{
                      ...styles.dropDown,
                      borderWidth: 0.8,
                      borderColor:
                        displayErr &&
                        // If the current data is missing
                        !user[questions[formProgress].stateLabel[0]] &&
                        // AND the prompt is required, display which one
                        questions[formProgress].isRequired[0] == true
                          ? "red"
                          : "transparent",
                    }}
                    data={questions[formProgress].options}
                    onSelect={(selectedItem, index) => {
                      setDisplayErr(false);
                      setUser({
                        ...user,
                        // Index of the label is equal to the index of the state label
                        // Label index is associated with state label index
                        [questions[formProgress].stateLabel[0]]: selectedItem,
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
                  buttonStyle={{
                    ...styles.dropDown,
                    borderWidth: 0.8,
                    borderColor:
                      displayErr &&
                      // If the current data is missing
                      !user[
                        questions[formProgress].stateLabel[
                          getIndexOfLabel(prompt)
                        ]
                      ] &&
                      // AND the prompt is required, display which one
                      questions[formProgress].isRequired[
                        getIndexOfLabel(prompt)
                      ] == true
                        ? "red"
                        : "transparent",
                  }}
                  buttonTextStyle={{
                    textAlign: "left",
                  }}
                  key={formProgress}
                  data={questions[formProgress].options}
                  onSelect={(selectedItem, index) => {
                    setDisplayErr(false);
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
                    <Button onPress={attachAppleId} title="Secure with Apple" />
                  ) : (
                    <Text>Apple Secured</Text>
                  )
                ) : (
                  <TextInput
                    style={{
                      ...styles.textInput,
                      marginBottom: 10,
                      borderBottomColor:
                        displayErr &&
                        // If the current data is missing
                        !user[
                          questions[formProgress].stateLabel[
                            getIndexOfLabel(prompt)
                          ]
                        ] &&
                        // AND the prompt is required, display which one
                        questions[formProgress].isRequired[
                          getIndexOfLabel(prompt)
                        ] == true
                          ? "red"
                          : "black",
                    }}
                    fontSize={28}
                    placeholder={prompt}
                    onChangeText={(text) => {
                      setDisplayErr(false);
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
      <Text>
        {displayErr && (
          <Text style={{ color: "red" }}>Fill all required fields</Text>
        )}
      </Text>
    </View>
  );
};

export default GeneralForm;
