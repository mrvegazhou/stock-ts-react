/**
 * 基础model,系统权限相关功能
 * 在src/store/index.js 中被挂载到store上，命名为 sys
 **/
import axios from "@/utils/api/axios";
import { message } from "antd";
import { Dispatch } from "@/store/index";
import { Menu, Role, MenuParam, PowerParam, PowerTree, RoleParam, SysState, Res, UserBasicInfoParam } from "./index.type";
import { URL } from "@/constants/index";

const defaultState: SysState = {
	menus: [], // 所有的菜单信息（用于菜单管理，无视权限）
	roles: [], // 所有的角色信息（用于Model赋予项，无视权限）
	powerTreeData: [], // 分配权限treeTable组件所需原始数据
};

export default {
	state: defaultState,
	reducers: {
		// 保存所有菜单数据
		reducerSetMenus(state: SysState, payload: Menu[]): SysState {
			return { ...state, menus: payload };
		},
		// 保存所有角色数据
		reducerSetRoles(state: SysState, payload: Role[]): SysState {
			return { ...state, roles: payload };
		},

		// 保存所有权限数据
		reducerSetAllPowers(state: SysState, payload: PowerTree[]): SysState {
			return { ...state, powerTreeData: payload };
		},
	},
	effects: (dispatch: any) => ({
		/**
		 * 获取所有菜单
		 * **/
		async getMenus(): Promise<Res> {
			try {
				const res: Res = await axios.post(URL.ALL_MENUS);
				if (res && res.code === 200) {
					dispatch.sys.reducerSetMenus(res.data);
				}
				return res;
			} catch (err) {
				message.error("获取菜单网络错误，请重试");
			}
			return;
		},

		/**
		 * 添加菜单
		 * @param params MenuParam
		 */
		async addMenu(params: MenuParam) {
			try {
				const res: Res = await axios.post(URL.ADD_MENU, params);
				return res;
			} catch (err) {
				message.error("添加菜单网络错误，请重试");
			}
			return;
		},

		/**
		 * 修改菜单
		 * **/
		async upMenu(params: MenuParam) {
			try {
				const res: Res = await axios.post(URL.UPDATE_MENU, params);
				return res;
			} catch (err) {
				message.error("修改菜单网络错误，请重试");
			}
			return;
		},
		/**
		 * 删除菜单
		 * **/
		async delMenu(params: { menu_id: number }) {
			try {
				const res: Res = await axios.post(URL.DEL_MENU, params);
				return res;
			} catch (err) {
				message.error("删除菜单网络错误，请重试");
			}
			return;
		},

		/**
		 * 条件分页查询用户列表
		 **/
		async getUserList(params: { page_num: number; page_size: number; username?: string; status?: number }) {
			try {
				const res: Res = await axios.post(URL.USER_LIST, params);
				return res;
			} catch (err) {
				message.error("查询用户列表网络错误，请重试");
			}
			return;
		},

		/**
		 * 删除用户
		 **/
		async delUser(params: { uuid: number }) {
			try {
				const res: Res = await axios.post(URL.DEL_USER, params);
				return res;
			} catch (err) {
				message.error("删除管理员网络错误，请重试");
			}
			return;
		},

		/** 获取所有角色 **/
		async getAllRoles(): Promise<Res> {
			try {
				const res: Res = await axios.post(URL.ALL_ROLES_MENU_POWERS);
				if (res && res.code === 200) {
					dispatch.sys.reducerSetRoles(res.data);
				}
				return res;
			} catch (err) {
				message.error("获取所有角色网络错误，请重试");
			}
			return;
		},

		/**
		 * 添加用户
		 * **/
		async addUser(params: UserBasicInfoParam) {
			try {
				const res: Res = await axios.post(URL.ADD_ADMIN_USER, params);
				return res;
			} catch (err) {
				message.error("添加用户网络错误，请重试");
			}
			return;
		},

		/**
		 * 修改用户
		 * **/
		async upUser(params: UserBasicInfoParam) {
			try {
				const res: Res = await axios.post(URL.UPDATE_ADMIN_USER, params);
				return res;
			} catch (err) {
				message.error("修改用户网络错误，请重试");
			}
			return;
		},

		/**
		 * 获取所有的菜单及权限详细信息
		 * 如果你在sys.ts中引用了sys本身，则需要显式的注明返回值的类型
		 * **/
		async getAllMenusAndPowers(): Promise<Res> {
			try {
				const res: Res = await axios.post(URL.MENU_POWERS);
				if (res && res.code === 200) {
					dispatch.sys.reducerSetAllPowers(res.data);
				}
				return res;
			} catch (err) {
				message.error("获取菜单及权限网络错误，请重试");
			}
			return;
		},

		/**
		 * 分页查询角色数据
		 * **/
		async getRoles(params: { page_num: number; page_size: number; title?: string; status?: number }) {
			try {
				const res: Res = await axios.post(URL.SYS_ROLES, params);
				return res;
			} catch (err) {
				console.log(err, "---res---")
				message.error("查询角色网络错误，请重试");
			}
			return;
		},

		/**
		 * 添加角色
		 * **/
		async addRole(params: RoleParam) {
			try {
				const res: Res = await axios.post(URL.ADD_ROLE, params);
				return res;
			} catch (err) {
				message.error("添加角色网络错误，请重试");
			}
			return;
		},

		/**
		 * 修改角色
		 * **/
		async upRole(params: RoleParam) {
			try {
				const res: Res = await axios.post(URL.UPDATE_ROLE, params);
				return res;
			} catch (err) {
				message.error("修改角色网络错误，请重试");
			}
			return;
		},

		/**
		 * 通过角色ID给指定角色设置菜单及权限
		 * **/
		async setPowersByRoleId(params: { role_id: number; menus: number[]; powers: number[] }) {
			try {
				const res: Res = await axios.post(URL.SET_POWERS_BY_ROLE_ID, params);
				return res;
			} catch (err) {
				message.error("指定角色菜单及权限网络错误，请重试");
			}
			return;
		},

		/**
		 * 删除角色
		 * **/
		async delRole(params: { role_id: number }) {
			try {
				const res: Res = await axios.post(URL.DEL_ROLE, params);
				return res;
			} catch (err) {
				message.error("删除角色网络错误，请重试");
			}
			return;
		},

		/**
		 * 给用户分配角色
		 * 用的也是upUser接口
		 * **/
		async setUserRoles(params: { admin_user_id: number; role_ids: number[] }) {
			try {
				const res: Res = await axios.post(URL.ASSIGN_ROLE, params);
				return res;
			} catch (err) {
				message.error("分配角色网络错误，请重试");
			}
			return;
		},

		/**
		 * 根据菜单ID查询其下的权限数据
		 * **/
		async getPowerDataByMenuId(params: { menu_id: number | null }) {
			try {
				const res: Res = await axios.post(URL.MENU_POWERS_BY_MENU_ID, params);
				return res;
			} catch (err) {
				message.error("查询权限网络错误，请重试");
			}
			return;
		},

		/**
		 * 添加权限
		 * **/
		async addPower(params: PowerParam) {
			try {
				const res: Res = await axios.post(URL.ADD_POWER, params);
				return res;
			} catch (err) {
				message.error("添加权限网络错误，请重试");
			}
			return;
		},

		/**
		 * (批量)通过角色ID给指定角色设置菜单及权限
		 * @param params [{id,menus,powers},...]
		 * */
		async setPowersByRoleIds(
			params: {
				role_id: number[];
				menu_id: number;
				power_id: number;
			}[]
		) {
			try {
				const res: Res = await axios.post(URL.SET_POWERS_BY_ROLE_IDS, params);
				if (res?.code != 200) {
					message.error(res?.msg);
					return;
				}
				return res;
			} catch (err) {
				message.error("角色设置网络错误，请重试");
			}
			return;
		},

		/**
		 * 删除权限
		 * **/
		async delPower(params: { uuid: number }) {
			try {
				const res: Res = await axios.post(URL.DEL_POWER, params);
				return res;
			} catch (err) {
				message.error("删除权限网络错误，请重试");
			}
			return;
		},

		/**
		 * 修改权限
		 * **/
		async upPower(params: PowerParam) {
			try {
				const res: Res = await axios.post(URL.UPDATE_POWER, params);
				return res;
			} catch (err) {
				message.error("修改权限网络错误，请重试");
			}
			return;
		},

		/**
		 * 修改密码
		 */
		async upPassword(params: { uuid: number; oldPassword: string; newPassword: string }) {
			try {
				const res: Res = await axios.post(URL.UPDATE_ADMIN_PASSWORD, params);
				return res;
			} catch (err) {
				message.error("修改密码网络错误，请重试");
			}
			return;
		},

		/**
		 * 通过菜单给角色赋权限
		 */
		async upMenuRoles(params: { menu_id: number; role_ids: number[] }) {
			try {
				const res: Res = await axios.post(URL.SET_MENU_ROLES, params);
				return res;
			} catch (err) {
				message.error("通过菜单给角色赋权限，网络错误，请重试");
			}
			return;
		 },
	}),
};
