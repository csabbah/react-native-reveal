// THIS IS MORE POLISHED?
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import Gestures from "react-native-easy-gestures";

const HomeScreen = () => {
  var { width, height } = Dimensions.get("window");

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
      <Gestures
        onChange={(event, posObj) => {
          console.log(posObj);
        }}
        onStart={() => console.log("Picked Up")}
        onEnd={() => console.log("Dropped")}
      >
        <Text>{DUMMY_DATA[0].text}</Text>
      </Gestures>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default HomeScreen;
