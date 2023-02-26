import { View, Text } from "react-native";
import React from "react";
import MobileVerify from "../components/MobileVerify";

const Welcome = () => {
  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MobileVerify />
    </View>
  );
};

export default Welcome;
