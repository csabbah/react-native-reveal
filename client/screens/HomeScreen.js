import { View, Text, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import Auth from "../utils/auth";

const HomeScreen = () => {
  // !! Need to update this page, the data that is returns is different
  // !! Figure out the structure of the app firsthand (wait to meet)
  const [user, setUser] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    async function getUser() {
      const token = await Auth.getToken();
      if (!token) {
        return navigation.navigate("SignIn");
      }

      // !! This needs to be updated to house real data, this is hardcoded for now to work with sms verification
      if (
        typeof token == "string" &&
        token &&
        token.username === "Logged in via Code"
      ) {
        let parsedData = JSON.parse(token);
        return setUser(parsedData);
      }
      const account = await Auth.getProfile(token);
      setUser(account);
    }

    getUser();
  }, []);
  console.log(user);

  if (!user) {
    return <Text>Loading account...</Text>;
  }

  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* // !! If apple login is used, the username doesn't return */}
      <Text>
        {/* If user logs in via phone verification, this works */}
        {user && user.username == "Logged in via Code" && user.username}
      </Text>
      {/* If user manually logs in (no phone verification), this displays */}
      <Text>{user && user.data && user.data.username}</Text>
      <Button title="Chat Page" onPress={() => navigation.navigate("Chat")} />
    </View>
  );
};

export default HomeScreen;
