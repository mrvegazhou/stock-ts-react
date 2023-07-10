import axios from "@/utils/api/axios";
import { AdminState, UserInfo, Res, AdminRoleMenuPowers } from "@/models/index.type";
import { RootState } from "@/store/index";
import { URL } from "@/constants/index";
import { message } from "antd";
import tools from "@/utils/tools";

const defaultState: AdminState = {
	userinfo: {
		roles: [], // 当前用户拥有的角色
		menus: [], // 当前用户拥有的已授权的菜单
		powers: [], // 当前用户拥有的权限数据
		userBasicInfo: null, // 用户的基础信息，id,用户名...
	}, // 当前用户基本信息
	powersCode: [], // 当前用户拥有的权限code列表(仅保留了code)，页面中的按钮的权限控制将根据此数据源判断
	token: "",
};

export default {
	state: defaultState,
	reducers: {
		reducerUserInfo(state: AdminState, payload: UserInfo) {
			return {
				...state,
				userinfo: payload,
				powersCode: payload.powers.map((item) => item.code),
			};
		},
		reducerLogout(state: AdminState) {
			return {
				...state,
				userinfo: {
					menus: [],
					roles: [],
					powers: [],
				},
			};
		},
	},
	effects: (dispatch: any) => ({
		/**
		 * 登录
		 * @param { username, password } params
		 **/
		async onLogin(params: { username: string; password: string }) {
			try {
				const res: Res = await axios.post(URL.LOGIN, params);
				if (res?.code == 200) {
					sessionStorage.setItem("admin_token", res.data.token);
				} else {
					message.error("登录失败!");
				}
				return res;
			} catch (err) {
				message.error("网络错误，请重试");
			}
			return;
		},

		/**
		 * 退出登录
		 * @param null
		 **/
		async onLogout(params: { uuid: number }) {
			try {
				await axios.post(URL.LOGOUT, params);
				// 同 dispatch.admin.reducerLogout();
				dispatch({ type: "app/reducerLogout", payload: null });
				sessionStorage.removeItem("userinfo");
				sessionStorage.removeItem("admin_token");
				return "success";
			} catch (err) {
				message.error("网络错误，请重试");
			}
			return;
		},

		/**
		 * 设置用户信息
		 * @param: {*} params
		 * **/
		async setUserInfo(params: UserInfo) {
			dispatch.admin.reducerUserInfo(params);
			return "success";
		},

		/**
		 * 刷新用户权限 菜单 角色 信息
		 */
		async flushAdminRoleMenuPowers() {
			try {
				const res: Res | undefined = await axios.post(URL.ADMIN_ROLE_MENU_POWERS);
				if (res?.code == 200) {
					this.setUserInfo(res?.data);
					sessionStorage.setItem("userinfo", tools.compile(JSON.stringify(res?.data)));
				}
				let data: AdminRoleMenuPowers = res?.data;
				return data;
			} catch (err) {
				message.error("网络错误，请重试");
			}
			return;
		},
	}),
};
