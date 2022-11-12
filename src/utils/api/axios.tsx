/** 对axios做一些配置 **/
import NProgress from "@/config/nprogress";
import { baseUrl } from "@/config";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { AxiosCanceler } from "./axiosCancel";
import { checkStatus } from "./checkStatus";
import ReactDOM from "react-dom/client";
import Loading from "@/components/Loading/index3";
import { message } from "antd";

const axiosCanceler = new AxiosCanceler();

let needLoadingRequestCount = 0;

// * 显示loading
export const showFullScreenLoading = () => {
	if (needLoadingRequestCount === 0) {
		let dom = document.createElement("div");
		dom.setAttribute("id", "loading");
		document.body.appendChild(dom);
		ReactDOM.createRoot(dom).render(<Loading />);
	}
	needLoadingRequestCount++;
};

// * 隐藏loading
export const tryHideFullScreenLoading = () => {
	if (needLoadingRequestCount <= 0) return;
	needLoadingRequestCount--;
	if (needLoadingRequestCount === 0) {
		document.body.removeChild(document.getElementById("loading") as HTMLElement);
	}
};
// 不需要下面这些mock配置，仅本地发布DEMO用
// import Mock from "mockjs";
// const mock = require("../../mock/app-data");
// Mock.mock(/\/api.*/, (options: any) => {
//   const res = mock.mockApi(options);
//   return res;
// });

/**
 * 根据不同环境设置不同的请求地址
 * 把返回值赋给axios.defaults.baseURL即可
 */
// function setBaseUrl(){
//   switch(process.env.NODE_ENV){
//     case 'development': return 'http://development.com';
//     case 'test': return 'http://test.com';
//     case 'production' : return 'https://production.com';
//     default : return baseUrl;
//   }
// }

// 默认基础请求地址
axios.defaults.baseURL = baseUrl;

// 请求是否带上cookie
axios.defaults.withCredentials = false;

axios.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		NProgress.start();
		// * 将当前请求添加到 pending 中
		// axiosCanceler.addPending(config);
		// * 如果当前请求不需要显示 loading,在api服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading，参见loginApi
		// config.headers!.noLoading || showFullScreenLoading();
		const token: string | null = sessionStorage.getItem("admin_token");
		return { ...config, headers: { ...config.headers, "x-access-token": token } };
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

// 对返回的结果做处理
axios.interceptors.response.use(
	(response: AxiosResponse) => {
		// const { data, config } = response;
		NProgress.done();
		// * 在请求结束后，移除本次请求(关闭loading)
		// axiosCanceler.removePending(config);
		// tryHideFullScreenLoading();
		// const code = response?.data?.code ?? 200;
		// 没有权限，登录超时，登出，跳转登录
		// if (code === 3) {
		//   message.error("登录超时，请重新登录");
		//   sessionStorage.removeItem("userinfo");
		//   setTimeout(() => {
		//     window.location.href = "/";
		//   }, 1500);
		// } else {
		//   return response.data;
		// }
		return response.data;
	},
	async (error: AxiosError) => {
		const { response } = error;
		NProgress.done();
		// tryHideFullScreenLoading();
		// 请求超时单独判断，请求超时没有 response
		if (error.message.indexOf("timeout") !== -1) message.error("请求超时，请稍后再试");
		// 根据响应的错误状态码，做不同的处理
		if (response) checkStatus(response.status);
		// 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
		if (!window.navigator.onLine) window.location.hash = "/500";
		return Promise.reject(error);
	}
);

export default axios;
