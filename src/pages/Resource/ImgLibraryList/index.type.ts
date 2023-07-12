import type { DatePickerProps } from "antd/es/date-picker";
import { AppImgLibrary, OperateType } from "@/models/index.type";

export type { Res, Page, OperateType } from "@/models/index.type";

// 构建table所需数据
export type TableRecordData = AppImgLibrary & {
	key: number;
	serial: number;
	control: number;
};

// 搜索相关参数
export type SearchInfo = {
	tags: string | undefined;
	url: string | undefined;
	note: string | undefined;
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
