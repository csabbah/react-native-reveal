import { View, Text, Button } from "react-native";
import Auth from "../utils/auth";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/core";

const ChatScreen = () => {
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
        navigation.navigate("SignIn");
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
      <Text>Chat Screen</Text>
      <Button title="Sign out" onPress={logout} />
    </View>
  );
};

export default ChatScreen;
