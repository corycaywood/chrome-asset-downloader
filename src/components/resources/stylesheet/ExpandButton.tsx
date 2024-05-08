import React from 'react';

interface Props {
    expanded: boolean;
    onClickExpand: () => void;
}

function StylesheetExpandButton(props: Props) {
    return (
        <span className={`expand ${props.expanded ? 'expanded' : ''}`} 
            onClick={props.onClickExpand}
        >
            <span>
                <i className="expand-icon">+</i>
                <i className="collapse-icon">-</i>
            </span>
        </span>
    );
}

export default StylesheetExpandButton;
