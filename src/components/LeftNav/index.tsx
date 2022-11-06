
import React, { useState, MutableRefObject, useRef } from "react";

import "./index.less";

interface Props {
    list:{path:string; name:string}[]
}

export default function LeftNavComponent(props: Props): JSX.Element {

    if (props.list.length>1) {
        return (
                <div>
                    <ul className="left-nav">
                        {props.list.map(item => {
                            return (
                                <li key={item.path}>{item.name}</li>
                            );
                        })}
                    </ul>
                </div>
        );
    } else {
        return (
            <></>
        );
    }
}