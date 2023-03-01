import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import Auth from "../utils/auth";

import Swipeable from "react-native-gesture-handler/Swipeable";

const HomeScreen = () => {
  // !! Screen dimensions
  // const SCREEN_HEIGHT = Dimensions.get("window").height;
  // const SCREEN_WIDTH = Dimensions.get("window").width;

  // !! Need to update this page, the data that is returns is different (based on login/signup method)
  // !! Figure out the structure of the app firsthand (wait to meet)
  const [user, setUser] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    async function getUser() {
      const token = await Auth.getToken();
      if (!token) {
        return navigation.navigate("SignIn");
      }

      // !! This needs to be updated to house real data
      // !! This is hardcoded for now to work with sms verification
      if (typeof token == "string" && token.includes("Logged in via Code")) {
        let parsedData = JSON.parse(token);
        return setUser(parsedData);
      }

      // !! This only works when logging in manually and use apple login
      // !! (the manual and apple login signs the user (and generates a valid token))
      const account = await Auth.getProfile(token);
      setUser(account);
    }

    getUser();
  }, []);

  const [prompt, setPrompt] = useState(0);

  const DUMMY_DATA = [
    {
      username: "user1",
      email: "user1@gmail.com",
      text: [
        "This is an example of a prompt that says something about this and something about that. Something beautiful, Something Ugly.",
        "Here's another prompt about the person liking the color red",
        "And another prompt that shows more details about the person",
        "Last prompt that says something about them liking Marvel",
      ],
      info: "NAME, AGE, HOMETOWN",
    },
    {
      username: "user1",
      email: "user1@gmail.com",
      text: [
        "User2 - This is an example of a prompt that says something about this and something about that. Something beautiful, Something Ugly.",
        "User2 - Here's another prompt about the person liking the color red",
        "User2 - another prompt that shows more details about the person",
        "User3 - prompt that says something about them liking Marvel",
      ],
      info: "NAME, AGE, HOMETOWN",
    },
  ];

  const LeftSwipeNextPromptActions = () => {
    return (
      // When working with Swipeable....
      // For the swiping to work, we need an element visible, otherwise, it's disabled
      prompt === 0 ? "" : <Text style={{ opacity: 0 }}>-</Text>
    );
  };

  const rightSwipePrevPromptActions = () => {
    return prompt === 4 ? (
      ""
    ) : (
      <Text style={{ opacity: 1, width: 0.5 }}>CARLOS IS THE BEST</Text>
    );
  };

  const LeftSwipeRejectAction = () => {
    if (prompt === 4) {
      return (
        <View
          style={{
            marginTop: 20,
            paddingBottom: 90,
            justifyContent: "center",
            right: 30,
            backgroundColor: "red",
            paddingHorizontal: 30,
          }}
        >
          <Text>REJECT</Text>
        </View>
      );
    }
  };

  const rightSwipeMatchAction = () => {
    if (prompt === 4) {
      return (
        <View
          style={{
            marginTop: 20,
            height: "100%",
            paddingBottom: 90,
            justifyContent: "center",
            right: 30,
            backgroundColor: "green",
            paddingHorizontal: 30,
          }}
        >
          <Text>MATCH</Text>
        </View>
      );
    }
  };
  const swipeLeftToReject = () => {
    alert("You rejected");
  };
  const swipeRightToMatch = () => {
    alert("You decided to match");
  };

  const swipeLeftToPreviousPrompt = () => {
    // alert("Swipe from left");
    setPrompt(prompt - 1);
  };
  const swipeRightToNextPrompt = () => {
    // alert("Swipe from right");
    setPrompt(prompt + 1);
  };

  if (!user) {
    return <Text>Loading account...</Text>;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* // !! If user logs in via phone login, this works */}
      {/* <Text>{user && !user.data && !user.aud && "Phone login"}</Text> */}
      {/* // !! If user logs in via apple login, this works */}
      {/* <Text>
        {user && !user.data && user.aud && "Apple login"}
      </Text> */}
      {/* If user manually logs in, this displays */}

      {/* // !! The entire block below needs to dynamically render Profiles */}
      {/* // !! Need to execute a query in the useEffect block and save data to user state */}
      <Swipeable
        renderLeftActions={LeftSwipeRejectAction}
        renderRightActions={rightSwipeMatchAction}
        onSwipeableRightOpen={swipeRightToMatch}
        onSwipeableLeftOpen={swipeLeftToReject}
      >
        <View style={styles.singleCard}>
          <View style={styles.cardWrapper}>
            <View></View>
            {prompt !== 4 && (
              <View style={styles.midSection}>
                <Swipeable
                  renderLeftActions={LeftSwipeNextPromptActions}
                  renderRightActions={rightSwipePrevPromptActions}
                  onSwipeableRightOpen={swipeRightToNextPrompt}
                  onSwipeableLeftOpen={swipeLeftToPreviousPrompt}
                >
                  <Text
                    style={{
                      ...styles.prompt,
                      height: 200,
                      backgroundColor: "transparent",
                    }}
                  >
                    {DUMMY_DATA[0].text[prompt]}
                  </Text>
                  {prompt == 0 && (
                    <Text
                      style={{
                        ...styles.prompt,
                        marginTop: 20,
                        fontSize: 16,
                      }}
                    >
                      Swipe left to learn more
                    </Text>
                  )}
                </Swipeable>
              </View>
            )}
            <View style={styles.bottomSection}>
              <View style={styles.infoWrapper}>
                <Text style={styles.info}>{DUMMY_DATA[0].info}</Text>
              </View>
            </View>
            {prompt === 4 && (
              <>
                <View style={{ position: "absolute", bottom: 100, right: 25 }}>
                  <Button onPress={() => swipeRightToMatch()} title="Match" />
                </View>
                <View style={{ position: "absolute", bottom: 100, left: 25 }}>
                  <Button
                    onPress={() => swipeLeftToReject()}
                    title="Don't Match"
                  />
                </View>
              </>
            )}
            <Image
              blurRadius={40 - prompt * 10}
              style={styles.image}
              source={require("../assets/p1.jpg")}
            />
          </View>
        </View>
      </Swipeable>

      <View style={{ position: "absolute", top: 60, right: 10 }}>
        <Button title="Chat" onPress={() => navigation.navigate("Chat")} />
      </View>
      <View style={{ position: "absolute", top: 60, left: 10 }}>
        <Button
          title="Profile"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  singleCard: {
    marginTop: 20,
    overflow: "hidden",
    flex: 0.95,
    width: 390,
    backgroundColor: "white",
  },
  midSection: {
    paddingHorizontal: 15,
  },
  bottomSection: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  prompt: {
    fontSize: 20,
    fontWeight: 500,
  },

  infoWrapper: {
    display: "flex",
    alignItems: "flex-start",
  },
  info: {
    fontSize: 20,
    fontWeight: 500,
  },

  image: {
    position: "absolute",
    zIndex: -1,
    height: "100%",
    width: "100%",
  },
});

export default HomeScreen;
