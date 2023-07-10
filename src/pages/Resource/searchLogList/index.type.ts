import type { DatePickerProps } from "antd/es/date-picker";
import { AppSearchLog } from "@/models/index.type";

export type { Res, Page, OperateType } from "@/models/index.type";

// 构建table所需数据
export type TableRecordData = AppSearchLog & {
	key: number;
	serial: number;
	control: number;
};

// 搜索相关参数
export type SearchInfo = {
	content: string | undefined;
	user_id: number | undefined;
	begin_date: string | DatePickerProps["value"];
	end_date: string | DatePickerProps["value"];
	search_type: string | undefined;
};
