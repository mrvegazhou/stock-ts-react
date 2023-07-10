/** 头部 **/

// ==================
// 第三方库
// ==================
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, message } from "antd";
import { HomeOutlined, TeamOutlined, DownOutlined, DatabaseOutlined, SettingOutlined } from "@ant-design/icons";
import logo from "@/assets/react.svg";
import _ from "lodash";

// ==================
// 自定义的东西
// ==================
import "./index.less";
import AvatarIcon from "@/components/AvatarIcon";

// ==================
// 类型声明
// ==================
import { UserInfo } from "@/models/index.type";
import { tabKeyRouterMap } from "@/constants";
import { Dispatch } from "@/store/index";

type Props = {
	userinfo: UserInfo; // 用户信息
	onLogout: () => void; // 退出登录
	pathname: string;
};

export default function HeaderCom(props: Props): JSX.Element {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch<Dispatch>();

	const tabKeyRouterMap2 = _.invert(tabKeyRouterMap);
	const selectedKey = tabKeyRouterMap2[location.pathname];

	// 根据理由选中对应 menu 项
	const defaultKey = [selectedKey];

	// 路由切换
	const clickMenu = ({ key }: { key: string }) => {
		if (key !== "auth") {
			navigate(tabKeyRouterMap[key]);
		}
	};

	async function flushPowers() {
		await dispatch.admin.flushAdminRoleMenuPowers();
		message.info("已刷新");
	};

	const items = [
		{ label: "首页", icon: <HomeOutlined />, key: "home" },
		{
			label: (
				<span>
					用户管理
					<DownOutlined />
				</span>
			),
			icon: <TeamOutlined />,
			key: "Appuser",
			children: [
				{ label: "用户列表", key: "appuser" },
				{ label: "反馈信息", key: "appfeedback" },
			],
		},
		{
			label: (
				<span>
					资源管理
					<DownOutlined />
				</span>
			),
			icon: <DatabaseOutlined />,
			key: "Resource",
			children: [
				{ label: "图片管理", key: "imgs" },
				{ label: "广告管理", key: "adList" },
				{ label: "搜索日志管理", key: "searchLog" },
			],
		},
		{
			label: (
				<span>
					权限管理
					<DownOutlined />
				</span>
			),
			icon: <SettingOutlined />,
			key: "auth",
			children: [
				{ label: "管理员管理", key: "useradmin" },
				{ label: "菜单角色管理", key: "menurole" },
				{ label: "角色管理", key: "roleadmin" },
				{ label: "权限管理", key: "poweradmin" },
				{ label: "菜单管理", key: "menuadmin" },
			],
		},
	];

	return (
		<div className="stock-header">
			<div className="menu-header">
				<Link to="/">
					<img src={String(logo)} alt="logo" width="" height="32" />
				</Link>
				<Menu
					theme="light"
					mode="horizontal"
					selectedKeys={defaultKey}
					onClick={clickMenu}
					style={{ lineHeight: "64px", width: "800px" }}
					items={items}
				/>
			</div>
			<div className="stock-header-item">
				<span className="stock-header-item-pv" onClick={flushPowers}>
					刷新权限
				</span>
			</div>
			<div className="header-ri">
				<span className="username">{props.userinfo.userBasicInfo?.username}</span>
				<AvatarIcon onLogout={props.onLogout} userinfo={props.userinfo} />
			</div>
		</div>
	);
}
