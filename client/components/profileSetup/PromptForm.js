import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  PanResponder,
  Animated,
} from "react-native";

import React, { useRef, useEffect } from "react";

import allPrompts from "../../utils/prompts.json";

const PromptForm = ({
  styles,
  setSelectedItems,
  promptProgress,
  selectedItems,
  user,
  setUser,
}) => {
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
  }, [promptProgress]);

  return (
    <View
      style={{
        alignItems: "flex-start",
        justifyContent: "center",
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
                    onChangeText={(text) => handleAnswerChange(item, text)}
                    defaultValue={
                      user.prompts &&
                      user.prompts.find((p) => p.question === item)?.answer
                    }
                  />
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default PromptForm;
