import React, { useRef } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Button,
  Vibration,
  Platform,
  Text,
} from "react-native";

const App = () => {
  // * --------- -------- -------- -------- ------- -------- ----- VIBRATION SETUP
  // ?----------------------- Vibration setup
  const ONE_SECOND_IN_MS = 1000;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
  ];

  const PATTERN_DESC =
    Platform.OS === "android"
      ? "wait 1s, vibrate 2s, wait 3s"
      : "wait 1s, vibrate, wait 2s, vibrate, wait 3s";

  // * --------- -------- -------- -------- ------- -------- ----- ANIMATION (TRANSITIONS) SETUP
  // ?----------------------- Fade in and Out transitions
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    // Will change fadeAnim value to 0 in a springy like fashion
    Animated.spring(fadeAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // * --------- -------- -------- -------- ------- -------- ----- DRAGGING COMPONENTS SETUP
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
        // The active positions
        // console.log(gestureState.moveX);
      },
      onPanResponderRelease: (e, gestureState) => {
        // THe position UPON release
        // console.log(gestureState.moveX, gestureState.moveY);

        Animated.spring(pan, {
          //.spring = back
          // Animated.timing(pan, {
          // .timing based
          toValue: { x: 0, y: 0 },
          // duration: 4000,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  // ?----------------------- Move and Drag a box and upon release, stay where it was originally
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
        // The active positions
        // console.log(gestureState.moveX);
      },
      onPanResponderRelease: () => {
        // Keeps the same position it had upon release
        pan2.extractOffset();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        {/* // * --------------------------------------------------- DRAGGABLE COMPONENTS SETUP */}
        <Animated.View
          style={{
            // Bind opacity to animated value
            opacity: fadeAnim,
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          }}
          {...panResponder.panHandlers}
        >
          <View style={styles.box} />
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ translateX: pan2.x }, { translateY: pan2.y }],
          }}
          {...panResponder2.panHandlers}
        >
          <View style={styles.box2} />
        </Animated.View>
        {/* // * --------------------------------------------------- ANIMATION (TRANSITION) SETUP */}
        <Button title="Fade In View" onPress={fadeIn} />
        <Button title="Fade Out" onPress={fadeOut} />
        {/* // * --------------------------------------------------- VIBRATION SETUP */}
        {Platform.OS === "android"
          ? [
              <View>
                <Button
                  title="Vibrate for 10 seconds"
                  onPress={() => Vibration.vibrate(10 * ONE_SECOND_IN_MS)}
                />
              </View>,
              <Separator />,
            ]
          : null}
        <Button
          title="Vibrate with pattern"
          onPress={() => Vibration.vibrate()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    height: 150,
    width: 150,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 5,
  },
  box2: {
    height: 150,
    width: 150,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 5,
  },
});

export default App;
