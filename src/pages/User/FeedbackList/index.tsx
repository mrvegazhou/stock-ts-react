/** 资源应用/图片管理 **/
// ==================
// 所需的第三方库
// ==================
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetState, useMount } from "react-use";
import { Form, Input, Table, message, Popconfirm, Modal, Tooltip, Divider, Select, DatePicker, Image, Button } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { DatePickerProps } from "antd/es/date-picker";

import { PAGE_SIZE, URL } from "@/constants/index";
import { Page, TableRecordData, SearchInfo, ModalType, OperateType, Res, ReplyInfo } from "./index.type";

// ==================
// CSS
// ==================
import "./index.less";

import tools from "@/utils/tools"; // 工具
import { AppFeedback, AppFeedbackReply } from "@/models/index.type";
import { RootState, Dispatch } from "@/store/index";
import TextArea from "antd/lib/input/TextArea";

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

function FeedbackListContainer() {
	const [form] = Form.useForm();
	const dispatch = useDispatch<Dispatch>();
	const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中
	const powers = useSelector((state: RootState) => state.admin.powersCode);
	const [data, setData] = useState<AppFeedback[]>([]); // 当前页面列表数据
	const [imgs, setImgs] = useState<string[] | undefined>([]);
	const [replyText, setReplyText] = useState<string>("");
	const [replyList, setReplyList] = useState<AppFeedbackReply[]>([]);

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
		imgs: undefined,
		user: undefined,
		content: undefined,
		contact: undefined,
		type: undefined,
		begin_date: undefined,
		end_date: undefined,
	});

	const searchContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ content: e.target.value });
	};
	const searchTypeChange = (v: number) => {
		setSearchInfo({ type: v });
	};
	const searchContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ contact: e.target.value });
	};
	const searchBeginDateChange = (value: DatePickerProps["value"]) => {
		setSearchInfo({ begin_date: value?.format("YYYY-MM-DD HH:mm:ss") });
	};
	const searchEndDateChange = (value: DatePickerProps["value"]) => {
		setSearchInfo({ end_date: value?.format("YYYY-MM-DD HH:mm:ss") });
	};
	// 搜索
	const onSearch = () => {
		onGetData(page);
	};

	useMount(() => {
		onGetData(page);
	});

	// 分页查询
	const onGetData = async (page: { page_num: number; page_size: number }): Promise<void> => {
		if (!powers.includes("appFeedback:query")) {
			return;
		}
		const params = {
			page_num: page.page_num,
			page_size: page.page_size,
			content: searchInfo.content,
			contact: searchInfo.contact,
			type: searchInfo.type,
			begin_date: searchInfo.begin_date,
			end_date: searchInfo.end_date,
		};
		setLoading(true);
		try {
			const res = await dispatch.feedback.getAppFeedbackList(tools.clearNull(params));
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

	// 获取回复列表
	const onGetReplyList = async (feedback_id: number | undefined): Promise<void> => {
		if (!powers.includes("appFeedback:query")) {
			return;
		}
		if (feedback_id === undefined) {
			return;
		}
		const params = {
			feedback_id: feedback_id,
		};
		const res = await dispatch.feedback.getReplyFeedbackList(params);
		if (res?.code == 200) {
			setReplyList(res.data);
		}
	};

	const tableData = useMemo(() => {
		return data.map((item, index): TableRecordData => {
			return {
				key: index,
				uuid: item.uuid,
				serial: index + 1 + (page.page_num - 1) * page.page_size,
				content: item.content,
				contact: item.contact,
				imgs: item.imgs,
				type: item.type,
				user: item.user,
				user_id: item.user_id,
				create_time: item.create_time,
				control: item.uuid,
			};
		});
	}, [page, data]);

	// 表单页码改变
	const onTablePageChange = (page_num: number, page_size: number | undefined) => {
		onGetData({ page_num, page_size: page_size || page.page_size });
	};

	const showImgs = () => {
		const res: JSX.Element[] = [];
		if (imgs?.length > 0) {
			imgs.forEach((item, idx) => {
				res.push(<Image key={idx} style={{ width: "50px", height: "auto" }} width="50px" src={`${URL.APP_IMGS_URL}/${item}`} />);
			});
			return <div>{res}</div>;
		} else {
			return;
		}
	};

	const showReplyList = () => {
		const res: JSX.Element[] = [];
		if (replyList.length > 0) {
			replyList.forEach((item, idx) => {
				res.push(
					<span
						key={idx}
						style={{ display: "flex", flexDirection: "row" }}
					>{`${item.reply_user}: ${item.content} ${item.create_time}`}</span>
				);
			});
			return <div style={{ maxHeight: "300px", overflow: "auto" }}>{res}</div>;
		} else {
			return;
		}
	};

	const handleGetTextValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setReplyText(event.target.value);
	};

	/**
	 * 添加/修改/查看 模态框出现
	 * @param data 当前选中的那条数据
	 * @param type add添加/up修改/see查看
	 * **/
	const onModalShow = async (data: TableRecordData | null, type: OperateType) => {
		setModal({
			modalShow: true,
			nowData: data,
			operateType: type,
		});
		setTimeout(() => {
			onGetReplyList(data?.uuid);
			if (type === "add") {
				// 新增，需重置表单各控件的值
				form.resetFields();
			} else {
				setReplyText("");
				// 查看或修改，需设置表单各控件的值为当前所选中行的数据
				form.setFieldsValue({
					formUuid: data?.uuid,
					formContent: data?.content,
					formContact: data?.contact,
					formType: data?.type,
					formImgs: data?.imgs,
					formUser: data?.user,
					formUserId: data?.user_id,
					formCreateTime: data?.create_time,
				});
				if (data?.imgs) {
					let img_arr = data?.imgs.split(",");
					setImgs(img_arr);
				} else {
					setImgs([]);
				}
			}
		});
	};

	// 删除某一条数据
	const onDel = async (uuid: number) => {
		setLoading(true);
		try {
			const res = await dispatch.feedback.delAppFeedback({ uuid });
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
			if (modal.operateType === "reply") {
				// 新增
				try {
					const params: ReplyInfo = {
						content: replyText,
						to_user_id: values.formUserId,
						feedback_id: values.formUuid,
					};
					const res: Res = await dispatch.feedback.replyAppFeedback(params);
					if (res && res.code === 200) {
						message.success("回复成功");
						onGetData(page);
						onClose();
					} else {
						message.error(res?.msg);
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
			width: 80,
		},
		{
			title: "标识",
			dataIndex: "uuid",
			key: "uuid",
			width: 110,
		},
		{
			title: "内容",
			dataIndex: "content",
			key: "content",
		},
		{
			title: "联系方式",
			dataIndex: "contact",
			key: "contact",
		},
		{
			title: "用户",
			dataIndex: "user",
			key: "user",
		},
		{
			title: "图片",
			dataIndex: "imgs",
			key: "imgs",
			render: (text: string | null) => {
				if (text !== null && text != "") {
					let imgs: string[] = text.split(",");
					const res: JSX.Element[] = [];
					imgs.forEach((item, idx) => {
						res.push(
							<Image key={idx} style={{ width: "50px", height: "auto" }} width="50px" src={`${URL.APP_IMGS_URL}/${item}`} />
						);
					});
					return <div>{res}</div>;
				} else {
					return "";
				}
			},
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
			title: "操作",
			key: "control",
			width: 120,
			render: (v: number, record: TableRecordData) => {
				const controls = [];
				powers.includes("appFeedback:reply") &&
					controls.push(
						<span key="0" className="control-btn green" onClick={() => onModalShow(record, "reply")}>
							<Tooltip placement="top" title="回复">
								<EditOutlined />
							</Tooltip>
						</span>
					);
				powers.includes("appFeedback:query") &&
					controls.push(
						<span key="1" className="control-btn green" onClick={() => onModalShow(record, "see")}>
							<Tooltip placement="top" title="查看">
								<EyeOutlined />
							</Tooltip>
						</span>
					);
				powers.includes("appFeedback:del") &&
					controls.push(
						<Popconfirm key="2" title="确定删除吗?" onConfirm={() => onDel(record.uuid)} okText="确定" cancelText="取消">
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
			<div className="g-search">
			{powers.includes("appFeedback:query") && (
					<ul className="search-ul">
						<li>
							<Input placeholder="请输入反馈内容" onChange={searchContentChange} value={searchInfo.content} />
						</li>
						<li>
							<Select
								placeholder="请选择类型"
								allowClear
								style={{ width: "120px" }}
								onChange={searchTypeChange}
								value={searchInfo.type}
							>
								<Option key="1" value={1}>
									建议
								</Option>
								<Option key="2" value={2}>
									BUG
								</Option>
							</Select>
						</li>
						<li>
							<Input placeholder="请输入联系方式" onChange={searchContactChange} value={searchInfo.contact} />
						</li>
						<li>
							<DatePicker showTime format="YYYY-MM-DD HH:mm" onOk={searchBeginDateChange} placeholder="开始时间" />
						</li>
						<li>
							<DatePicker showTime format="YYYY-MM-DD HH:mm" onOk={searchEndDateChange} placeholder="结束时间" />
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
						showTotal: (total, range) => `共 ${total} 条数据`,
						onChange: (page, page_size) => onTablePageChange(page, page_size),
					}}
				/>
			</div>

			{/* 新增&修改&查看 模态框 */}
			<Modal
				width="900px"
				title={{ reply: "回复", see: "查看" }[modal.operateType]}
				open={modal.modalShow}
				onOk={() => onOk()}
				onCancel={() => onClose()}
				confirmLoading={modal.modalLoading}
			>
				<Form form={form}>
					<Form.Item label="ID" name="formUuid" {...formItemLayout}>
						<Input disabled={true} />
					</Form.Item>
					<Form.Item label="用户" name="formUserId" {...formItemLayout}>
						<Input disabled={true} />
					</Form.Item>
					<Form.Item label="内容" name="formContent" {...formItemLayout}>
						<TextArea placeholder="请输入内容" disabled={true} rows={6} />
					</Form.Item>
					<Form.Item label="图片附件" {...formItemLayout}>
						{showImgs()}
					</Form.Item>
					<Form.Item label="联系方式" name="formContact" {...formItemLayout}>
						<Input style={{ width: "100%" }} disabled={true} />
					</Form.Item>
					<Form.Item label="类型" name="formType" {...formItemLayout}>
						<Select placeholder="请选择图片类型" disabled={true}>
							<Option value="1">建议</Option>
							<Option value="2">BUG</Option>
						</Select>
					</Form.Item>
					<Form.Item label="回复列表" {...formItemLayout}>
						{showReplyList()}
					</Form.Item>
					{modal.operateType === "reply" && (
						<Form.Item label="回复" {...formItemLayout}>
							<TextArea placeholder="请输入回复内容" rows={6} onChange={handleGetTextValue} value={replyText} />
						</Form.Item>
					)}
				</Form>
			</Modal>
		</div>
	);
}
export default FeedbackListContainer;
