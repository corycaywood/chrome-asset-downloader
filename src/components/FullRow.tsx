import React, { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    className?: string;
}

const FullRow = (props: Props) => (
    <div className={`row ${props.className ? props.className : ''}`}>
        <div className="col-xs-12">
            {props.children}
        </div>
    </div>
)

export default FullRow;
