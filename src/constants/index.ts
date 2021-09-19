export const LOADING_TIP = '页面加载中...';

export const tabKeyRouterMap: { [x: string]: string } = {
    '/system/useradmin':    'useradmin',
    'useradmin':            '/system/useradmin',
    '/system/roleadmin':    'roleadmin',
    'roleadmin':            '/system/roleadmin',
    'poweradmin':           '/system/poweradmin',
    '/system/poweradmin':   'poweradmin',
    'menuadmin':            '/system/menuadmin',
    '/system/menuadmin':    'menuadmin',
    '/home': 'home',
};

export class URL {
    private static readonly BASE = '/admin/finance/';

    //后台用户管理
    public static readonly LOGIN = `${URL.BASE}login`;
    public static readonly LOGOUT = `${URL.BASE}logout`;
    public static readonly USER_LIST = `${URL.BASE}userList`;
    public static readonly ADD_ADMIN_USER = `${URL.BASE}addAdminUser`;
    public static readonly UPDATE_ADMIN_USER = `${URL.BASE}updateAdminUser`;
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

}

export const PAGE_SIZE = 20;