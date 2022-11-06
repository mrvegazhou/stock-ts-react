/**
 * 基础model,应用系统后台相关功能
 * 在src/store/index.js 中被挂载到store上，命名为 app
 **/
import axios from "@/utils/api/axios";
import { message } from "antd";
import { Dispatch } from "@/store/index";
import { AppState, Res, AppUserInfo } from "./index.type";
import { URL } from "@/constants/index";

const defaultState: AppState = {};

export default {
	state: defaultState,
	reducers: {},
	effects: (dispatch: Dispatch) => ({
		/**
		 * 条件分页查询应用用户列表
		 * **/
		async getAppUserList(params: { page_num: number; page_size: number; username?: string; status?: number }) {
			try {
				const res: Res = await axios.post(URL.APP_USER_LIST, params);
				return res;
			} catch (err) {
				message.error("网络错误，请重试");
			}
			return;
		},
		/**
		 * 修改菜单
		 * **/
		async upAppUserInfo(params: AppUserInfo) {
			try {
				const res: Res = await axios.post(URL.UPDATE_APP_USER_INFO, params);
				return res;
			} catch (err) {
				message.error("网络错误，请重试");
			}
			return;
		},
	}),
};
