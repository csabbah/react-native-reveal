import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  Text,
  Image,
  TouchableHighlight,
} from "react-native";

import { useNavigation } from "@react-navigation/core";

import Auth from "../utils/auth";

const App = () => {
  const navigation = useNavigation();

  // * --------- -------- -------- -------- ------- -------- ----- SCREEN DIMENSIONS SETUP
  const { width } = Dimensions.get("screen");

  // * --------- -------- -------- -------- ------- -------- ----- PROFILE SETUP
  const DUMMY_DATA = [
    "THIS IS A TEST is an example of a prompt that says something about this and something about that. Something beautiful, Something Ugly.",
    "Here's another prompt about the person liking the color red",
    "And another prompt that shows more details about the person",
    "Last prompt that says something about them liking Marvel",
  ];

  // ! IMPORTANT NOTE
  // When working INSIDE PanResponder, we need to use useState and useRef combination to read the data as it is updated realtime
  const [prompt, setPrompt] = useState(0); // ! Updating state will trigger correctly BUT is not accurate realtime INSIDE PanResponder function
  const promptIndex = useRef(prompt); // ! Adding the state value here will allow us to use the realtime value INSIDE PanResponder function

  // This will allow us to visually reveal where the next/previous trigger is for advancing through prompts
  const [nextIndicator, setNextIndicator] = useState(false);
  const [prevIndicator, setPrevIndicator] = useState(false);

  // * --------- -------- -------- -------- ------- -------- ----- DRAGGING COMPONENTS SETUP
  const thresholdPercentage = 0.3; // adjust this value to change the threshold percentage
  const leftThreshold = width * thresholdPercentage * -1;
  const rightThreshold = width * (0.6 - thresholdPercentage);

  const handleIndicators = (gestureState) => {
    // By setting indicators to true, we visually display where the trigger cues occur
    if (gestureState.dx < leftThreshold) {
      return setNextIndicator(true);
    }
    // Only go back if the prompt index is not 0
    // 0 which means we're at the start
    // 4 means we're the end of the chain which means we're on the profile)
    if (
      gestureState.dx > rightThreshold &&
      (promptIndex.current !== 0 || promptIndex.current == 4)
    ) {
      return setPrevIndicator(true);
    }

    // If neither condition is met, no cues are available so revert to initial state
    setNextIndicator(false);
    setPrevIndicator(false);
  };

  const handleRelease = (gestureState, panToUpdate) => {
    // Upon drag release, revert indicators to initial state
    setNextIndicator(false);
    setPrevIndicator(false);

    // ? ----- ----- ----- ----- THIS HANDLES PROGRESSING TO THE NEXT PROMPTS
    // If the a certain threshold is crossed when dragging, progress or go back through the prompts
    if (gestureState.dx < leftThreshold && promptIndex.current !== 4) {
      // Updating state object MUST look like this, otherwise it doesn't work (Update useState but also include updating useRef)
      setPrompt((currentVal) => {
        // NEED to update the useRef here because useState updated value isn't realtime
        promptIndex.current = currentVal + 1;
        return currentVal + 1;
      });
    }

    // ? ----- ----- ----- ----- THIS HANDLES GOING BACK TO PREVIOUS PROMPTS
    // 0 which means we're at the start
    // 4 means we're the end of the chain which means we're on the profile
    if (
      gestureState.dx > rightThreshold &&
      promptIndex.current !== 0 &&
      promptIndex.current !== 4
    ) {
      setPrompt((currentVal) => {
        promptIndex.current = currentVal - 1;
        return currentVal - 1;
      });
    }

    // ? ----- ----- ----- ----- SAME FUNCTIONALITY AS ABOVE WHEN CROSSING THRESHOLDS, HOWEVER, THESE ARE EXECUTED WHEN ON PROFILE PAGE (AFTER GOING THROUGH ALL PROMPTS)
    // These will only execute if we're on the profile page (after going through all prompts)
    if (gestureState.dx < leftThreshold && promptIndex.current == 4) {
      alert("You Matched!");
    }

    if (gestureState.dx > rightThreshold && promptIndex.current == 4) {
      alert("You Reject!");
    }

    Animated.spring(panToUpdate, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  // ? ----------------------- Drag a box and upon release, return to initial position
  // Current value of X and Y positions
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

        // ? ----- ----- ----- ----- THIS HANDLES SETTING INDICATORS WHEN CERTAIN THRESHOLDS ARE CROSSED TO SERVE AS A VISUAL CUE
        handleIndicators(gestureState);
      },
      // The position UPON release
      onPanResponderRelease: (e, gestureState) => {
        handleRelease(gestureState, pan);
      },
    })
  ).current;

  const pan2 = useRef(new Animated.ValueXY()).current;
  const panResponder2 = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (evt, gestureState) => {
        Animated.event(
          [
            null,
            {
              dx: pan2.x, // x,y are Animated.Value
              dy: pan2.y,
            },
          ],
          { useNativeDriver: false }
        )(evt, gestureState);
        handleIndicators(gestureState);
      },
      // The position UPON release
      onPanResponderRelease: (evt, gestureState) => {
        handleRelease(gestureState, pan2);
      },
    })
  ).current;

  useEffect(() => {
    async function checkToken() {
      const token = await Auth.getToken();
      if (!token) {
        navigation.navigate("SignIn");
      }
    }
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableHighlight
        onPress={() => navigation.navigate("Profile")}
        style={{ ...styles.headerBtns, left: 20 }}
      >
        <Text
          style={{
            fontWeight: 500,
            color: "white",
            textAlign: "center",
            fontSize: 22,
          }}
        >
          Profile
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        onPress={() => navigation.navigate("Chat")}
        style={{ ...styles.headerBtns, right: 20 }}
      >
        <Text
          style={{
            fontWeight: 500,
            color: "white",
            textAlign: "center",
            fontSize: 22,
          }}
        >
          Chat
        </Text>
      </TouchableHighlight>
      <View style={styles.cards}>
        {prompt !== 4 && (
          <Animated.View
            style={{
              zIndex: 1,
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
          >
            <View style={styles.singleCard}>
              {prompt == 0 && (
                <Text style={styles.noData}>Nothing to see here!</Text>
              )}
              <Text
                style={{
                  ...styles.prompt,
                  color: prevIndicator
                    ? "red"
                    : nextIndicator
                    ? "green"
                    : "black",
                }}
              >
                {DUMMY_DATA[promptIndex.current]}
              </Text>
            </View>
          </Animated.View>
        )}

        <View>
          <Animated.View
            style={{
              transform: [
                // Setting this to 0 disabled dragging and ensures we can't move the profile when going through the prompts
                { translateX: prompt !== 4 ? 0 : pan2.x },
                { translateY: prompt !== 4 ? 0 : pan2.y },
              ],
            }}
            {...panResponder2.panHandlers}
          >
            <Image
              blurRadius={40 - promptIndex.current * 10}
              style={styles.image}
              source={require("../assets/p1.jpg")}
            />
          </Animated.View>
          {prompt == 4 && (
            <>
              <TouchableHighlight onPress={() => alert("You Matched")}>
                <View
                  style={{
                    position: "absolute",
                    bottom: 80,
                    right: 40,
                    height: nextIndicator ? 150 : 100,
                    width: nextIndicator ? 150 : 100,
                    borderRadius: 100,
                    justifyContent: "center",
                    alignSelf: "center",
                    backgroundColor: "#3D9970",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 500,
                      color: "white",
                      textAlign: "center",
                      fontSize: 22,
                    }}
                  >
                    Match icon
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => alert("You Rejected")}>
                <View
                  style={{
                    position: "absolute",
                    bottom: 80,
                    left: 40,
                    height: prevIndicator ? 150 : 100,
                    width: prevIndicator ? 150 : 100,
                    borderRadius: 100,
                    justifyContent: "center",
                    alignSelf: "center",
                    backgroundColor: "#FF4136",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 500,
                      color: "white",
                      textAlign: "center",
                      fontSize: 22,
                    }}
                  >
                    Reject icon
                  </Text>
                </View>
              </TouchableHighlight>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBtns: {
    position: "absolute",
    top: 60,
    height: 40,
    width: 90,
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FF4136",
    zIndex: 40,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cards: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  singleCard: {
    position: "absolute",
    top: 75,
    width: 350,
    height: 750,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignSelf: "center",
  },
  prompt: {
    fontWeight: 600,
    fontSize: 23,
  },
  noData: {
    top: 100,
    fontSize: 22,
    right: Dimensions.get("window").width / 1.5,
  },
  image: {
    bottom: 0,
    left: 0,
    height: Dimensions.get("window").height + 45,
    width: Dimensions.get("window").width,
    zIndex: -1,
  },
});

export default App;
