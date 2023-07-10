import React from "react";
const { Suspense } = React;
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "@/store";
import Router from "@/router";
import Loading from "@/components/Loading/index2";
import { LOADING_TIP } from "@/constants/index";
import "antd/dist/antd.less";
import "@/assets/styles/global.less";

const Root = () => (
	<Suspense fallback={<Loading height="100vh" tip={LOADING_TIP} />}>
		<Provider store={store}>
			<Router />
		</Provider>
	</Suspense>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<Root />);
