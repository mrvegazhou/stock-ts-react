/** 资源应用/图片管理 **/
// ==================
// 所需的第三方库
// ==================
import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetState, useMount } from "react-use";
import { Form, Button, Input, Table, message, Popconfirm, Modal, Tooltip, Divider, Select, DatePicker, Image } from "antd";
import { EyeOutlined, ToolOutlined, DeleteOutlined, SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { DatePickerProps } from "antd/es/date-picker";

import { PAGE_SIZE, URL } from "@/constants/index";
import { Page, TableRecordData, SearchInfo, ModalType, OperateType, Res } from "./index.type";

// ==================
// CSS
// ==================
import "./index.less";

import tools from "@/utils/tools"; // 工具
import { AppImgs } from "@/models/index.type";
import { RootState, Dispatch } from "@/store/index";

// ==================
// 本组件
// ==================
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

function ImgsListContainer() {
	const [form] = Form.useForm();
	const dispatch = useDispatch<Dispatch>();
	const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中
	const powers = useSelector((state: RootState) => state.admin.powersCode);
	const [data, setData] = useState<AppImgs[]>([]); // 当前页面列表数据
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

	// 搜索相关参数
	const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
		tags: undefined, // 角色名
		type: undefined,
		url: undefined,
		begin_date: undefined,
		end_date: undefined,
	});
	const searchTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ tags: e.target.value });
	};
	const searchTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ type: Number(e.target.value) });
	};
	const searchUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ url: e.target.value });
	};

	useMount(() => {
		onGetData(page);
	});

	// 分页查询
	const onGetData = async (page: { page_num: number; page_size: number }): Promise<void> => {
		if (!powers.includes("appImgs:query")) {
			return;
		}
		const params = {
			page_num: page.page_num,
			page_size: page.page_size,
			url: searchInfo.url,
			tags: searchInfo.tags,
			type: searchInfo.type,
			begin_date: searchInfo.begin_date,
			end_date: searchInfo.end_date,
		};
		setLoading(true);
		try {
			const res = await dispatch.imgs.getAppImgsList(tools.clearNull(params));
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

	const tableData = useMemo(() => {
		return data.map((item, index): TableRecordData => {
			return {
				key: index,
				uuid: item.uuid,
				serial: index + 1 + (page.page_num - 1) * page.page_size,
				tags: item.tags,
				url: item.url,
				type: item.type,
				create_time: item.create_time,
				update_time: item.update_time,
				control: item.uuid,
			};
		});
	}, [page, data]);

	// 表单页码改变
	const onTablePageChange = (page_num: number, page_size: number | undefined) => {
		onGetData({ page_num, page_size: page_size || page.page_size });
	};

	/**
	 * 添加/修改/查看 模态框出现
	 * @param data 当前选中的那条数据
	 * @param type add添加/up修改/see查看
	 * **/
	const onModalShow = (data: TableRecordData | null, type: OperateType) => {
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
					formTags: data?.tags,
					formUrl: data?.url,
					formType: data?.type,
					formCreateTime: data?.create_time,
					formUpdateTime: data?.update_time,
				});
			}
		});
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
			const params: AppImgs = {
				uuid: values.formUuid,
				url: values.formUrl,
				tags: values.formTags,
				type: values.formType,
				create_time: values.formCreateTime,
				update_time: values.formUpdateTime,
			};
			if (modal.operateType === "up") {
				// 新增
				try {
					const res: Res = await dispatch.imgs.updateAppImg(params);
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
		} catch {
			// 未通过校验
		}
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
			title: "标签",
			dataIndex: "tags",
			key: "tags",
		},
		{
			title: "地址",
			dataIndex: "url",
			key: "url",
			render: (text: string) => (
				<div>
					<Image style={{ width: "150px", height: "auto" }} width="150px" src={URL.APP_IMGS_URL + "/" + text} />
					<br />
					{text}
				</div>
			),
		},
		{
			title: "类型",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "创建时间",
			dataIndex: "create_time",
			key: "create_time",
		},
		{
			title: "更新时间",
			dataIndex: "update_time",
			key: "update_time",
		},
		{
			title: "操作",
			key: "control",
			width: 200,
			render: (v: number, record: TableRecordData) => {
				const controls = [];
				powers.includes("appImgs:query") &&
					controls.push(
						<span key="0" className="control-btn green" onClick={() => onModalShow(record, "see")}>
							<Tooltip placement="top" title="查看">
								<EyeOutlined />
							</Tooltip>
						</span>
					);
				powers.includes("appImgs:update") &&
					controls.push(
						<span key="1" className="control-btn blue" onClick={() => onModalShow(record, "up")}>
							<Tooltip placement="top" title="修改">
								<ToolOutlined />
							</Tooltip>
						</span>
					);
				powers.includes("appImgs:del") &&
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

	return (
		<div>
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
						showTotal: (total, range) => `共 ${total} 条数据`,
						onChange: (page, page_size) => onTablePageChange(page, page_size),
					}}
				/>
			</div>

			{/* 新增&修改&查看 模态框 */}
			<Modal
				title={{ up: "修改", see: "查看" }[modal.operateType]}
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
					<Form.Item label="ID" name="formUuid" {...formItemLayout}>
						<Input disabled={true} />
					</Form.Item>
					<Form.Item
						label="标签"
						name="formTags"
						{...formItemLayout}
						rules={[{ required: true, whitespace: true, message: "必填" }]}
					>
						<Input placeholder="请输入标签" disabled={modal.operateType === "see"} />
					</Form.Item>
					<Form.Item label="地址" name="formUrl" {...formItemLayout} rules={[{ required: true, message: "必填" }]}>
						<Input style={{ width: "100%" }} disabled={modal.operateType === "see"} />
					</Form.Item>
					<Form.Item
						label="类型"
						name="formType"
						{...formItemLayout}
						rules={[
							{
								required: true,
								message: "必填",
							},
						]}
					>
						<Select placeholder="请选择图片类型" disabled={modal.operateType === "see"}>
							<Option value="1">反馈</Option>
							<Option value="2">画板</Option>
							<Option value="0">未知</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
export default ImgsListContainer;
