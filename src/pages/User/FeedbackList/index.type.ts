import type { DatePickerProps } from "antd/es/date-picker";
import { AppFeedback, OperateType } from "@/models/index.type";

export type { Res, Page, OperateType } from "@/models/index.type";

// 构建table所需数据
export type TableRecordData = AppFeedback & {
	key: number;
	serial: number;
	control: number;
};

// 搜索相关参数
export type SearchInfo = {
	content: string | undefined;
	contact: string | undefined;
	imgs: string | undefined;
	user: string | undefined;
	type: number | undefined;
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

export type ReplyInfo = {
	content: string;
	feedback_id: number;
	to_user_id: number;
}
