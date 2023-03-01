import StackNavigator from "./StackNavigator";
import { NavigationContainer } from "@react-navigation/native";

import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

// "http://10.0.0.96:3001/graphql" < This works on Physical phone and Android sim
// "http://localhost:3001/graphql" < This works on iOS sim
// !! For deployed app, it needs to be 'graphqlLiveWebsite.com/graphql'
const httpLink = createHttpLink({
  uri: "http://10.0.0.96:3001/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("id_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      {/* NavigationContainer is similar to react router */}
      <NavigationContainer>
        {/* StackNavigator contains all the pages */}
        <StackNavigator />
      </NavigationContainer>
    </ApolloProvider>
  );
}
