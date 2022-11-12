import { Menu } from "@/models/index.type";
export type { Menu, Res } from "@/models/index.type";

// 构建table所需数据
export type TableRecordData = Menu & {
	key: number;
	serial: number;
	control: number;
};

export type ModalType = {
	nowData: TableRecordData | null;
	modalShow: boolean;
	modalLoading: boolean;
};

export type Params = {
	menu_id: number;
	role_ids: number[];
};
