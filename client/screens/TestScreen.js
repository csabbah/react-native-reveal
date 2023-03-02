// THIS IS MORE POLISHED?
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import Auth from "../utils/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const HomeScreen = () => {
  var { width, height } = Dimensions.get("window");

  const navigation = useNavigation();

  const DUMMY_DATA = [
    {
      username: "user1",
      email: "user1@gmail.com",
      text: [
        "THIS IS A TEST is an example of a prompt that says something about this and something about that. Something beautiful, Something Ugly.",
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

  const [prompt, setPrompt] = useState(0);
  const [reset, setReset] = useState(false);
  const [swipeExecuted, setSwipeExecuted] = useState(false);
  const swipeFunctionality = (scrollPos) => {
    // Revert to original state upon swiping
    setReset(false);

    // Threshold is specific to the device
    var threshold = width / 5;
    var x = scrollPos;

    // Execute this function WHEN the user crosses a certain threshold
    // Since we use a reset state (which will update the swipeExecuted state)...
    // This ensures that the prompt doesn't keep updating even if user holds the window (to where the condition below is met)
    if (x > threshold && !swipeExecuted) {
      console.log("Swiped left");
      setPrompt(prompt + 1);
      setSwipeExecuted(true);
    }

    // Execute this when the page returns to its initial state
    // Setting reset to true will reset the full swipe functionality
    if (x == 0) {
      console.log("Back to original state");
      setReset(true);
    }
  };

  // Reset swipe functionality
  const resetSwipeState = () => {
    setSwipeExecuted(false);
  };

  // Reset swipe state ONLY when the reset state updates
  useEffect(() => {
    resetSwipeState();
  }, [reset]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        //   containerStyle keeps the width consistent on android
        contentContainerStyle={{ flexGrow: 1 }}
        alwaysBounceHorizontal={true}
        horizontal={true}
        scrollEventThrottle={100}
        onScroll={(e) => swipeFunctionality(e.nativeEvent.contentOffset.x)}
      >
        <View style={styles.singleCard}>
          <View style={styles.cardWrapper}>
            <View></View>
            <View style={styles.midSection}>
              <Text
                style={{
                  ...styles.prompt,
                  height: 200,
                  backgroundColor: "transparent",
                }}
              >
                {DUMMY_DATA[0].text[prompt]}
              </Text>
              <Text
                style={{
                  ...styles.prompt,
                  marginTop: 20,
                  fontSize: 16,
                }}
              >
                Swipe left to learn more
              </Text>
            </View>
            <View style={styles.bottomSection}>
              <View style={styles.infoWrapper}>
                <Text style={styles.info}>{DUMMY_DATA[0].info}</Text>
              </View>
            </View>

            <View style={{ position: "absolute", bottom: 100, right: 25 }}>
              <Button onPress={() => swipeRightToMatch()} title="Match" />
            </View>
            <View style={{ position: "absolute", bottom: 100, left: 25 }}>
              <Button onPress={() => swipeLeftToReject()} title="Don't Match" />
            </View>

            <Image
              blurRadius={40 - 0 * 10}
              style={styles.image}
              source={require("../assets/p1.jpg")}
            />
          </View>
        </View>
      </ScrollView>
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
