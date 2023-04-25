/** 头部 **/

// ==================
// 第三方库
// ==================
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { HomeOutlined, TeamOutlined, DownOutlined, DatabaseOutlined, SettingOutlined } from "@ant-design/icons";
import logo from "@/assets/react.svg";

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

type Props = {
	userinfo: UserInfo; // 用户信息
	onLogout: () => void; // 退出登录
	pathname: string;
};

export default function HeaderCom(props: Props): JSX.Element {
	const navigate = useNavigate();
	const location = useLocation();
	const selectedKey = tabKeyRouterMap[location.pathname];
	// 根据理由选中对应 menu 项
	const defaultKey = [selectedKey];

	// 路由切换
	const clickMenu = ({ key }: { key: string }) => {
		if (key !== "auth") {
			navigate(tabKeyRouterMap[key]);
		}
	};

	const items = [
		{ label: "首页", icon: <HomeOutlined />, key: "home" },
		{ label: "用户管理", icon: <TeamOutlined />, key: "appuser" },
		{
			label: (
				<span>
					资源管理
					<DownOutlined />
				</span>
			),
			icon: <DatabaseOutlined />,
			key: "Resource",
			children: [{ label: "图片管理", key: "imgs" }],
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
				{ label: "用户管理", key: "useradmin" },
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
				<span className="stock-header-item-pv">累计查询</span>
			</div>
			<div className="header-ri">
				<span className="username">{props.userinfo.userBasicInfo?.username}</span>
				<AvatarIcon onLogout={props.onLogout} userinfo={props.userinfo} />
			</div>
		</div>
	);
}
