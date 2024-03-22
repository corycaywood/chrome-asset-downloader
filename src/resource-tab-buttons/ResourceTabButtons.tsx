import React from 'react';
import TabButton from './TabButton'
import TabName from '../resource/ResourceName';

interface Props {
    names: TabName[],
    active: TabName,
    onClick: (name: TabName) => void
}

function ResourceTabButtons(props: Props) {
    return (
        <div className="row">
            <div className="col-xs-12">
                <ul className="nav nav-pills">
                    {props.names.map(name => <TabButton name={name} active={props.active === name} onClick={() => props.onClick(name)} />)}
                </ul>
            </div>
        </div>
    );
}
  
  
export default ResourceTabButtons;
