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
		 * 图片资源列表
		 */
		async getSearchLogList(params: { page_num: number; content?: string; user_id?: number }) {
			try {
				const res: Res = await axios.post(URL.APP_SEARCH_LOG_LIST, params);
				return res;
			} catch (err) {
				message.error("获取搜索日志列表的网络错误，请重试");
			}
			return;
		},
	}),
};
