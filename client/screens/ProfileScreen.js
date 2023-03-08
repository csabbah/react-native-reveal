import { View, Text, Button } from "react-native";
import React, { useEffect } from "react";

import Auth from "../utils/auth";
import { useNavigation } from "@react-navigation/core";

import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";

const ProfileScreen = () => {
  const navigation = useNavigation();
  var userData = useQuery(GET_ME, {
    fetchPolicy: "network-only",
  });
  var user = userData.data || [];

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
      <View>
        <Text>Your account:</Text>
        <Text>Name: {user?.me?.firstName}</Text>
        <Text>Gender: {user?.me?.gender}</Text>
        <Text>Additional Gender info: {user?.me?.additionalGenderInfo}</Text>
        <Text>Sexuality: {user?.me?.sexuality}</Text>
        <Text>Interest: {user?.me?.interest}</Text>
        <Text>
          Birthday: {user?.me?.dateOfBirth.month} {user?.me?.dateOfBirth.day}{" "}
          {user?.me?.dateOfBirth.year}
        </Text>
      </View>
      <Button title="Sign out" onPress={logout} />
    </View>
  );
};

export default ProfileScreen;
