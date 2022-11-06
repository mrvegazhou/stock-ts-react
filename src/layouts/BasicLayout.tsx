/** 基础页面结构 - 有头部、底部 **/

// ==================
// 第三方库
// ==================
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";

import { Layout, message } from "antd";
const { Content } = Layout;

// ==================
// 自定义的东西
// ==================
import ErrorBoundary from "@/components/ErrorBoundary";
import tools from "@/utils/tools";

// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store/index";

import Bread from "@/components/Bread";

import Header from "@/components/Header";
import { Menu } from "@/models/index.type";
import "./BasicLayout.less";

// ==================
// 本组件
// ==================
const BasicLayoutCom = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const dispatch = useDispatch<Dispatch>();

	const userinfo = useSelector((state: RootState) => state.admin.userinfo);

	// 退出登录
	const onLogout = useCallback(() => {
		dispatch.admin.onLogout({ uuid: userinfo.userBasicInfo!.uuid }).then(() => {
			message.success("退出成功");
			navigate("/admin/user/login");
		});
	}, [dispatch.admin]);

	/**
	 * 工具 - 判断当前用户是否有该路由权限，如果没有就跳转至401页
	 * @param pathname 路由路径
	 * **/
	const checkRouterPower = useCallback(
		(pathname: string) => {
			let menus: Menu[] = [];
			if (userinfo.menus && userinfo.menus.length) {
				menus = userinfo.menus;
			} else if (sessionStorage.getItem("userinfo")) {
				menus = JSON.parse(tools.uncompile(sessionStorage.getItem("userinfo") || "[]")).menus;
			}
			const m: string[] = menus.map((item) => item.url); // 当前用户拥有的所有菜单

			if (m.includes(pathname)) {
				return true;
			}
			return false;
		},
		[userinfo]
	);

	const RequirePower = ({ children }: any) => {
		/**
		 * 检查当前用户是否有该路由页面的权限
		 * 没有则跳转至401页
		 * **/
		if (checkRouterPower(location.pathname) || location.pathname == "/admin/finance/nopower") {
			return children;
		} else {
			return <Navigate to="/admin/finance/nopower" />;
		}
	};

	return (
		<Layout>
			<Layout.Header>
				<Header userinfo={userinfo} onLogout={onLogout} pathname={location.pathname} />
			</Layout.Header>

			{/* 普通面包屑导航 */}
			<Bread menus={userinfo.menus} pathname={location.pathname} />

			<Content className="content">
				<ErrorBoundary pathname={location.pathname}>
					<RequirePower>
						<Outlet />
					</RequirePower>
				</ErrorBoundary>
			</Content>
			<Layout.Footer style={{ textAlign: "center" }}>
				<div>
					<a href="#" target="blank">
						footer
					</a>
				</div>
			</Layout.Footer>
		</Layout>
	);
};

export default BasicLayoutCom;
