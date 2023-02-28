import { View, Text, Button, StyleSheet } from "react-native";
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
      <Text>Your Chats</Text>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.body}>(Profile Pictures)</Text>
          <Text style={styles.body}>
            Hi Carlos! Nice to meet you, I'm gl...
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.body}>(Profile Pictures)</Text>
          <Text style={styles.body}>
            Hi Carlos! Nice to meet you, I'm gl...
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.body}>(Profile Pictures)</Text>
          <Text style={styles.body}>
            Hi Carlos! Nice to meet you, I'm gl...
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.body}>(Profile Pictures)</Text>
          <Text style={styles.body}>
            Hi Carlos! Nice to meet you, I'm gl...
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 10,
    width: "100%",
  },
  card: {
    paddingLeft: 10,
    paddingVertical: 20,
    marginVertical: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  body: {
    fontSize: 20,
  },
});

export default ChatScreen;
