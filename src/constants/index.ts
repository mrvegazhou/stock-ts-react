import { appBaseUrl } from "@/config";

export const LOADING_TIP = "页面加载中...";

export const tabKeyRouterMap: { [x: string]: string } = {
	useradmin: "/admin/sys/useradmin",
	roleadmin: "/admin/sys/roleadmin",
	poweradmin: "/admin/sys/poweradmin",
	menuadmin: "/admin/sys/menuadmin",
	home: "/admin/sys/home",
	menurole: "/admin/sys/menurole",
	appuser: "/admin/sys/appUserList",
	resource: "/admin/sys/resource",
	imgs: "/admin/sys/imgs",
	imgLib: "/admin/sys/imgLib",
	searchLog: "/admin/sys/getSearchLogList",
	appfeedback: "/admin/sys/getFeedbackList",
	adList: "/admin/sys/adList",
};

export class URL {
	private static readonly BASE = "/admin/sys/";

	//后台admin管理
	public static readonly LOGIN = `${URL.BASE}login`;
	public static readonly LOGOUT = `${URL.BASE}logout`;
	public static readonly ADMIN_ROLE_MENU_POWERS = `${URL.BASE}getAdminRoleMenuPowers`;
	public static readonly USER_LIST = `${URL.BASE}userList`;
	public static readonly ADD_ADMIN_USER = `${URL.BASE}addAdminUser`;
	public static readonly UPDATE_ADMIN_USER = `${URL.BASE}updateAdminUser`;
	public static readonly UPDATE_ADMIN_PASSWORD = `${URL.BASE}updateAdminPassword`;
	public static readonly DEL_USER = `${URL.BASE}delAdminUser`;

	public static readonly ALL_MENUS = `${URL.BASE}allMenus`;
	public static readonly ADD_MENU = `${URL.BASE}addMenu`;
	public static readonly UPDATE_MENU = `${URL.BASE}updateMenu`;
	public static readonly DEL_MENU = `${URL.BASE}delMenu`;

	public static readonly ADD_POWER = `${URL.BASE}addPower`;
	public static readonly UPDATE_POWER = `${URL.BASE}updatePower`;
	public static readonly DEL_POWER = `${URL.BASE}delPower`;
	public static readonly MENU_POWERS = `${URL.BASE}menuPowers`;
	public static readonly MENU_POWERS_BY_MENU_ID = `${URL.BASE}menuPowersByMenuId`;
	public static readonly ALL_ROLES_MENU_POWERS = `${URL.BASE}allRolesMenuPowers`;

	//角色管理
	public static readonly SYS_ROLES = `${URL.BASE}sysRoles`;
	public static readonly ADD_ROLE = `${URL.BASE}addRole`;
	public static readonly UPDATE_ROLE = `${URL.BASE}updateRole`;
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

	//图片库资源管理
	public static readonly APP_IMG_LIB = `${URL.BASE}getAppImgLib`;
	public static readonly APP_UPDATE_IMG_LIB = `${URL.BASE}updateImgLib`;
	public static readonly APP_DEL_IMG_LIB = `${URL.BASE}delImgLib`;

	//反馈管理
	public static readonly APP_FEEDBACKS = `${URL.BASE}getFeedbackList`;
	public static readonly APP_DEL_FEEDBACK = `${URL.BASE}delFeedback`;
	public static readonly APP_REPLY_FEEDBACK = `${URL.BASE}replyFeedback`;
	public static readonly APP_REPLY_FEEDBACK_LIST = `${URL.BASE}replyFeedbackList`;

	//广告列表
	public static readonly APP_AD = `${URL.BASE}getAdList`;

	//搜索日志管理
	public static readonly APP_SEARCH_LOG_LIST = `${URL.BASE}getSearchLogList`;
}

export const PAGE_SIZE = 20;
export const HOME_URL: string = "/admin/sys/home";
