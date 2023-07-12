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
		async getAppImgLibList(params: { page_num: number; page_size: number; tags?: string; type?: number; url?: string }) {
			try {
				const res: Res = await axios.post(URL.APP_IMG_LIB, params);
				return res;
			} catch (err) {
				message.error("获取图片资源的网络错误，请重试");
			}
			return;
		},
		/**
		 * 图片修改
		 */
		async updateAppImgLib(params: { uuid: number; tags?: string; type?: number; url?: string }) {
			try {
				const res: Res = await axios.post(URL.APP_UPDATE_IMG, params);
				return res;
			} catch (err) {
				message.error("修改图片资源的网络错误，请重试");
			}
			return;
		},

		async delAppImgLib(params: { uuid: number }) {
			try {
				const res: Res = await axios.post(URL.APP_DEL_IMG, params);
				return res;
			} catch (err) {
				message.error("删除图片资源的网络错误，请重试");
			}
			return;
		},
	}),
};
