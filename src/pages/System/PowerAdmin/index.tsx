/** 权限管理页 **/

// ==================
// 第三方库
// ==================
import React, { useState, useCallback, useMemo } from "react";

import { useSetState, useMount } from "react-use";
import { useSelector, useDispatch } from "react-redux";

import {
    Tree,
    Button,
    Table,
    Tooltip,
    Popconfirm,
    Modal,
    Form,
    Select,
    Input,
    InputNumber,
    message,
    Divider,
    Checkbox,
} from "antd";

import {
    EyeOutlined,
    ToolOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";

import { cloneDeep } from "lodash";

// ==================
// CSS
// ==================
import "./index.less";

// ==================
// 自定义的东西
// ==================
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};

// ==================
// 类型声明
// ==================
import {
    TableRecordData,
    ModalType,
    operateType,
    Menu,
    Power,
    PowerParam,
    Res,
} from "./index.type";

import { RootState, Dispatch } from "@/store/index";

import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { EventDataNode, DataNode } from "rc-tree/lib/interface";

type Props = {
    history: History;
    location: Location;
};

// ==================
// 本组件
// ==================
function PowerAdminContainer(props: Props) {
    const dispatch = useDispatch<Dispatch>();
    const p = useSelector((state: RootState) => state.app.powersCode);
    const roles = useSelector((state: RootState) => state.sys.roles);
    const userinfo = useSelector((state: RootState) => state.app.userinfo);
    const [form] = Form.useForm();

    const [data, setData] = useState<Power[]>([]); // 当前所选菜单下的权限数据
    const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中

    const [rolesCheckboxChose, setRolesCheckboxChose] = useState<number[]>([]); // 表单 - 赋予项选中的值

    // 模态框相关参数控制
    const [modal, setModal] = useSetState<ModalType>({
        operateType: "add",
        nowData: null,
        modalShow: false,
        modalLoading: false,
    });

    // 左侧菜单树相关参数 当前Menu树被选中的节点数据
    const [treeSelect, setTreeSelect] = useState<{ title?: string; id?: number }>(
        {}
    );

    // 生命周期 - 首次加载组件时触发
    useMount(() => {
        if (userinfo.menus.length === 0) {
            dispatch.sys.getMenus();
        }
        dispatch.sys.getAllRoles();
        getData();
    });

    // 根据所选菜单id获取其下权限数据
    const getData = async (menu_id: string | number | null = null) => {
        if (!p.includes("power:query")) {
            return;
        }
        setLoading(true);

        const params = {
            menu_id: Number(menu_id) || null,
        };
        try {
            const res: Res = await dispatch.sys.getPowerDataByMenuId(params);
            if (res && res.code === 200) {
                setData(res.data);
            }
        } finally {
            setLoading(false);
        }
    };

    // 工具 - 递归将扁平数据转换为层级数据
    const dataToJson = useCallback((one, data) => {
        let kids;
        if (!one) {
            // 第1次递归
            kids = data.filter((item: Menu) => !item.parent);
        } else {
            kids = data.filter((item: Menu) => item.parent === one.id);
        }
        kids.forEach((item: Menu) => (item.children = dataToJson(item, data)));
        return kids.length ? kids : null;
    }, []);

    // 点击树目录时触发
    const onTreeSelect = (
        keys: React.ReactText[],
        info: {
            event: "select";
            selected: boolean;
            node: EventDataNode & { uuid: number; title: string };
            selectedNodes: DataNode[];
            nativeEvent: MouseEvent;
        }
    ) => {
        if (info.selected) {
            // 选中时才触发
            getData(keys[0]);
            setTreeSelect({
                title: info.node.title,
                id: info.node.uuid,
            });
        } else {
            setTreeSelect({});
            setData([]);
        }
    };

    // 新增&修改 模态框出现
    const onModalShow = (data: TableRecordData | null, type: operateType) => {
        setModal({
            modalShow: true,
            nowData: data,
            operateType: type,
        });
        setRolesCheckboxChose(
            data && data.uuid
                ? roles
                    .filter((item) => {
                        const theMenuPower = item.menu_powers?.find(
                            (item2) => item2.menu_id === data.menu_id
                        );
                        if (theMenuPower) {
                            return theMenuPower.powers.includes(data.uuid);
                        }
                        return false;
                    })
                    .map((item) => item.uuid)
                : []
        );
        setTimeout(() => {
            if (type === "add") {
                // 新增，需重置表单各控件的值
                form.resetFields();
            } else {
                // 查看或修改，需设置表单各控件的值为当前所选中行的数据
                form.setFieldsValue({
                    formStatus: data?.status,
                    formDesc: data?.description,
                    formCode: data?.code,
                    formSorts: data?.sorts,
                    formTitle: data?.title,
                });
            }
        });
    };

    // 新增&修改 模态框关闭
    const onClose = () => {
        setModal({
            modalShow: false,
        });
    };

    // 新增&修改 提交
    const onOk = async () => {
        if (modal.operateType === "see") {
            onClose();
            return;
        }

        try {
            const values = await form.validateFields();
            const params: PowerParam = {
                title: values.formTitle,
                code: values.formCode,
                menu_id: treeSelect.id || 0,
                sorts: values.formSorts,
                description: values.formDesc,
                status: values.formStatus,
            };
            setModal({
                modalLoading: true,
            });
            if (modal.operateType === "add") {
                // 新增
                try {
                    const res: Res = await dispatch.sys.addPower(params);
                    if (res && res.code === 200) {
                        message.success("添加成功");
                        getData(treeSelect.id);
                        onClose();
                        await setPowersByRoleIds(res.data, rolesCheckboxChose);
                        dispatch.app.updateUserInfo();
                        dispatch.sys.getAllRoles();
                        const data =  modal.nowData;
                        setRolesCheckboxChose(
                            data && data.uuid
                                ? roles
                                    .filter((item) => {
                                        const theMenuPower = item.menu_powers?.find(
                                            (item2) => item2.menu_id === data.menu_id
                                        );
                                        if (theMenuPower) {
                                            return theMenuPower.powers.includes(data.uuid);
                                        }
                                        return false;
                                    })
                                    .map((item) => item.uuid)
                                : []
                        );
                    } else {
                        message.error("添加失败");
                    }
                } finally {
                    setModal({
                        modalLoading: false,
                    });
                }
            } else {
                // 修改
                try {
                    if (!modal?.nowData?.uuid) {
                        message.error("该数据没有ID");
                        return;
                    }
                    params.uuid = modal.nowData.uuid;

                    const res: Res = await dispatch.sys.upPower(params);
                    if (res && res.code === 200) {
                        message.success("修改成功");
                        getData(treeSelect.id);
                        onClose();
                        await setPowersByRoleIds(params.uuid, rolesCheckboxChose);
                        dispatch.sys.getAllRoles();
                        const data =  modal.nowData;
                        setRolesCheckboxChose(
                            data && data.uuid
                                ? roles
                                    .filter((item) => {
                                        const theMenuPower = item.menu_powers?.find(
                                            (item2) => item2.menu_id === data.menu_id
                                        );
                                        if (theMenuPower) {
                                            return theMenuPower.powers.includes(data.uuid);
                                        }
                                        return false;
                                    })
                                    .map((item) => item.uuid)
                                : []
                        );
                        dispatch.app.updateUserInfo();
                    } else {
                        message.error("修改失败");
                    }
                } finally {
                    setModal({
                        modalLoading: false,
                    });
                }
            }
        } catch {
            // 未通过校验
        }
    };

    /**
     * 批量更新roles
     * @param id 当前这个权限的id
     * @param roleIds 选中的角色的id们，要把当前权限赋给这些角色
     *  **/
    const setPowersByRoleIds = (id: number, role_ids: number[]) => {
        const params = roles.map((item) => {
            const powersTemp = new Set(
                item.menu_powers.reduce((a, b) => [...a, ...b.powers], [])
            );
            if (role_ids.includes(item.uuid)) {
                powersTemp.add(id);
            } else {
                powersTemp.delete(id);
            }
            const powers: number[] = Array.from(powersTemp);
            let menus: number[] = item.menu_powers.map((item) => item.menu_id);

            if (menus.length==0 && powers.length!=0) {
                menus.push(Number(treeSelect.id));
            }
            if (powers.length==0) {
                menus = [];
            }
            return {
                role_id: item.uuid,
                menus: menus,
                powers: powers,
            };
        });
        dispatch.sys.setPowersByRoleIds(params);
    };

    // 删除一条数据
    const onDel = async (record: TableRecordData) => {
        const params = { uuid: record.uuid };
        setLoading(true);
        const res = await dispatch.sys.delPower(params);
        if (res && res.code === 200) {
            getData(treeSelect.id);
            dispatch.app.updateUserInfo();
            message.success("删除成功");
        } else {
            message.error(res?.msg ?? "操作失败");
        }
    };

    // ==================
    // 属性 和 memo
    // ==================
    // 处理原始数据，将原始数据处理为层级关系
    const sourceData = useMemo(() => {
        const d: Menu[] = cloneDeep(userinfo.menus);
        d.forEach((item: Menu & { key: string }) => {
            item.key = String(item.uuid);
        });
        // 按照sort排序
        d.sort((a, b) => {
            return a.sorts - b.sorts;
        });
        return dataToJson(null, d) || [];
    }, [userinfo.menus, dataToJson]);

    // 构建表格字段
    const tableColumns = [
        {
            title: "序号",
            dataIndex: "serial",
            key: "serial",
        },
        {
            title: "编码",
            dataIndex: "uuid",
            key: "uuid",
        },
        {
            title: "权限名称",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "描述",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (v: number) =>
                v === 1 ? (
                    <span style={{ color: "green" }}>启用</span>
                ) : (
                    <span style={{ color: "red" }}>禁用</span>
                ),
        },
        {
            title: "操作",
            key: "control",
            width: 120,
            render: (v: number, record: TableRecordData) => {
                const controls = [];
                p.includes("power:query") &&
                controls.push(
                    <span
                        key="0"
                        className="control-btn green"
                        onClick={() => onModalShow(record, "see")}
                    >
                      <Tooltip placement="top" title="查看">
                        <EyeOutlined />
                      </Tooltip>
                    </span>
                );
                p.includes("power:update") &&
                controls.push(
                    <span
                        key="1"
                        className="control-btn blue"
                        onClick={() => onModalShow(record, "up")}
                    >
                      <Tooltip placement="top" title="修改">
                        <ToolOutlined />
                      </Tooltip>
                    </span>
                );
                p.includes("power:del") &&
                controls.push(
                    <Popconfirm
                        key="2"
                        title="确定删除吗?"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => onDel(record)}
                    >
                      <span className="control-btn red">
                        <Tooltip placement="top" title="删除">
                          <DeleteOutlined />
                        </Tooltip>
                      </span>
                    </Popconfirm>
                );
                const result: JSX.Element[] = [];
                controls.forEach((item, index) => {
                    if (index) {
                        result.push(<Divider key={`line${index}`} type="vertical" />);
                    }
                    result.push(item);
                });
                return result;
            },
        },
    ];

    // 构建表格数据
    const tableData = useMemo(() => {
        return data.map((item, index) => {
            return {
                key: index,
                uuid: item.uuid,
                menu_id: item.menu_id,
                title: item.title,
                code: item.code,
                description: item.description,
                sorts: item.sorts,
                status: item.status,
                serial: index + 1,
            };
        });
    }, [data]);

    // 新增或修改时 构建‘赋予’项数据
    const rolesCheckboxData = useMemo(() => {
        return roles.map((item) => ({
            label: item.title,
            value: item.uuid,
        }));
    }, [roles]);

    return (
        <div className="page-power-admin">
            <div className="l">
                <div className="title">目录结构</div>
                <div>
                    <Tree onSelect={onTreeSelect} treeData={sourceData}></Tree>
                </div>
            </div>

            <div className="r">
                <div className="searchBox">
                    <ul>
                        <li>
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() => onModalShow(null, "add")}
                                disabled={!(treeSelect.id && p.includes("power:add"))}
                            >
                                {`添加${treeSelect.title || ""}权限`}
                            </Button>
                        </li>
                    </ul>
                </div>
                <Table
                    className="diy-table"
                    columns={tableColumns}
                    loading={loading}
                    dataSource={tableData}
                    pagination={{
                        showQuickJumper: true,
                        showTotal: (total, range) => `共 ${total} 条数据`,
                    }}
                />
            </div>
            {/** 查看&新增&修改用户模态框 **/}
            <Modal
                title={`${
                    { add: "新增", up: "修改", see: "查看" }[modal.operateType]
                    }权限: ${treeSelect.title}->${modal.nowData?.title ?? ""}`}
                visible={modal.modalShow}
                onOk={onOk}
                onCancel={onClose}
                confirmLoading={modal.modalLoading}
            >
                <Form form={form} initialValues={{ formStatus: 1 }}>
                    <Form.Item
                        label="权限名"
                        name="formTitle"
                        {...formItemLayout}
                        rules={[
                            { required: true, whitespace: true, message: "必填" },
                            { max: 12, message: "最多输入12位字符" },
                        ]}
                    >
                        <Input
                            placeholder="请输入权限名"
                            disabled={modal.operateType === "see"}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Code"
                        name="formCode"
                        {...formItemLayout}
                        rules={[
                            { required: true, whitespace: true, message: "必填" },
                            { max: 12, message: "最多输入12位字符" },
                        ]}
                    >
                        <Input
                            placeholder="请输入权限Code"
                            disabled={modal.operateType === "see"}
                        />
                    </Form.Item>
                    <Form.Item
                        label="描述"
                        name="formDesc"
                        {...formItemLayout}
                        rules={[{ max: 100, message: "最多输入100位字符" }]}
                    >
                        <TextArea
                            rows={4}
                            disabled={modal.operateType === "see"}
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="排序"
                        name="formSorts"
                        {...formItemLayout}
                        rules={[{ required: true, message: "请输入排序号" }]}
                    >
                        <InputNumber
                            min={0}
                            max={99999}
                            style={{ width: "100%" }}
                            disabled={modal.operateType === "see"}
                        />
                    </Form.Item>
                    <Form.Item
                        label="状态"
                        name="formStatus"
                        {...formItemLayout}
                        rules={[{ required: true, message: "请选择状态" }]}
                    >
                        <Select disabled={modal.operateType === "see"}>
                            <Option key={1} value={1}>
                                启用
                            </Option>
                            <Option key={-1} value={-1}>
                                禁用
                            </Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="赋予" {...formItemLayout}>
                        <Checkbox.Group
                            disabled={modal.operateType === "see"}
                            options={rolesCheckboxData}
                            value={rolesCheckboxChose}
                            onChange={(v: CheckboxValueType[]) =>
                                setRolesCheckboxChose(v as number[])
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );

}

export default PowerAdminContainer;