import axios from "@/utils/api/axios";
import { Res, AppState } from "@/models/index.type";

import { URL } from "@/constants/index";
import { message } from "antd";

const defaultState: AppState = {};

export default {
	state: defaultState,
	reducers: {},
	effects: () => ({
		/**
		 * 反馈信息列表
		 */
		async getAppAdList(params: { page_num: number; page_size: number; content?: string; type?: number; url?: string }) {
			try {
				const res: Res = await axios.post(URL.APP_FEEDBACKS, params);
				return res;
			} catch (err) {
				message.error("获取广告信息的网络错误，请重试");
			}
			return;
		},
	}),
};
