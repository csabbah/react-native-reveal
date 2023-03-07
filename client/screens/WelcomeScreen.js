import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import Auth from "../utils/auth";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    async function checkToken() {
      const token = await Auth.getToken();
      if (token) {
        navigation.navigate("Home");
      }
    }
    checkToken();
  }, []);

  return (
    <View
      style={{
        height: "100%",
        width: Dimensions.get("screen").width,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <View style={styles.headerWrapper}>
        <Text style={{ fontSize: 70 }}>Reveal</Text>
        <Text style={{ fontSize: 30 }}>Be seen.</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableHighlight onPress={() => navigation.navigate("VerifyPhone")}>
          <View style={styles.button}>
            <Text style={{ color: "white", fontSize: 20 }}>Let's begin</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate("SignIn")}
        >
          <View
            style={{
              ...styles.button,
              backgroundColor: "white",
            }}
          >
            <Text style={{ fontSize: 16 }}>Already a member?</Text>
          </View>
        </TouchableHighlight>
      </View>
      <Image
        style={styles.image}
        source={require("../assets/welcomeScreen.jpg")}
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  headerWrapper: { position: "absolute", top: 80, left: 40 },
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 175,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 175,
    height: 50,
    backgroundColor: "purple",
  },
  image: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: Dimensions.get("window").height + 45,
    width: Dimensions.get("window").width,
    opacity: 0.4,
    zIndex: -5,
  },
});
