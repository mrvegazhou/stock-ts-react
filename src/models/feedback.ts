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
		async getAppFeedbackList(params: { page_num: number; page_size: number; content?: string; type?: number; contact?: string }) {
			try {
				const res: Res = await axios.post(URL.APP_FEEDBACKS, params);
				return res;
			} catch (err) {
				message.error("获取反馈信息的网络错误，请重试");
			}
			return;
		},
		/**
		 * 回复反馈信息
		 */
		async replyAppFeedback(params: { feedback_id: number; content?: string; to_user_id?: number }) {
			try {
				const res: Res = await axios.post(URL.APP_REPLY_FEEDBACK, params);
				return res;
			} catch (err) {
				message.error("回复反馈错误，请重试");
			}
			return;
		},

		async delAppFeedback(params: { uuid: number }) {
			try {
				const res: Res = await axios.post(URL.APP_DEL_FEEDBACK, params);
				return res;
			} catch (err) {
				message.error("删除反馈网络错误，请重试");
			}
			return;
		},

		async getReplyFeedbackList(params: { feedback_id: number }) {
			try {
				const res: Res = await axios.post(URL.APP_REPLY_FEEDBACK_LIST, params);
				return res;
			} catch (err) {
				message.error("反馈回复列表错误，请重试");
			}
			return;
		},
	}),
};
