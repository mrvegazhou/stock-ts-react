import { AppUserInfo } from "@/models/index.type";

// 分页相关参数控制
export type Page = {
	page_num: number; // 当前页码
	page_size: number; // 每页显示多少条
	total: number; // 总共多少条数据
};

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
	status: number | undefined; // 状态
};
