import { appBaseUrl } from "@/config";

export const LOADING_TIP = "页面加载中...";

export const tabKeyRouterMap: { [x: string]: string } = {
	"/admin/sys/useradmin": "useradmin",
	useradmin: "/admin/sys/useradmin",

	"/admin/sys/roleadmin": "roleadmin",
	roleadmin: "/admin/sys/roleadmin",

	poweradmin: "/admin/sys/poweradmin",
	"/admin/sys/poweradmin": "poweradmin",

	menuadmin: "/admin/sys/menuadmin",
	"/admin/sys/menuadmin": "menuadmin",

	home: "home",
	"/admin/sys/home": "home",

	"/admin/sys/menurole": "menurole",
	menurole: "/admin/sys/menurole",

	"/admin/sys/appUserList": "appuser",
	appuser: "/admin/sys/appUserList",

	resource: "/admin/sys/resource",
	"/admin/sys/resource": "resource",

	imgs: "/admin/sys/imgs",
	"/admin/sys/imgs": "imgs",
};

export class URL {
	private static readonly BASE = "/admin/sys/";

	//后台admin管理
	public static readonly LOGIN = `${URL.BASE}login`;
	public static readonly LOGOUT = `${URL.BASE}logout`;
	public static readonly USER_LIST = `${URL.BASE}userList`;
	public static readonly ADD_ADMIN_USER = `${URL.BASE}addAdminUser`;
	public static readonly UPDATE_ADMIN_USER = `${URL.BASE}updateAdminUser`;
	public static readonly UPDATE_ADMIN_PASSWORD = `${URL.BASE}updateAdminPassword`;
	public static readonly DEL_USER = `${URL.BASE}delAdminUser`;

	public static readonly MENUS = `${URL.BASE}menusByIds`;
	public static readonly ALL_MENUS = `${URL.BASE}allMenus`;
	public static readonly ADD_MENU = `${URL.BASE}addMenu`;
	public static readonly UPDATE_MENU = `${URL.BASE}updateMenu`;
	public static readonly DEL_MENU = `${URL.BASE}delMenu`;

	public static readonly ADD_POWER = `${URL.BASE}addPower`;
	public static readonly UPDATE_POWER = `${URL.BASE}updatePower`;
	public static readonly DEL_POWER = `${URL.BASE}delPower`;
	public static readonly MENU_POWERS = `${URL.BASE}menuPowers`;
	public static readonly MENU_POWERS_BY_POWER_IDS = `${URL.BASE}menuPowersByPowerIds`;
	public static readonly MENU_POWERS_BY_MENU_ID = `${URL.BASE}menuPowersByMenuId`;
	public static readonly ALL_ROLES_MENU_POWERS = `${URL.BASE}allRolesMenuPowers`;

	//角色管理
	public static readonly SYS_ROLES = `${URL.BASE}sysRoles`;
	public static readonly ADD_ROLE = `${URL.BASE}addRole`;
	public static readonly UPDATE_ROLE = `${URL.BASE}updateRole`;
	public static readonly ROLE_INFO = `${URL.BASE}roleMenuPowers`;
	public static readonly ASSIGN_ROLE = `${URL.BASE}assignRole`;
	public static readonly SET_POWERS_BY_ROLE_ID = `${URL.BASE}setPowersByRoleId`;
	public static readonly SET_POWERS_BY_ROLE_IDS = `${URL.BASE}setPowersByRoleIds`;
	public static readonly DEL_ROLE = `${URL.BASE}delRole`;
	public static readonly SET_MENU_ROLES = `${URL.BASE}setMenuRoles`;

	//应用用户管理
	public static readonly APP_USER_LIST = `${URL.BASE}appUserList`;
	public static readonly UPDATE_APP_USER_INFO = `${URL.BASE}updateAppUserInfo`;
	public static readonly APP_USER_INFO = `${URL.BASE}getAppUserInfo`;
	public static readonly DEL_APP_USER = `${URL.BASE}delAppUser`;
	public static readonly ADD_APP_USER = `${URL.BASE}addAppUser`;

	//图片资源管理
	public static readonly APP_IMGS = `${URL.BASE}getAppImgs`;
	public static readonly APP_UPDATE_IMG = `${URL.BASE}updateImg`;
	public static readonly APP_DEL_IMG = `${URL.BASE}delImg`;
	public static readonly APP_IMGS_URL = `${appBaseUrl}/static/page/img`;
}

export const PAGE_SIZE = 20;
export const HOME_URL: string = "/admin/sys/home";
