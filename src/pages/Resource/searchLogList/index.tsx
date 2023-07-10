/** 资源应用/搜索日志管理 **/

import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetState, useMount } from "react-use";
import { Button, Input, Table, message, Radio, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { DatePickerProps } from "antd/es/date-picker";

import { PAGE_SIZE } from "@/constants/index";
import { Page, TableRecordData, SearchInfo } from "./index.type";

// ==================
// CSS
// ==================
import "./index.less";

import tools from "@/utils/tools"; // 工具
import { AppSearchLog } from "@/models/index.type";
import { RootState, Dispatch } from "@/store/index";
const RadioGroup = Radio.Group;
// ==================
// 本组件
// ==================

function SearchLogListContainer() {
	const dispatch = useDispatch<Dispatch>();
	const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中
	const powers = useSelector((state: RootState) => state.admin.powersCode);
	const [data, setData] = useState<AppSearchLog[]>([]); // 当前页面列表数据

	// 分页相关参数控制
	const [page, setPage] = useSetState<Page>({
		page_num: 1,
		page_size: PAGE_SIZE,
		total: 0,
	});

	// 搜索相关参数
	const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
		content: undefined,
		user_id: undefined,
		begin_date: undefined,
		end_date: undefined,
		search_type: undefined,
	});

	const searchBeginDateChange = (value: DatePickerProps["value"]) => {
		setSearchInfo({ begin_date: value?.format("YYYY-MM-DD HH:mm:ss") });
	};
	const searchEndDateChange = (value: DatePickerProps["value"]) => {
		setSearchInfo({ end_date: value?.format("YYYY-MM-DD HH:mm:ss") });
	};
	const searchContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ content: e.target.value });
	};
	const searchUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ user_id: Number(e.target.value) });
	};
	const radioGroupSearchType = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ search_type: e.target.value });
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
		if (!powers.includes("appSearchLog:query")) {
			return;
		}
		const params = {
			page_num: page.page_num,
			page_size: page.page_size,
			content: searchInfo.content,
			begin_date: searchInfo.begin_date,
			end_date: searchInfo.end_date,
			search_type: searchInfo.search_type,
		};
		setLoading(true);
		try {
			const res = await dispatch.searchLog.getSearchLogList(tools.clearNull(params));
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
				user_id: item.user_id,
				content: item.content,
				create_time: item.create_time,
				control: item.uuid,
			};
		});
	}, [page, data]);

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
			title: "搜索内容",
			dataIndex: "content",
			key: "content",
		},
		{
			title: "用户ID",
			dataIndex: "user_id",
			key: "user_id",
		},
		{
			title: "创建时间",
			dataIndex: "create_time",
			key: "create_time",
		},
	];

	return (
		<div>
			<div className="g-search">
				{powers.includes("appSearchLog:query") && (
					<ul className="search-ul">
						<li>
							<Input
								style={{ width: "300px" }}
								placeholder="请输入搜索内容"
								onChange={searchContentChange}
								value={searchInfo.content}
							/>
						</li>
						<li>
							<Input placeholder="请输入用户ID" onChange={searchUserIdChange} value={searchInfo.user_id} />
						</li>
						<li>
							<DatePicker showTime format="YYYY-MM-DD HH:mm" onOk={searchBeginDateChange} placeholder="开始时间" />
						</li>
						<li>
							<DatePicker showTime format="YYYY-MM-DD HH:mm" onOk={searchEndDateChange} placeholder="结束时间" />
						</li>
						<li>
							<RadioGroup onChange={radioGroupSearchType} defaultValue="">
								<Radio checked={searchInfo.search_type == "group_by_content" ? true : false} value="">
									普通查询
								</Radio>
								<Radio checked={searchInfo.search_type == "group_by_user_id" ? true : false} value="group_by_user_id">
									按用户分组查询
								</Radio>
								<Radio checked={searchInfo.search_type == "group_by_content" ? true : false} value="group_by_content">
									按搜索内容分组查询
								</Radio>
							</RadioGroup>
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
		</div>
	);
}
export default SearchLogListContainer;
