import { useRef } from "react";
import { Avatar, Modal, Menu, Dropdown, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PasswordModal from "@/components/PasswordModal";
import InfoModal from "@/components/InfoModal";
import { HOME_URL } from "@/constants";
import avatar from "@/assets/avatar.png";

import { UserInfo } from "@/models/index.type";

const AvatarIcon = (props: any) => {
	const { onLogout, userinfo } = props;
	const navigate = useNavigate();

	interface ModalProps {
		showModal: (params: { userinfo: UserInfo }) => void;
	}

	const passRef = useRef<ModalProps>(null);
	const infoRef = useRef<ModalProps>(null);

	// 退出登录
	const logout = () => {
		Modal.confirm({
			title: "温馨提示",
			icon: <ExclamationCircleOutlined />,
			content: "是否确认退出登录？",
			okText: "确认",
			cancelText: "取消",
			onOk: () => {
				onLogout();
				message.success("退出登录成功！");
				navigate("/login");
			},
		});
	};

	// Dropdown Menu
	const menu = (
		<Menu
			items={[
				{
					key: "1",
					label: <span className="dropdown-item">首页</span>,
					onClick: () => navigate(HOME_URL),
				},
				{
					key: "2",
					label: <span className="dropdown-item">个人信息</span>,
					onClick: () => infoRef.current!.showModal({ userinfo: userinfo }),
				},
				{
					key: "3",
					label: <span className="dropdown-item">修改密码</span>,
					onClick: () => passRef.current!.showModal({ userinfo: userinfo }),
				},
				{
					type: "divider",
				},
				{
					key: "4",
					label: <span className="dropdown-item">退出登录</span>,
					onClick: logout,
				},
			]}
		></Menu>
	);

	return (
		<>
			<Dropdown overlay={menu} placement="bottom" arrow trigger={["click"]}>
				<Avatar size="large" src={avatar} />
			</Dropdown>
			<InfoModal innerRef={infoRef}></InfoModal>
			<PasswordModal innerRef={passRef}></PasswordModal>
		</>
	);
};
export default AvatarIcon;
