import React from 'react';
import TabButton from './TabButton'
import TabName from './TabName';

interface Props {
    names: TabName[],
    activeName: string,
    onClick: (name: TabName) => void
}

function ResourceTabButtons(props: Props) {
    return (
    <div className="row">
        <div className="col-xs-12">
            <ul className="nav nav-pills nav-fill">
                {props.names.map(name => <TabButton name={name} active={props.activeName === name} onClick={() => props.onClick(name)} />)}
            </ul>
        </div>
    </div>
    );
  }
  
  
  export default ResourceTabButtons;
  


