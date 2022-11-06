import { useState, useImperativeHandle, Ref } from "react";
import styled from "styled-components";
import { Modal } from "antd";

import { UserBasicInfo, UserInfo, RoleParam } from "@/models/index.type";

interface Props {
	innerRef: Ref<{ showModal: (params: any) => void } | undefined>;
}
const DivContainer = styled.div`
	display: flex;
	flex-direction: row;
`;
const Label = styled.div`
	font-weight: bold;
	margin-right: 10px;
`;

const InfoModal = (props: Props) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [userinfo, setUserinfo] = useState<UserBasicInfo>();
	const [roleName, setRoleName] = useState<string>();

	const showModal = (params: { userinfo: UserInfo }) => {
		let roles: RoleParam[] = params.userinfo.roles;
		let roleNames: Array<string> = [];
		roles.forEach((item) => {
			roleNames.push(item.title);
		});
		setRoleName(roleNames.toString());
		const userBasicInfo: UserBasicInfo = params.userinfo.userBasicInfo as UserBasicInfo;
		setUserinfo(userBasicInfo);
		setModalVisible(true);
	};

	useImperativeHandle(props.innerRef, () => ({
		showModal,
	}));

	const handleOk = () => {
		setModalVisible(false);
	};

	const handleCancel = () => {
		setModalVisible(false);
	};

	return (
		<Modal title="个人信息" open={modalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
			<DivContainer>
				<Label>用户名:</Label>
				<div>{userinfo?.username}</div>
			</DivContainer>
			<DivContainer>
				<Label>角色:</Label>
				<div>{roleName}</div>
			</DivContainer>
			<DivContainer>
				<Label>邮箱:</Label>
				<div>{userinfo?.email}</div>
			</DivContainer>
			<DivContainer>
				<Label>电话:</Label>
				<div>{userinfo?.phone}</div>
			</DivContainer>
		</Modal>
	);
};
export default InfoModal;
