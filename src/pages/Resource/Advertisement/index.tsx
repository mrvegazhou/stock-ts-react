/** 资源应用/搜索日志管理 **/

import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetState, useMount } from "react-use";
import { Button, Input, Table, message, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { DatePickerProps } from "antd/es/date-picker";

import { PAGE_SIZE } from "@/constants/index";
import { Page, TableRecordData, SearchInfo } from "./index.type";

// ==================
// CSS
// ==================
import "./index.less";

import tools from "@/utils/tools"; // 工具
import { AppAdList } from "@/models/index.type";
import { RootState, Dispatch } from "@/store/index";

// ==================
// 本组件
// ==================
const { Option } = Select;
function AdvertisementContainer() {
	const dispatch = useDispatch<Dispatch>();
	const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中
	const powers = useSelector((state: RootState) => state.admin.powersCode);
	const [data, setData] = useState<AppAdList[]>([]); // 当前页面列表数据

	// 分页相关参数控制
	const [page, setPage] = useSetState<Page>({
		page_num: 1,
		page_size: PAGE_SIZE,
		total: 0,
	});

	// 搜索相关参数
	const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
		content: undefined,
		url: undefined,
		type: undefined,
		begin_date: undefined,
		end_date: undefined,
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
	const searchUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInfo({ url: e.target.value });
	};
	const searchTypeChange = (v: number) => {
		setSearchInfo({ type: v });
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
		if (!powers.includes("appAd:query")) {
			return;
		}
		const params = {
			page_num: page.page_num,
			page_size: page.page_size,
			content: searchInfo.content,
			type: searchInfo.type,
			url: searchInfo.url,
			begin_date: searchInfo.begin_date,
			end_date: searchInfo.end_date,
		};
		setLoading(true);
		try {
			const res = await dispatch.advertisement.getAppAdList(tools.clearNull(params));
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
				type: item.type,
				url: item.url,
				content: item.content,
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
			title: "广告内容",
			dataIndex: "content",
			key: "content",
		},
		{
			title: "广告链接",
			dataIndex: "url",
			key: "url",
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
			title: "修改时间",
			dataIndex: "update_time",
			key: "update_time",
		},
	];

	return (
		<div>
			<div className="g-search">
				{powers.includes("appSearchLog:query") && (
					<ul className="search-ul">
						<li>
							<Input
								style={{ width: "250px" }}
								placeholder="请输入广告内容"
								onChange={searchContentChange}
								value={searchInfo.content}
							/>
						</li>
						<li>
							<Input style={{ width: "250px" }} placeholder="请输入广告链接" onChange={searchUrlChange} value={searchInfo.url} />
						</li>
						<li>
							<Select
								placeholder="请选择类型"
								allowClear
								style={{ width: "200px" }}
								onChange={searchTypeChange}
								value={searchInfo.type}
							>
								<Option value={1}>首页广告</Option>
								<Option value={2}>底部广告</Option>
							</Select>
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
		</div>
	);
}
export default AdvertisementContainer;
