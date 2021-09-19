/** APP入口 **/

// 如果需要兼容IE11，请把下面两句注释打开，会增加不少的代码体积
// import "core-js/stable";
// import "regenerator-runtime/runtime";

import React from "react";
const { Suspense } = React;

import ReactDOM from "react-dom";

import { Provider } from "react-redux";

import store from "./store";
import Router from "./router";
import Loading from './components/Loading/index2';
import { LOADING_TIP } from './constants/index';

/** 公共样式 **/
import "normalize.css";
import "@/assets/styles/default.less";
import "@/assets/styles/global.less";


const Root = () => (
    <Suspense fallback={<Loading height="100vh" tip={LOADING_TIP} />}>
        <Provider store={store}>
            <Router />
        </Provider>
    </Suspense>
);
ReactDOM.render(<Root />, document.getElementById("root"));

if (module.hot) {
    module.hot.accept();
}
