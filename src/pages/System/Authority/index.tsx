/** Role 系统管理/角色管理 **/

// ==================
// 第三方库
// ==================
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetState, useMount } from "_react-use@17.2.4@react-use";
import {
    Form,
    Button,
    Input,
    Table,
    message,
    Popconfirm,
    Modal,
    Tooltip,
    Divider,
    Select,
    InputNumber,
} from "_antd@4.16.9@antd";
import {
    EyeOutlined,
    EditOutlined,
    ToolOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons";


// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store/index";
import {
    Props,
} from "./index.type";


// ==================
// CSS
// ==================
import "./index.less";


// ==================
// 本组件
// ==================
function RoleAdminContainer(props: Props) {

    return (
        <div>sss</div>
    );

}

export default RoleAdminContainer;