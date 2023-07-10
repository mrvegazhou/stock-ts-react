import type { DatePickerProps } from "antd/es/date-picker";
import { AppAdList, OperateType } from "@/models/index.type";

export type { Res, Page, OperateType } from "@/models/index.type";

// 构建table所需数据
export type TableRecordData = AppAdList & {
	key: number;
	serial: number;
	control: number;
};

// 搜索相关参数
export type SearchInfo = {
	type: number | undefined;
	content: string | undefined;
	url: string | undefined;
	begin_date: string | DatePickerProps["value"];
	end_date: string | DatePickerProps["value"];
};

// 模态框相关参数
export type ModalType = {
	operateType: OperateType;
	nowData: TableRecordData | null;
	modalShow: boolean;
	modalLoading: boolean;
};
