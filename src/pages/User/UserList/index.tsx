/** User 应用/用户管理 **/
// ==================
// 所需的第三方库
// ==================
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Input, Table, message, Popconfirm, Modal, Tooltip, Divider, Select, InputNumber } from "antd";
import { EyeOutlined, EditOutlined, ToolOutlined, DeleteOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";

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
function UserListContainer() {
	const dispatch = useDispatch<Dispatch>();
	const [form] = Form.useForm();

	const powers = useSelector((state: RootState) => state.admin.powersCode);

	const [data, setData] = useState<AppUserInfo[]>([]); // 当前页面列表数据

	const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中

	// 分页相关参数控制
	const [page, setPage] = useState<Page>({
		page_num: 1,
		page_size: PAGE_SIZE,
		total: 0,
	});

	// 模态框相关参数控制
	const [modal, setModal] = useState<ModalType>({
		operateType: "up",
		nowData: null,
		modalShow: false,
		modalLoading: false,
	});

	useEffect(() => {
		getData(page);
	}, [page]);

	// 搜索相关参数
	const [searchInfo, setSearchInfo] = useState<SearchInfo>({
		username: undefined, // 角色名
		status: undefined, // 状态
	});

	// 函数- 查询当前页面所需列表数据
	const getData = async (page: { page_num: number; page_size: number }) => {
		if (!powers.includes("appUser:query")) {
			return;
		}
		const params = {
			page_num: page.page_num,
			page_size: page.page_size,
			title: searchInfo.username,
			status: searchInfo.status,
		};
		setLoading(true);
		try {
			const res: Res = await dispatch.app.getAppUserList(tools.clearNull(params));
			if (res && res.code === 200) {
				setData(res.data.list);
				setPage({
					total: res.data.total,
					page_num: page.page_num,
					page_size: page.page_size,
				});
			} else {
				message.error(res?.msg ?? "获取失败");
			}
		} finally {
			setLoading(false);
		}
	};
}
