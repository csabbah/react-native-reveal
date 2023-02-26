import decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthService {
  // retrieve data saved in token
  getProfile(token) {
    return decode(token);
  }

  async loggedIn() {
    // check if the user is still logged in
    const token = await this.getToken(); // Checks if there is a saved token and it's still valid

    if (token == null || this.isTokenExpired(token)) {
      return false;
    }

    return true;
  }

  // check if the token has expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  // retrieve token from localStorage
  async getToken() {
    // Retrieves the user token from localStorage
    return await AsyncStorage.getItem("id_token");
  }

  // set token to localStorage and reload page to homepage
  async login(idToken) {
    // Saves user token to localStorage
    await AsyncStorage.setItem("id_token", idToken);
  }

  // clear token from localStorage and force logout with reload
  async logout() {
    // Clear user token and profile data from localStorage
    await AsyncStorage.removeItem("id_token");
  }
}
export default new AuthService();
