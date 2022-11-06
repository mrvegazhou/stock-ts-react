/** 通用动态面包屑 **/
import React, { useMemo } from "react";
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
import "./index.less";

import { Menu } from "@/models/index.type";

interface Props {
	pathname: string;
	menus: Menu[];
}

export default function BreadComFunc(props: Props): JSX.Element {
	let navigate = useNavigate();
	const breads = useMemo(() => {
		const paths: string = props.pathname;
		const breads: JSX.Element[] = [];
		let menus: Menu[] = props.menus;
		let parentId: number | null = null;
		do {
			const pathObj: Menu | undefined = menus.find((v) => v.uuid === parentId || v.url === paths);
			if (pathObj) {
				breads.push(
					<Breadcrumb.Item key={pathObj.uuid}>
						<a onClick={() => navigate(pathObj.url)}>{pathObj.title}</a>
					</Breadcrumb.Item>
				);
				parentId = pathObj.parent;
				menus = menus.filter((item: Menu) => item.url !== paths);
			} else {
				parentId = null;
			}
		} while (parentId);
		breads.reverse();
		return breads;
	}, [props.pathname, props.menus]);

	return (
		<div className="bread">
			<EnvironmentOutlined className="icon" />
			<Breadcrumb>{breads}</Breadcrumb>
		</div>
	);
}
