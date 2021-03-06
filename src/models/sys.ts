/**
 * 基础model,系统权限相关功能
 * 在src/store/index.js 中被挂载到store上，命名为 sys
 **/
import axios from "@/utils/axios";
import qs from "qs";
import { message } from "antd";
import { Dispatch } from "@/store/index";
import {
    Menu,
    Role,
    MenuParam,
    PowerParam,
    PowerTree,
    RoleParam,
    SysState,
    Res,
    UserBasicInfoParam,
} from "./index.type";
import { URL } from "@/constants/index"

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
    effects: (dispatch: Dispatch) => ({
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
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
            }
            return;
        },

        /**
         * 根据权限ID查询对应的权限数据
         * @param id 可以是一个数字也可以是一个数组
         * **/
        async getPowerById(params: { power_ids: number | number[] }) {
            try {
                const res: Res = await axios.post(URL.MENU_POWERS_BY_POWER_IDS, params);
                return res;
            } catch (err) {
                message.error("网络错误，请重试");
            }
            return;
        },

        /**
         * 通过角色ID查询对应的角色数据
         * @param id 可以是一个数字，也可以是一个数组
         * @return 返回值是数组
         * **/
        async getRoleById(params: { role_ids: number | number[] }) {
            try {
                const res: Res = await axios.post(URL.ROLE_INFO, params);
                return res;
            } catch (err) {
                message.error("网络错误，请重试");
            }
            return;
        },

        /**
         * 根据菜单ID获取对应的菜单信息
         * @param {number} id 可以是一个数字也可以是一个数组
         * **/
        async getMenusById(params: { menu_ids: number | number[] }) {
            try {
                const res: Res = await axios.post(URL.MENUS, params);
                return res;
            } catch (err) {
                message.error("网络错误，请重试");
            }
            return;
        },

        /**
         * 条件分页查询用户列表
         * **/
        async getUserList(params: {
            page_num: number;
            page_size: number;
            username?: string;
            status?: number;
        }) {
            try {
                const res: Res = await axios.post(URL.USER_LIST, params);
                return res;
            } catch (err) {
                message.error("网络错误，请重试");
            }
            return;
        },

        /**
         * 删除用户
         * **/
        async delUser(params: { uuid: number }) {
            try {
                const res: Res = await axios.post(URL.DEL_USER, params);
                return res;
            } catch (err) {
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
            }
            return;
        },

        /**
         * 分页查询角色数据
         * **/
        async getRoles(params: {
            page_num: number;
            page_size: number;
            title?: string;
            status?: number;
        }) {
            try {
                const res: Res = await axios.post(URL.SYS_ROLES, params);
                return res;
            } catch (err) {
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
            }
            return;
        },

        /**
         * 通过角色ID给指定角色设置菜单及权限
         * **/
        async setPowersByRoleId(params: {
            role_id: number;
            menus: number[];
            powers: number[];
        }) {
            try {
                const res: Res = await axios.post(URL.SET_POWERS_BY_ROLE_ID, params);
                return res;
            } catch (err) {
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
            }
            return;
        },

        /**
         * 根据菜单ID查询其下的权限数据
         * **/
        async getPowerDataByMenuId(params: { menu_id: number | null }) {
            try {
                const res: Res = await axios.post(
                    URL.MENU_POWERS_BY_MENU_ID, params
                );
                return res;
            } catch (err) {
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
            }
            return;
        },

        /**
         * (批量)通过角色ID给指定角色设置菜单及权限
         * @param params [{id,menus,powers},...]
         * */
        async setPowersByRoleIds(
            params: {
                role_id: number;
                menus: number[];
                powers: number[];
            }[]
        ) {
            try {
                const res: Res = await axios.post(URL.SET_POWERS_BY_ROLE_IDS, params);
                return res;
            } catch (err) {
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
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
                message.error("网络错误，请重试");
            }
            return;
        },

    }),
};


