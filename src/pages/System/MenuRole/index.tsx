/** 菜单角色管理页 **/

// ==================
// 第三方库
// ==================
import React, { useCallback, useMemo, useState } from "react";
import { Table, Divider, Tooltip, Form, Modal, Checkbox, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSetState, useMount } from "react-use";
import { RootState, Dispatch } from "@/store/index";
import { useSelector, useDispatch } from "react-redux";
import { cloneDeep } from "lodash";
import { ToolOutlined } from "@ant-design/icons";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import "./index.less";

// ==================
// 类型声明
// ==================
import { Menu, TableRecordData, ModalType, Params, Res } from "./index.type";

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 4 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 19 },
	},
};

interface DataType {
	key: React.ReactNode;
	uuid: number;
	title: string;
	icon: string;
	description: string;
	url: string;
	children?: DataType[];
}

function MenuRoleContainer() {
	const power = useSelector((state: RootState) => state.admin.powersCode);
	const dispatch = useDispatch<Dispatch>();
	const menus = useSelector((state: RootState) => state.sys.menus);
	const roles = useSelector((state: RootState) => state.sys.roles);
	const [rolesCheckboxChose, setRolesCheckboxChose] = useState<number[]>([]);
	const [modal, setModal] = useSetState<ModalType>({
		nowData: null,
		modalShow: false,
		modalLoading: false,
	});
	const [form] = Form.useForm();

	const columns: ColumnsType<DataType> = [
		{
			title: "名称",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Icon",
			dataIndex: "icon",
			key: "icon",
			width: "20%",
		},
		{
			title: "描述",
			dataIndex: "description",
			width: "30%",
			key: "description",
		},
		{
			title: "链接",
			dataIndex: "url",
			width: "30%",
			key: "url",
		},
		{
			title: "操作",
			key: "control",
			width: 120,
			render: (v: number, record: TableRecordData) => {
				const controls = [];
				power.includes("power:update") &&
					controls.push(
						<span key="1" className="control-btn blue" onClick={() => onModalShow(record)}>
							<Tooltip placement="top" title="修改">
								<ToolOutlined />
							</Tooltip>
						</span>
					);
				const result: JSX.Element[] = [];
				controls.forEach((item, index) => {
					if (index) {
						result.push(<Divider key={`line${index}`} type="vertical" />);
					}
					result.push(item);
				});
				return result;
			},
		},
	];

	// 工具 - 递归将扁平数据转换为层级数据
	const dataToJson = useCallback((one: any, data: any) => {
		let kids;
		if (!one) {
			// 第1次递归
			kids = data.filter((item: Menu) => !item.parent);
		} else {
			kids = data.filter((item: Menu) => item.parent === one.uuid);
		}
		kids.forEach((item: Menu) => (item.children = dataToJson(item, data)));
		return kids.length ? kids : null;
	}, []);

	const sourceData = useMemo(() => {
		const d: Menu[] = cloneDeep(menus);
		d.forEach((item: Menu & { key: string }) => {
			item.key = String(item.uuid);
		});
		// 按照sort排序
		d.sort((a, b) => {
			return a.sorts - b.sorts;
		});
		return dataToJson(null, d) || d;
	}, [menus, dataToJson]);

	// 生命周期 - 首次加载组件时触发
	useMount(() => {
		dispatch.sys.getMenus();
		dispatch.sys.getAllRoles();
	});

	const rolesCheckboxData = useMemo(() => {
		return roles.map((item) => ({
			label: item.title,
			value: item.uuid,
		}));
	}, [roles]);

	// 新增&修改 提交
	const onOk = async () => {
		try {
			setModal({
				modalLoading: true,
			});
			await setRoleIds(modal.nowData?.uuid, rolesCheckboxChose);
			const data = modal.nowData;
			dispatch.sys.getAllRoles();
			setRolesCheckboxChose(
				data && data.uuid
					? roles
							.filter((item) => {
								const theMenuPower = item.menu_powers?.find((item2) => item2.menu_id === data.uuid);
								if (theMenuPower) {
									return theMenuPower.powers.includes(data.uuid);
								}
								return false;
							})
							.map((item) => item.uuid)
					: []
			);
		} finally {
			setModal({
				modalLoading: false,
			});
		}
		onClose();
	};

	/**
	 * 批量更新roles
	 * @param id 当前这个权限的id
	 * @param roleIds 选中的角色的id们，要把当前权限赋给这些角色
	 **/
	const setRoleIds = async (id: number | undefined, role_ids: number[]) => {
		if (typeof id === "undefined") {
			return;
		}
		const params: Params = {
			menu_id: id,
			role_ids: role_ids,
		};
		const res: Res = await dispatch.sys.upMenuRoles(params);
		if (res && res.code === 200) {
			message.success(res.data);
			dispatch.admin.flushAdminRoleMenuPowers();
		} else {
			message.error("操作失败");
		}
	};

	// 新增&修改 模态框关闭
	const onClose = () => {
		setModal({
			modalShow: false,
		});
	};

	const onModalShow = (data: TableRecordData | null) => {
		setModal({
			modalShow: true,
			nowData: data,
		});
		setRolesCheckboxChose(
			data && data.uuid
				? roles
						.filter((item) => {
							const theMenuPower = item.menu_powers?.find((item2) => item2.menu_id === data.uuid);
							if (theMenuPower) {
								return true;
							}
							return false;
						})
						.map((item) => item.uuid)
				: []
		);
	};

	return (
		<>
			<Table columns={columns} dataSource={sourceData} />
			<Modal title="修改" open={modal.modalShow} onOk={onOk} onCancel={onClose} confirmLoading={modal.modalLoading}>
				<Form form={form} initialValues={{ formStatus: 1 }}>
					<Form.Item label="赋予" {...formItemLayout}>
						<Checkbox.Group
							className="all-label"
							options={rolesCheckboxData}
							value={rolesCheckboxChose}
							onChange={(v: CheckboxValueType[]) => setRolesCheckboxChose(v as number[])}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
export default MenuRoleContainer;
