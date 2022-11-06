import { useState, useImperativeHandle, Ref } from "react";
import { Modal, message, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { UserInfo, Res, UserBasicInfo } from "@/models/index.type";

import { Dispatch } from "@/store/index";

interface Props {
	innerRef: Ref<{ showModal: (params: any) => void }>;
}

const DivContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 10px;
`;
const Label = styled.div`
	font-weight: bold;
	margin-right: 10px;
`;

const PasswordModal = (props: Props) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [typeOldInput, setTypeOldInput] = useState(true);
	const [typeNewInput, setTypeNewInput] = useState(true);
	const [oldPassword, setOldPassword] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [uuid, setUuid] = useState<number>(0);

	const dispatch = useDispatch<Dispatch>();

	useImperativeHandle(props.innerRef, () => ({
		showModal,
	}));

	const showModal = (params: { userinfo: UserInfo }) => {
		setIsModalVisible(true);
		const userBasicInfo: UserBasicInfo = params.userinfo.userBasicInfo as UserBasicInfo;
		setUuid(userBasicInfo.uuid);
	};

	const handleOk = async () => {
		try {
			const res: Res = await dispatch.sys.upPassword({ uuid: uuid, oldPassword: oldPassword, newPassword: newPassword });
			if (res && res.code === 200) {
				message.success("修改密码成功");
				setIsModalVisible(false);
			} else {
				message.error(res?.msg);
			}
		} catch {
			// 未通过校验
			message.error("系统错误");
		}
	};

	// 切换表单明文密文显示
	const changeType = (type: string) => {
		if (type == "old") {
			setTypeOldInput(!typeOldInput);
		} else {
			setTypeNewInput(!typeNewInput);
		}
	};

	// 监听表单输入
	const changeCode = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const val = event.target.value;
		if (val === "" || val === null || val === undefined) {
			message.destroy(); // 销毁上次弹窗
			message.warning("请输入密码"); // 提示弹窗
		} else {
			if (type == "old") {
				setOldPassword(val);
			} else {
				setNewPassword(val);
			}
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<Modal title="修改密码" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
			<DivContainer>
				<Label>原密码:</Label>
				<div>
					<Input
						type={typeOldInput ? "password" : "text"}
						onChange={(event) => {
							changeCode(event, "old");
						}}
						size="large"
					/>
				</div>
				<div style={{ marginLeft: "10px" }}>
					<Button
						onClick={() => {
							changeType("old");
						}}
					>
						{typeOldInput ? "显示" : "隐藏"}
					</Button>
				</div>
			</DivContainer>
			<DivContainer>
				<Label>新密码:</Label>
				<div>
					<Input
						type={typeNewInput ? "password" : "text"}
						onChange={(event) => {
							changeCode(event, "new");
						}}
						size="large"
					/>
				</div>
				<div style={{ marginLeft: "10px" }}>
					<Button
						onClick={() => {
							changeType("new");
						}}
					>
						{typeNewInput ? "显示" : "隐藏"}
					</Button>
				</div>
			</DivContainer>
		</Modal>
	);
};
export default PasswordModal;
