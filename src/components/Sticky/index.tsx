import React, {useEffect, useState, useRef} from 'react'
import {Props, TableRecordData} from "@/pages/System/UserAdmin/index.type";

const hardwareAcceleration = {transform: 'translateZ(0)'}
const fixedTopStyle: React.CSSProperties = {
    position:'fixed',top:0,left: 0, zIndex: 100, width: '100%',
    ...hardwareAcceleration
}
interface IState {
    fixedTop: boolean
}
interface IProp {
    top: string;
    children: JSX.Element;
}

export default function Sticky(props: IProp): JSX.Element {
    const node = useRef<HTMLDivElement>(null);
    const [fixedTop, setFixedTop] = useState(false);

    const handler = ()=>{
        const scrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
        if(node && node.current){
            setFixedTop(scrollTop > node.current!.offsetTop);
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handler);
        return () => {
            window.removeEventListener("scroll", handler);
        };
    }, [handler]);


    return (
        <div ref={node} style={ fixedTop ? fixedTopStyle : {top: props.top, position: "absolute"}} >
            {props.children}
        </div>
    )
}
