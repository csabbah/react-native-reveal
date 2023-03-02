// THIS IS MORE POLISHED?
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import Draggable from "react-native-draggable";

import { useNavigation } from "@react-navigation/core";

const HomeScreen = () => {
  const navigation = useNavigation();

  const [prompt, setPrompt] = useState(0);
  const [reset, setReset] = useState(false);
  const [swipeExecuted, setSwipeExecuted] = useState(false);

  var { width, height } = Dimensions.get("window");

  const DUMMY_DATA = [
    "THIS IS A TEST is an example of a prompt that says something about this and something about that. Something beautiful, Something Ugly.",
    "Here's another prompt about the person liking the color red",
    "And another prompt that shows more details about the person",
    "Last prompt that says something about them liking Marvel",
  ];

  const swipeFunctionality = (scrollPos) => {
    // Revert to original state upon swiping
    setReset(false);

    // Threshold is specific to the device
    // var threshold = width / 5;

    // Execute this function WHEN the user crosses a certain threshold
    // Since we use a reset state (which will update the swipeExecuted state)...
    // This ensures that the prompt doesn't keep updating even if user holds the window (to where the condition below is met)
    if (scrollPos > 100 && prompt !== 0 && !swipeExecuted) {
      console.log("Swiped left");
      setPrompt(prompt - 1);
      setSwipeExecuted(true);
    }

    if (scrollPos < -100 && !swipeExecuted) {
      console.log("Swiped Right");
      setSwipeExecuted(true);
      setPrompt(prompt + 1);
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
    <View style={styles.wrapper}>
      <View>
        <View>
          <View>
            <Draggable disabled={prompt !== 4}>
              <TouchableWithoutFeedback>
                <View>
                  <Image
                    blurRadius={40 - prompt * 10}
                    style={{ ...styles.image, opacity: 1 }}
                    source={require("../assets/p1.jpg")}
                  />
                  <Text
                    style={{
                      position: "absolute",
                      bottom: "50%",
                      fontWeight: 600,
                      left: -100,
                      fontSize: 25,
                    }}
                  >
                    Reject
                  </Text>
                  <Text
                    style={{
                      position: "absolute",
                      bottom: "50%",
                      fontWeight: 600,
                      right: -100,
                      fontSize: 25,
                    }}
                  >
                    Match
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </Draggable>
          </View>
          {prompt !== 4 && (
            <Draggable
              // disabled={true} < Disables Scroll
              // By Setting maxY and minY to the same value, it essentially disables vertical draggable
              maxY={height / 2}
              minY={height / 2}
              // Starting position of component
              //   x={width / 2}
              y={height / 2}
              shouldReverse={true}
              onPressIn={() => console.log("Box clicked")}
              onDragRelease={() => {
                // Execute this when the page returns to its initial state
                // Setting reset to true will reset the full swipe functionality
                console.log("Back to original state");
                setReset(true);
              }}
              // This returns position of component
              onDrag={(e, pos) => swipeFunctionality(pos.dx)}
            >
              <View styles={styles.singleCard}>
                <Text style={{ ...styles.prompt, right: 200, top: "50%" }}>
                  Nothing here!
                </Text>
                <Text style={styles.prompt}>{DUMMY_DATA[prompt]}</Text>
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
              </View>
            </Draggable>
          )}
        </View>
      </View>
      <View style={{ position: "absolute", top: 60, right: 10 }}>
        <Button title="Chat" onPress={() => navigation.navigate("Chat")} />
      </View>
      <View style={{ position: "absolute", top: 60, left: 10 }}>
        <Button
          title="Profile"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // alignContent: "center",
    // justifyContent: "center",
  },
  cardWrapper: {},
  singleCard: {},
  prompt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 20,
  },
  image: {
    height: Dimensions.get("window").height + 45,
    width: Dimensions.get("window").width,
    zIndex: -1,
  },
});

export default HomeScreen;
