import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";

import Auth from "../utils/auth";
import { useNavigation } from "@react-navigation/core";

import { useQuery } from "@apollo/client";
import { GET_USER } from "../utils/queries";

const ProfileScreen = () => {
  const [userId, setUserId] = useState("");

  const checkAcc = async () => {
    const token = await Auth.getToken();
    const profileId = await Auth.getProfile(token).data._id;

    setUserId(profileId);
  };

  const navigation = useNavigation();

  const { loading, error, data } = useQuery(GET_USER, {
    // This property and the 'network-only' value ensures it always fetches the latest data from the apollo server.
    // In short, it ensures if you attempt to login again during the same session that the data is unique based on the account
    fetchPolicy: "network-only",
    variables: { id: userId },
  });

  const user = data?.user;

  const logout = async () => {
    try {
      await Auth.logout().then(() => {
        navigation.navigate("Welcome");
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkAcc();

    if (user === null || error) {
      logout();
    }
  }, [user, error]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

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
        <Text>Name: {user && user?.firstName}</Text>
        <Text>Gender: {user && user?.gender}</Text>
        <Text>
          Additional Gender info: {user && user?.additionalGenderInfo}
        </Text>
        <Text>Sexuality: {user && user?.sexuality}</Text>
        <Text>Interest: {user && user?.interest}</Text>
        <Text>
          Birthday: {user && user?.dateOfBirth.month}{" "}
          {user && user?.dateOfBirth.day} {user && user?.dateOfBirth.year}
        </Text>
      </View>
      <Button title="Sign out" onPress={logout} />
    </View>
  );
};

export default ProfileScreen;
