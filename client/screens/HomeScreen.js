import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import Auth from "../utils/auth";

const HomeScreen = () => {
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

  if (!user) {
    return <Text>Loading account...</Text>;
  }

  return (
    <SafeAreaView
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* // !! If user logs in via phone login, this works */}
      {/* <Text>{user && !user.data && !user.aud && "Phone login"}</Text> */}
      {/* // !! If user logs in via apple login, this works */}
      {/* <Text>
        {user && !user.data && user.aud && "Apple login"}
      </Text> */}
      {/* If user manually logs in, this displays */}
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {user && user.data && user.data.username}{" "}
          </Text>
          <View style={styles.innerCardWrapper}>
            <Text style={styles.body}>
              This is an example of a prompt that says something about this and
              something about that. Something beautiful, Something Ugly.
            </Text>
            <Text style={styles.learnBtn}>Learn More</Text>
          </View>
        </View>
      </View>
      <View style={{ position: "absolute", top: 100, right: 20 }}>
        <Button title="Chat" onPress={() => navigation.navigate("Chat")} />
      </View>
      <View style={{ position: "absolute", top: 100, left: 20 }}>
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
    flex: 0.75,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
  },
  card: {
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    marginTop: 50,
  },
  innerCardWrapper: {
    marginBottom: 100,
    paddingHorizontal: 20,
  },
  body: {
    textAlign: "left",
    fontSize: 20,
    marginBottom: 10,
  },
  learnBtn: {
    color: "blue",
    fontSize: 20,
  },
});

export default HomeScreen;
