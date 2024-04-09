import React from 'react';

import TabButton from './TabButton'
import ResourceName from '../resource/ResourceName';

interface Props {
    names: ResourceName[],
    active: ResourceName,
    onClick: (name: ResourceName) => void
}

function ResourceTabButtons(props: Props) {
    return (
        <ul className="nav nav-pills">
            {props.names.map(name => <TabButton key={name} name={name} active={props.active === name} onClick={() => props.onClick(name)} />)}
        </ul>
    );
}
  
  
export default ResourceTabButtons;
