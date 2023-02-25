import { View, Text, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import Auth from "../utils/auth";

const HomeScreen = () => {
  const [user, setUser] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    async function getUser() {
      const token = await Auth.getToken();
      if (!token) {
        return navigation.navigate("SignIn");
      }
      const account = await Auth.getProfile(token);
      setUser(account);
    }

    getUser();
  }, [user, setUser]);

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
      <Text>{user && user.data.username}</Text>
      <Button title="Chat Page" onPress={() => navigation.navigate("Chat")} />
    </View>
  );
};

export default HomeScreen;
