/* 主页 */

import React from "react";
// import { StickyContainer, Sticky } from "react-sticky";
import LeftNav from "@/components/LeftNav";
import Sticky from "@/components/Sticky";

// import Kline from "@/components/Kline/index";


export default function HomePageContainer(): JSX.Element {
    const navs: {path:string, name:string}[] = [{path:"xxx", name: "xxx"}, {path:"xxx2", name: "xxx2"}];
    return (
        <div style={{height: "8000px"}}>
            <Sticky top={'30%'}>
                <LeftNav list={navs} />
            </Sticky>
        </div>
    );
}
