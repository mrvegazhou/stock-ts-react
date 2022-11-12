// ./app.js的state类型
export interface AdminState {
	userinfo: UserInfo;
	powersCode: string[];
	token: string;
}

// 用户数据类型
export interface UserInfo {
	userBasicInfo: UserBasicInfo | null; // 用户的基本信息
	menus: Menu[]; // 拥有的所有菜单对象
	roles: Role[]; // 拥有的所有角色对象
	powers: Power[]; // 拥有的所有权限对象
}

// 用户的基本信息
export interface UserBasicInfo {
	uuid: number; // ID
	username: string; // 用户名
	password: string | number; // 密码
	phone: string | number; // 手机
	email: string; // 邮箱
	description: string; // 描述
	status: number; // 状态 1启用，-1禁用
	roles: number[]; // 拥有的所有角色ID
}

// 角色对象
export interface Role extends RoleParam {
	uuid: number; // ID
	menu_powers: MenuPower[]; // 当前角色拥有的菜单id和权限id
}

// 菜单id和权限id
export interface MenuPower {
	menu_id: number; // 菜单ID
	powers: number[]; // 该菜单拥有的所有权限ID
}

// 菜单对象
export interface Menu extends MenuParam {
	uuid: number; // ID
}

// 权限对象
export interface Power extends PowerParam {
	uuid: number; // ID
}

// 菜单添加，修改时的参数类型
export interface MenuParam {
	uuid?: number; // ID,添加时可以没有id
	title: string; // 标题
	icon: string; // 图标
	url: string; // 链接路径
	parent: number | null; // 父级ID
	description: string; // 描述
	sorts: number; // 排序编号
	status: number; // 状态，1启用，-1禁用
	children?: Menu[]; // 子菜单
}

// 角色对象
export interface Role extends RoleParam {
	uuid: number; // ID
	menu_powers: MenuAndPower[]; // 当前角色拥有的菜单id和权限id
}

// 角色添加和修改时的参数类型
export interface RoleParam {
	uuid?: number; // ID,添加时可以不传id
	title: string; // 角色名
	description: string; // 描述
	sorts: number; // 排序编号
	status: number; // 状态，1启用，-1禁用
	menu_powers?: MenuAndPower[]; // 添加时可以不传菜单和权限
}

// 菜单id和权限id
export interface MenuAndPower {
	menu_id: number; // 菜单ID
	powers: number[]; // 该菜单拥有的所有权限ID
}

// 权限对象
export interface Power extends PowerParam {
	uuid: number; // ID
}

// 权限添加修改时的参数类型
export interface PowerParam {
	uuid?: number; // ID, 添加时可以没有id
	menu_id: number; // 所属的菜单
	title: string; // 标题
	code: string; // CODE
	description: string; // 描述
	sorts: number; // 排序
	status: number; // 状态 1启用，-1禁用
}

// 用户数据类型
export interface UserInfo {
	userBasicInfo: UserBasicInfo | null; // 用户的基本信息
	menus: Menu[]; // 拥有的所有菜单对象
	roles: Role[]; // 拥有的所有角色对象
	powers: Power[]; // 拥有的所有权限对象
}

// 接口的返回值类型
export type Res =
	| {
			code: number; // 状态，200成功
			data?: any; // 返回的数据
			msg?: string; // 返回的消息
	  }
	| undefined;

export interface PowerTree extends Menu {
	powers: Power[];
}

// ./sys.js的state类型
export interface SysState {
	menus: Menu[];
	roles: Role[];
	powerTreeData: PowerTree[];
}

// 添加修改用户时参数的数据类型
export interface UserBasicInfoParam {
	uuid?: number; // ID
	username: string; // 用户名
	password: string | number; // 密码
	phone?: string | number; // 手机
	email?: string; // 邮箱
	description?: string; // 描述
	status?: number; // 状态 1启用，-1禁用
}

// 应用用户的数据类型
export interface AppUserInfo {
	uuid?: number; // ID
	username: string; // 用户名
	email: string; //邮箱
	phone?: string | number; // 手机
	description?: string; // 描述
	type: string;
	status?: number; // 状态 1启用，-1禁用
	create_time: string;
	update_time: string;
	delete_time: string;
}

// ./app.js的state类型
export interface AppState {
}
