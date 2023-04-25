/* 401 没有权限 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import Img from "@/assets/error.gif";

import "./index.less";

export default function NoPowerContainer(): JSX.Element {
	const navigate = useNavigate();
	const gotoHome = (): void => {
		navigate("/admin/sys/home");
	};

	return (
		<div className="page-error">
			<div>
				<div className="title">401</div>
				<div className="info">你没有访问该页面的权限</div>
				<div className="info">请联系你的管理员</div>
				<Button className="backBtn" type="primary" ghost onClick={gotoHome}>
					返回首页
				</Button>
			</div>
			<img src={Img + `?${Date.now()}`} />
		</div>
	);
}
