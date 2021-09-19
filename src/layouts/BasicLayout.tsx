/** 基础页面结构 - 有头部、底部 **/

// ==================
// 第三方库
// ==================
import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { History } from "history";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
import loadable from "@loadable/component";
import { Layout, message } from "antd";
const { Content } = Layout;

// ==================
// 自定义的东西
// ==================
import tools from "@/utils/tools";


// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store/index";
import { Menu } from "@/models/index.type";


import Bread from "@/components/Bread";
import ErrorBoundary from "@/components/ErrorBoundary";
import Loading from "@/components/Loading";

type Props = {
    history: History;
    location: Location;
};

import Header from "@/components/Header";
import './BasicLayout.less';

// ==================
// 异步加载各路由模块
// ==================
const [NotFound, NoPower, Home, UserAdmin, RoleAdmin, PowerAdmin, MenuAdmin] = [
    () => import(`../pages/ErrorPages/404`),
    () => import(`../pages/ErrorPages/401`),
    () => import(`../pages/Home/index`),
    () => import(`../pages/System/UserAdmin`),
    () => import(`../pages/System/RoleAdmin`),
    () => import(`../pages/System/PowerAdmin`),
    () => import(`../pages/System/MenuAdmin`),
].map((item) => {
    return loadable(item as any, {
        fallback: <Loading />,
    });
});


// ==================
// 本组件
// ==================
function BasicLayoutCom(props: Props): JSX.Element {

    const dispatch = useDispatch<Dispatch>();

    const userinfo = useSelector((state: RootState) => state.app.userinfo);

    // 退出登录
    const onLogout = useCallback(() => {
        dispatch.app.onLogout({uuid: userinfo.userBasicInfo!.uuid}).then(() => {
            message.success("退出成功");
            props.history.push("/user/login");
        });
    }, [props, dispatch.app]);

    /**
     * 工具 - 判断当前用户是否有该路由权限，如果没有就跳转至401页
     * @param pathname 路由路径
     * **/
    const checkRouterPower = useCallback(
        (pathname: string) => {
            let menus: Menu[] = [];
            if (userinfo.menus && userinfo.menus.length) {
                menus = userinfo.menus;
            } else if (sessionStorage.getItem("userinfo")) {
                menus = JSON.parse(
                    tools.uncompile(sessionStorage.getItem("userinfo") || "[]")
                ).menus;
            }
            const m: string[] = menus.map((item) => item.url); // 当前用户拥有的所有菜单

            if (m.includes(pathname)) {
                return true;
            }
            return false;
        },
        [userinfo]
    );


    // 切换路由时触发
    const onEnter = useCallback(
        (Component, props) => {
            return <Component {...props} />;
            /**
             * 检查当前用户是否有该路由页面的权限
             * 没有则跳转至401页
             * **/
            // if (checkRouterPower(props.location.pathname)) {
            //     return <Component {...props} />;
            // }
            // return <Redirect to="/nopower" />;
        },
        [checkRouterPower]
    );
    return (
        <Layout>
            <Layout.Header>
                <Header
                    userinfo={userinfo}
                    onLogout={onLogout}
                    history={props.history}
                    location={props.location}
                />
            </Layout.Header>

            {/* 普通面包屑导航 */}
            <Bread menus={userinfo.menus} location={props.location} />

            <Content className="content">
                <ErrorBoundary location={props.location}>
                    <CacheSwitch>
                        <Redirect exact from="/" to="/home" />
                        <Route
                            exact
                            path="/home"
                            render={(props) => onEnter(Home, props)}
                        />
                        <Route
                            exact
                            path="/system/useradmin"
                            render={(props) => onEnter(UserAdmin, props)}
                        />
                        <Route
                            exact
                            path="/system/roleadmin"
                            render={(props) => onEnter(RoleAdmin, props)}
                        />
                        <Route
                            exact
                            path="/system/poweradmin"
                            render={(props) => onEnter(PowerAdmin, props)}
                        />
                        <Route
                            exact
                            path="/system/menuadmin"
                            render={(props) => onEnter(MenuAdmin, props)}
                        />
                        <Route component={NotFound} />
                    </CacheSwitch>
                </ErrorBoundary>
            </Content>
            <Layout.Footer style={{ textAlign: 'center' }}>
                <div>
                    <a href="#" target="blank">
                        footer
                    </a>
                </div>
            </Layout.Footer>
        </Layout>
    );
}

export default BasicLayoutCom;