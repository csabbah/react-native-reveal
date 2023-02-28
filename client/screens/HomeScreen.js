import { View, Text, Button } from "react-native";
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

      // !! This needs to be updated to house real data, this is hardcoded for now to work with sms verification
      if (typeof token == "string" && token.includes("Logged in via Code")) {
        let parsedData = JSON.parse(token);
        return setUser(parsedData);
      }

      // !! This only works when logging in manually (since the login process signs the user (and generates a valid token))
      const account = await Auth.getProfile(token);
      setUser(account);
    }

    getUser();
  }, []);

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
      {/* If user logs in via phone login, this works */}
      <Text>{user && !user.data && !user.aud && "Phone login"}</Text>
      <Text>
        {/* If user logs in via apple login, this works */}
        {user && !user.data && user.aud && "Apple login"}
      </Text>
      {/* If user manually logs in, this displays */}
      <Text>{user && user.data && user.data.username}</Text>
      <Button title="Chat Page" onPress={() => navigation.navigate("Chat")} />
    </View>
  );
};

export default HomeScreen;
