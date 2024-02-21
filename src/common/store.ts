import { createStore } from "vuex";
import router from "./router";
import { ICurrentPage, IEvent, IAlert, ILogSource } from "./model";
import { userList } from "../components/demo-user";
import { helper } from "../utils/helper";
import { ElNotification } from "element-plus";
import { demoEvent } from "../components/demo-event";
interface IState {
  isLogin: boolean;
  currentPage: string;
  tableDatas: any[];
  currentUser: any;
  eventDatas: IEvent[];
  alertDatas: IAlert[];
}

const store = createStore<IState>({
  state: {
    isLogin: false,
    currentPage: "",
    currentUser: {},
    eventDatas: demoEvent,
    alertDatas: demoEvent,
    configDatas: demoEvent,
    userDatas: demoEvent,
  },
  mutations: {
    setCurrentPage(state, payload) {
      state.currentPage = payload;
    },
    setCurrentUser(state, payload) {
      state.currentUser = payload;
    },
    setLogin(state, payload) {
      state.isLogin = payload;
    },
    setEventDatas(state, payload) {
      state.eventDatas = payload;
    },
    setAlertDatas(state, payload) {
      state.eventDatas = payload;
    },
    setConfigDatas(state, payload) {
      state.eventDatas = payload;
    },
    setUserDatas(state, payload) {
      state.eventDatas = payload;
    },
  },
  actions: {
    getLogin(context, payload) {
      const isExistUser = userList.filter(
        (item) => item.username === payload.username
      );
      if (!isExistUser.length) {
        return ElNotification({
          type: "error",
          title: "Error",
          message: "Not exist user",
          duration: 1000,
        });
      }
      if (isExistUser[0].password !== payload.password) {
        return ElNotification({
          type: "error",
          title: "Error",
          message: "Wrong password",
          duration: 1000,
        });
      }

      ElNotification({
        type: "success",
        title: "Successful",
        message: "Login succesful",
        duration: 1000,
      });
      helper.setCurrentUser(isExistUser);
      context.commit("setCurrentUser", isExistUser);
      context.commit("setLogin", true);
      context.commit("setCurrentPage", "event");
      router.push({ name: "event" });
      console.log(context.state.currentPage);
    },

    logout(context) {
      helper.deteteAccessToken();
      context.commit("setLogin", false);

      router.push({ name: "opening" });
    },

    getCurrentPage(context, payload) {
      context.commit("setCurrentPage", payload);
    },

    getCurrentPageMounted(context) {
      context.commit("setCurrentPage", router.currentRoute.value.name);
    },

    getCurrentUser(context) {
      const user = helper.getCurrentUser();
      console.log("user", user);
      if (user) {
        context.commit("setLogin", true);
        context.commit("setCurrentUser", user);
      }
    },

    getEventData(context, payload) {},
    getEventChart(context, payload) {},
    getAlertData(context, payload) {},
    getAlewrtChart(context, payload) {},
    getUserData(context, payload) {},
  },
});

export default store;
