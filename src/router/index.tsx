/** 根路由 **/

// ==================
// 第三方库
// ==================
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMount } from "react-use";
// import { AliveScope } from "react-activation";
import { message } from "antd";
import lazyLoad from "@/router/lazyLoad";
const { lazy } = React;
// ==================
// 自定义的东西
// ==================
import tools from "@/utils/tools";

// 全局提示只显示2秒
message.config({
	duration: 2,
});

// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store/index";

// ==================
// 本组件
// ==================
function RouterCom(): JSX.Element {
	const [pathname, setPathname] = useState<string>("");

	useMount(() => {
		const urlParams = new URL(window.location.href);
		setPathname(urlParams?.pathname);
	});

	const dispatch = useDispatch<Dispatch>();
	const userinfo = useSelector((state: RootState) => state.admin.userinfo);

	useEffect(() => {
		const userTemp = sessionStorage.getItem("userinfo");
		/**
		 * sessionStorage中有user信息，但store中没有
		 * 说明刷新了页面，需要重新同步user数据到store
		 * **/
		if (userTemp && !userinfo.userBasicInfo) {
			dispatch.admin.setUserInfo(JSON.parse(tools.uncompile(userTemp)));
		}
	}, [dispatch.admin, userinfo.userBasicInfo]);

	/** 跳转到某个路由之前触发 **/
	const RequireAuth = ({ children }: any) => {
		const userTemp = sessionStorage.getItem("userinfo");
		if (userTemp) {
			return children;
		}
		return <Navigate to="/admin/user/login" replace />;
	};

	return (
		// <AliveScope>
		<BrowserRouter>
			<Routes>
				<Route path="/admin/user" element={lazyLoad(React.lazy(() => import("@/layouts/UserLayout")))}>
					<Route path="login" element={lazyLoad(React.lazy(() => import("@/pages/Login")))} />
					<Route path="*" element={<RequireAuth>{lazyLoad(lazy(() => import(`@/pages/ErrorPages/404`)))}</RequireAuth>} />
				</Route>
				<Route path="/admin/finance" element={<RequireAuth>{lazyLoad(lazy(() => import("@/layouts/BasicLayout")))}</RequireAuth>}>
					<Route index path="home" element={lazyLoad(lazy(() => import(`@/pages/Home/index`)))} />
					<Route path="useradmin" element={lazyLoad(lazy(() => import(`@/pages/System/UserAdmin`)))} />
					<Route path="roleadmin" element={lazyLoad(lazy(() => import(`@/pages/System/RoleAdmin`)))} />
					<Route path="poweradmin" element={lazyLoad(lazy(() => import(`@/pages/System/PowerAdmin`)))} />
					<Route path="menuadmin" element={lazyLoad(lazy(() => import(`@/pages/System/MenuAdmin`)))} />
					<Route path="nopower" element={lazyLoad(lazy(() => import(`@/pages/ErrorPages/401`)))} />
					<Route path="*" element={lazyLoad(lazy(() => import(`@/pages/ErrorPages/404`)))} />
				</Route>
				<Route path="/" element={lazyLoad(lazy(() => import(`@/layouts/BasicLayout`)))} />
				<Route path="*" element={lazyLoad(lazy(() => import(`@/pages/ErrorPages/404`)))} />
			</Routes>
		</BrowserRouter>
		// </AliveScope>
	);
}

export default RouterCom;
