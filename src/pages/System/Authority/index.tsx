/** Role 系统管理/角色管理 **/

// ==================
// 第三方库
// ==================
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetState, useMount } from "react-use";
import { Form, Button, Input, Table, message, Popconfirm, Modal, Tooltip, Divider, Select, InputNumber } from "antd";
import { EyeOutlined, EditOutlined, ToolOutlined, DeleteOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";

// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store/index";

// ==================
// CSS
// ==================
import "./index.less";

// ==================
// 本组件
// ==================
function RoleAdminContainer() {
	return <div>sss</div>;
}

export default RoleAdminContainer;
