import type { DatePickerProps } from "antd/es/date-picker";
import { AppUserInfo } from "@/models/index.type";
export type { Res, Page } from "@/models/index.type";

// 构建table所需数据
export type TableRecordData = AppUserInfo & {
	key: number;
	serial: number;
	control: number;
};

// 模态框打开的类型 see查看，add添加，up修改
export type operateType = "see" | "add" | "up";

// 模态框相关参数
export type ModalType = {
	operateType: operateType;
	nowData: TableRecordData | null;
	modalShow: boolean;
	modalLoading: boolean;
};

// 搜索相关参数
export type SearchInfo = {
	username: string | undefined; // 用户名
	email: string | undefined;
	phone: string | undefined;
	status: number | undefined; // 状态
	begin_date: string | DatePickerProps["value"];
	end_date: string | DatePickerProps["value"];
	type: number | undefined;
};
