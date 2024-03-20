import React from 'react';
import TabName from './TabName';

interface Props {
    name: TabName, 
    active: boolean, 
    onClick: () => void
}

function TabButton(props: Props) {
    return (
        <li role="presentation" onClick={() => props.onClick()}>
            <a className={props.active ? "active" : ""} href="#">{props.name}</a>
        </li>
    );
  }
  
  export default TabButton;
  


