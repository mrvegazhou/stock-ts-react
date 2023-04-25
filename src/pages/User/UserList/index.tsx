/** User 应用/用户管理 **/
// ==================
// 所需的第三方库
// ==================
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetState, useMount } from "react-use";
import { Form, Button, Input, Table, message, Popconfirm, Modal, Tooltip, Divider, Select, DatePicker } from "antd";
import { EyeOutlined, ToolOutlined, DeleteOutlined, SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { DatePickerProps } from "antd/es/date-picker";

import { PAGE_SIZE } from "@/constants/index";

// ==================
// CSS
// ==================
import "./index.less";

import { RootState, Dispatch } from "@/store/index";
import { AppUserInfo } from "@/models/index.type";
import { Page, TableRecordData, operateType, ModalType, SearchInfo, Res } from "./index.type";

// ==================
// 自定义的东西
// ==================
import tools from "@/utils/tools"; // 工具

// ==================
// 本组件
// ==================
const { TextArea } = Input;
const { Option } = Select;
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
function UserListContainer() {
	const dispatch = useDispatch<Dispatch>();
	const [form] = Form.useForm();

	const powers = useSelector((state: RootState) => state.admin.powersCode);

	const [data, setData] = useState<AppUserInfo[]>([]); // 当前页面列表数据

	const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中

	// 分页相关参数控制
	const [page, setPage] = useSetState<Page>({
		page_num: 1,
		page_size: PAGE_SIZE,
		total: 0,
	});

	// 模态框相关参数控制
	const [modal, setModal] = useSetState<ModalType>({
		operateType: "up",
		nowData: null,
		modalShow: false,
		modalLoading: false,
	});

	useMount(() => {
		onGetData(page);
	});

	// 搜索相关参数
	const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
		username: undefined, // 角色名
		email: undefined,
		phone: undefined,
		status: undefined, // 状态
		begin_date: undefined,
		end_date: undefined,
		type: undefined,
	});

	// 搜索 - 名称输入框值改变时触发
	const searchUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ username: e.target.value });
	};

	// 搜索 - 邮箱输入框值改变时触发
	const searchEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ email: e.target.value });
	};

	// 搜索 - 邮箱输入框值改变时触发
	const searchPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ phone: e.target.value });
	};

	// 搜索 - 状态下拉框选择时触发
	const searchStatusChange = (v: number) => {
		setSearchInfo({ status: v });
	};

	const searchTypeChange = (v: number) => {
		setSearchInfo({ type: v });
	};

	// 搜索
	const onSearch = () => {
		onGetData(page);
	};

	/**
	 * 添加/修改/查看 模态框出现
	 * @param data 当前选中的那条数据
	 * @param type add添加/up修改/see查看
	 * **/
	const onModalShow = (data: TableRecordData | null, type: operateType) => {
		setModal({
			modalShow: true,
			nowData: data,
			operateType: type,
		});
		setTimeout(() => {
			if (type === "add") {
				// 新增，需重置表单各控件的值
				form.resetFields();
			} else {
				// 查看或修改，需设置表单各控件的值为当前所选中行的数据
				form.setFieldsValue({
					formUuid: data?.uuid,
					formStatus: data?.status,
					formUsername: data?.username,
					formEmail: data?.email,
					formPhone: data?.phone,
					formDesc: data?.description,
					formCreateTime: data?.create_time,
					formUpdateTime: data?.update_time,
					formDeleteTime: data?.delete_time,
				});
			}
		});
	};

	/** 模态框关闭 **/
	const onClose = () => {
		setModal({ modalShow: false });
	};

	/** 模态框确定 **/
	const onOk = async () => {
		if (modal.operateType === "see") {
			onClose();
			return;
		}
		try {
			const values = await form.validateFields();
			setModal({
				modalLoading: true,
			});
			const params: AppUserInfo = {
				uuid: values.formUuid,
				username: values.formUsername,
				description: values.formDesc,
				phone: values.formPhone,
				email: values.formEmail,
				create_time: values.formCreateTime,
				update_time: values.formUpdateTime,
				delete_time: values.formDeleteTime,
			};
			if (modal.operateType === "up") {
				// 新增
				try {
					const res: Res = await dispatch.app.upAppUserInfo(params);
					if (res && res.code === 200) {
						message.success("修改成功");
						onGetData(page);
						onClose();
					}
				} finally {
					setModal({
						modalLoading: false,
					});
				}
			}
			if (modal.operateType === "add") {
				// 新增
				try {
					const res: Res | undefined = await dispatch.app.addAppUser(params);
					if (res && res.code === 200) {
						message.success("添加成功");
						onGetData(page);
						onClose();
					} else {
						message.error(res?.msg ?? "操作失败");
					}
				} finally {
					setModal({
						modalLoading: false,
					});
				}
			}
		} catch {
			// 未通过校验
		}
	};

	// 分页查询
	const onGetData = async (page: { page_num: number; page_size: number }): Promise<void> => {
		if (!powers.includes("appUser:query")) {
			return;
		}
		const params = {
			page_num: page.page_num,
			page_size: page.page_size,
			username: searchInfo.username,
			status: searchInfo.status,
			begin_date: searchInfo.begin_date,
			end_date: searchInfo.end_date,
			email: searchInfo.email,
			phone: searchInfo.phone,
			type: searchInfo.type,
		};
		setLoading(true);
		try {
			const res = await dispatch.app.getAppUserList(tools.clearNull(params));
			if (res && res.code === 200) {
				setData(res.data.list);
				setPage({
					page_num: page.page_num,
					page_size: page.page_size,
					total: res.data.total,
				});
			} else {
				message.error(res?.msg ?? "数据获取失败");
			}
		} finally {
			setLoading(false);
		}
	};

	// 删除某一条数据
	const onDel = async (uuid: number) => {
		setLoading(true);
		try {
			const res = await dispatch.imgs.delAppImg({ uuid });
			if (res && res.code === 200) {
				message.success("删除成功");
				onGetData(page);
			} else {
				message.error(res?.msg ?? "操作失败");
			}
		} finally {
			setLoading(false);
		}
	};

	// 表单页码改变
	const onTablePageChange = (page_num: number, page_size: number | undefined) => {
		onGetData({ page_num, page_size: page_size || page.page_size });
	};

	// 构建字段
	const tableColumns = [
		{
			title: "序号",
			dataIndex: "serial",
			key: "serial",
		},
		{
			title: "标识",
			dataIndex: "uuid",
			key: "uuid",
		},
		{
			title: "用户名",
			dataIndex: "username",
			key: "username",
		},
		{
			title: "手机号",
			dataIndex: "phone",
			key: "phone",
		},
		{
			title: "邮箱",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "类型",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "描述",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "创建时间",
			dataIndex: "create_time",
			key: "create_time",
		},
		{
			title: "修改时间",
			dataIndex: "update_time",
			key: "update_time",
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (v: number, record: TableRecordData) =>
				v === 1 ? <span style={{ color: "green" }}>启用</span> : <span style={{ color: "red" }}>禁用</span>,
		},
		{
			title: "操作",
			key: "control",
			width: 200,
			render: (v: number, record: TableRecordData) => {
				const controls = [];
				powers.includes("user:query") &&
					controls.push(
						<span key="0" className="control-btn green" onClick={() => onModalShow(record, "see")}>
							<Tooltip placement="top" title="查看">
								<EyeOutlined />
							</Tooltip>
						</span>
					);
				powers.includes("user:update") &&
					controls.push(
						<span key="1" className="control-btn blue" onClick={() => onModalShow(record, "up")}>
							<Tooltip placement="top" title="修改">
								<ToolOutlined />
							</Tooltip>
						</span>
					);
				powers.includes("user:del") &&
					controls.push(
						<Popconfirm key="3" title="确定删除吗?" onConfirm={() => onDel(record.uuid)} okText="确定" cancelText="取消">
							<span className="control-btn red">
								<Tooltip placement="top" title="删除">
									<DeleteOutlined />
								</Tooltip>
							</span>
						</Popconfirm>
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

	const tableData = useMemo(() => {
		return data.map((item, index): TableRecordData => {
			return {
				key: index,
				uuid: item.uuid,
				serial: index + 1 + (page.page_num - 1) * page.page_size,
				username: item.username,
				email: item.email,
				phone: item.phone,
				type: item.type,
				description: item.description,
				create_time: item.create_time,
				update_time: item.update_time,
				status: item.status,
				control: item.uuid,
			};
		});
	}, [page, data]);

	const searchBeginDateChange = (value: DatePickerProps["value"]) => {
		setSearchInfo({ begin_date: value?.format("YYYY-MM-DD HH:mm:ss") });
	};

	const searchEndDateChange = (value: DatePickerProps["value"]) => {
		setSearchInfo({ end_date: value?.format("YYYY-MM-DD HH:mm:ss") });
	};

	return (
		<div>
			<div className="g-search">
				<ul className="search-func">
					<li>
						<Button
							type="primary"
							icon={<PlusCircleOutlined />}
							disabled={!powers.includes("appUser:add")}
							onClick={() => onModalShow(null, "add")}
						>
							添加用户
						</Button>
					</li>
				</ul>

				<Divider type="vertical" />
				{powers.includes("appUser:query") && (
					<ul className="search-ul">
						<li>
							<Input placeholder="请输入角色名" onChange={searchUsernameChange} value={searchInfo.username} />
						</li>
						<li>
							<Select
								placeholder="请选择状态"
								allowClear
								style={{ width: "120px" }}
								onChange={searchStatusChange}
								value={searchInfo.status}
							>
								<Option value={1}>启用</Option>
								<Option value={-1}>禁用</Option>
							</Select>
						</li>
						<li>
							<Select
								placeholder="请选择类型"
								allowClear
								style={{ width: "120px" }}
								onChange={searchTypeChange}
								value={searchInfo.type}
							>
								<Option value={1}>微信</Option>
								<Option value={2}>其他app</Option>
							</Select>
						</li>
						<li>
							<Input placeholder="请输入邮箱" onChange={searchEmailChange} value={searchInfo.email} />
						</li>
						<li>
							<Input placeholder="请输入手机号" onChange={searchPhoneChange} value={searchInfo.phone} />
						</li>
						<li>
							<DatePicker showTime format="YYYY-MM-DD HH:mm" onOk={searchBeginDateChange} placeholder="注册开始时间" />
						</li>
						<li>
							<DatePicker showTime format="YYYY-MM-DD HH:mm" onOk={searchEndDateChange} placeholder="注册结束时间" />
						</li>
						<li>
							<Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
								搜索
							</Button>
						</li>
					</ul>
				)}
			</div>
			<div className="diy-table">
				<Table
					columns={tableColumns}
					loading={loading}
					dataSource={tableData}
					pagination={{
						total: page.total,
						current: page.page_num,
						pageSize: page.page_size,
						showQuickJumper: true,
						showTotal: (total, range) => `共 ${total}条数据`,
						onChange: (page, page_size) => onTablePageChange(page, page_size),
					}}
				/>
			</div>

			{/* 新增&修改&查看 模态框 */}
			<Modal
				title={{ add: "新增", up: "修改", see: "查看" }[modal.operateType]}
				open={modal.modalShow}
				onOk={() => onOk()}
				onCancel={() => onClose()}
				confirmLoading={modal.modalLoading}
			>
				<Form
					form={form}
					initialValues={{
						formConditions: 1,
					}}
				>
					<Form.Item label="ID" name="formUuid">
						<Input disabled={true} />
					</Form.Item>
					<Form.Item
						label="用户名"
						name="formUsername"
						{...formItemLayout}
						rules={[
							{ required: true, whitespace: true, message: "必填" },
							{ max: 12, message: "最多输入12位字符" },
						]}
					>
						<Input placeholder="请输入用户名" disabled={modal.operateType === "see"} />
					</Form.Item>
					<Form.Item
						label="手机"
						name="formPhone"
						{...formItemLayout}
						rules={[{ required: true, pattern: /^[1][3-9][\d]{9}/, message: "请输入手机号" }]}
					>
						<Input style={{ width: "100%" }} disabled={modal.operateType === "see"} />
					</Form.Item>
					<Form.Item
						label="邮箱"
						name="formEmail"
						{...formItemLayout}
						rules={[
							{
								required: true,
								pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
								message: "请输入邮箱",
							},
						]}
					>
						<Input style={{ width: "100%" }} disabled={modal.operateType === "see"} />
					</Form.Item>
					<Form.Item label="类型" name="formType" {...formItemLayout} rules={[{ required: true, message: "请选择类型" }]}>
						<Select disabled={modal.operateType === "see"}>
							<Option key={1} value={1}>
								微信用户
							</Option>
							<Option key={2} value={2}>
								app用户
							</Option>
						</Select>
					</Form.Item>
					<Form.Item label="描述" name="formDesc" {...formItemLayout} rules={[{ max: 500, message: "最多输入500个字符" }]}>
						<TextArea rows={4} disabled={modal.operateType === "see"} autoSize={{ minRows: 2, maxRows: 6 }} />
					</Form.Item>
					<Form.Item label="状态" name="formStatus" {...formItemLayout} rules={[{ required: true, message: "请选择状态" }]}>
						<Select disabled={modal.operateType === "see"}>
							<Option key={1} value={1}>
								启用
							</Option>
							<Option key={-1} value={-1}>
								禁用
							</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
export default UserListContainer;
