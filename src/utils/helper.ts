export const helper = {
  setCurrentUser(val: any) {
    const userJson = JSON.stringify(val);
    return localStorage.setItem("userInfo", userJson);
    // return Cookies.set("accessToken", tokenVal);
  },
  getCurrentUser() {
    const userJson = localStorage.getItem("userInfo");
    if (userJson) {
      const userInfo = JSON.parse(userJson);
      return userInfo;
    }
    return "";
    // return Cookies.get("accessToken");
  },
  deteteAccessToken() {
    return localStorage.clear();
  },
};
