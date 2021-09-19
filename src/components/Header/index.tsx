/** 头部 **/

// ==================
// 第三方库
// ==================
import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Layout, Tooltip, Menu, Dropdown } from "antd";
import { HomeOutlined, CalendarOutlined, DownOutlined } from '@ant-design/icons';
import logo from "../../assets/logo.png";
const { Header } = Layout;

// ==================
// 自定义的东西
// ==================
import "./index.less";

// ==================
// 类型声明
// ==================
import { UserInfo } from "@/models/index.type";
import { tabKeyRouterMap } from '../../constants';
import {History} from "history";

interface Element {
  webkitRequestFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  mozCancelFullScreen?: () => void;
  msRequestFullscreen?: () => void;
  msExitFullscreen?: () => void;
}

type Props = {
  userinfo: UserInfo; // 用户信息
  onLogout: () => void; // 退出登录
  history: History;
  location: Location;
}

export default function HeaderCom(props: Props): JSX.Element {

  const selectedKey = tabKeyRouterMap[props.location.pathname];
  // 根据理由选中对应 menu 项
  const defaultKey = [selectedKey];

  // 路由切换
  const clickMenu = ({ key }: { key: string }) => {
    if (key !== selectedKey && key !== 'auth') {
      props.history.push(tabKeyRouterMap[key]);
      // requestDataWrapper(key);
    }
  };

  const clickDropdownMenu = ({ key }: { key: string }) => {
    props.history.push(tabKeyRouterMap[key]);
  };

  // 退出登录
  const onMenuClick = useCallback(
    (e) => {
      // 退出按钮被点击
      if (e.key === "logout") {
        props.onLogout();
      }
    },
    [props]
  );

  const u = props.userinfo.userBasicInfo;

  const menu = (
      <Menu onClick={clickDropdownMenu} style={{width: '120px', textAlign: 'center'}}>
        <Menu.Item key="useradmin">
          用户管理
        </Menu.Item>
        <Menu.Item key="roleadmin">
          角色管理
        </Menu.Item>
        <Menu.Item key="poweradmin">
          权限管理
        </Menu.Item>
        <Menu.Item key="menuadmin">
          菜单管理
        </Menu.Item>
      </Menu>
  );


  return (
      <div className="stock-header">
        <div className="brand">
          <Link to="/">
            <img
                src={String(logo)}
                alt="大可logo"
                width=""
                height="32"
            />
          </Link>
        </div>
        <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={defaultKey}
            onClick={clickMenu}
            style={{lineHeight: '64px'}}
        >
          <Menu.Item key="home">
            <HomeOutlined/>
            首页
          </Menu.Item>
          <Menu.Item key="2020">
            <CalendarOutlined/>
            2020年
          </Menu.Item>
          <Menu.Item key="2019">
            <CalendarOutlined/>
            2019年
          </Menu.Item>
          <Menu.Item key="2018">
            <CalendarOutlined/>
            2018年
          </Menu.Item>
          <Menu.Item key="auth">
            <CalendarOutlined/>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                权限管理 <DownOutlined />
              </a>
            </Dropdown>
          </Menu.Item>
        </Menu>
        <div className="stock-header-item">
          <span className="stock-header-item-pv">累计查询</span>
        </div>
      </div>
  );
}
