import React from 'react';
import TabName from '../resource/ResourceName';

interface Props {
    name: TabName, 
    active: boolean, 
    onClick: () => void
}

function TabButton(props: Props) {
    return (
        <li role="presentation" className={props.active ? "active" : ""} onClick={() => props.onClick()}>
            <a>{props.name}</a>
        </li>
    );
}
  
export default TabButton;
