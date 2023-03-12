import { View, Text, TextInput, Button } from "react-native";

import React, { useState } from "react";

import Helpers from "../../utils/helpers";

import questions from "../../utils/questions";

import * as AppleAuthentication from "expo-apple-authentication";
import jwtDecode from "jwt-decode";

import { useQuery } from "@apollo/client";
import { ACCOUNT_EXISTS } from "../../utils/queries";

import SelectDropdown from "react-native-select-dropdown";

const GeneralForm = ({ styles, formProgress, user, setUser }) => {
  const [appleVerified, setAppleVerified] = useState(false);

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
                    <Button onPress={attachAppleId} title="Secure with Apple" />
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
  );
};

export default GeneralForm;
