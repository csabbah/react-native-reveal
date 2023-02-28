import { View, Text, Button } from "react-native";
import React, { useEffect } from "react";

import Auth from "../utils/auth";
import { useNavigation } from "@react-navigation/core";

const ProfileScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    async function checkToken() {
      const token = await Auth.getToken();
      if (!token) {
        navigation.navigate("SignIn");
      }
    }
    checkToken();
  }, []);

  const logout = async () => {
    try {
      await Auth.logout().then(() => {
        navigation.navigate("Welcome");
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ position: "absolute", top: 100 }}>
        <Button title="Home page" onPress={() => navigation.navigate("Home")} />
      </View>
      <Text>Your account:</Text>
      <Button title="Sign out" onPress={logout} />
    </View>
  );
};

export default ProfileScreen;
