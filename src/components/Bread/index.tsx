/** 通用动态面包屑 **/
import React, { useMemo } from "react";
import { Breadcrumb } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import "./index.less";

import { Menu } from "@/models/index.type";


interface Props {
    location: Location;
    menus: Menu[];
}

export default function BreadCom(props: Props): JSX.Element {

    const breads = useMemo(() => {
        const paths: string = props.location.pathname;
        const breads: JSX.Element[] = [];
        let parentId: number | null = null;
        do {
            const pathObj: Menu | undefined = props.menus.find(
                (v) => v.uuid === parentId || v.url === paths
            );

            if (pathObj) {
                breads.push(
                    <Breadcrumb.Item key={pathObj.uuid}>{pathObj.title}</Breadcrumb.Item>
                );
                parentId = pathObj.parent;
            } else {
                parentId = null;
            }
        } while (parentId);
        breads.reverse();
        return breads;

    }, [props.location.pathname, props.menus]);

    return (
        <div className="bread">
            <EnvironmentOutlined className="icon" />
            <Breadcrumb>{breads}</Breadcrumb>
        </div>
    );

}