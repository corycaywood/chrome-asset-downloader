import React, { ReactNode, useEffect, useState } from 'react';

interface Props extends React.PropsWithChildren {
    visible: boolean;
    title?: ReactNode;
    footer?: ReactNode;
}

const ANIMATION_DURATION_MS = 150

function Dialog(props: Props) {
    const [display, setDisplay] = useState<'none' | 'block'>('none');

    useEffect(() => {
        if (props.visible) {
            setDisplay('block');
        } else {
            setTimeout(() => setDisplay('none'), ANIMATION_DURATION_MS);
        }
    }, [props.visible])

    return (
        <div 
            className={`fade ${props.visible ? 'in' : 'out'}`}
            style={{
                display,
                transition: `opacity ${ANIMATION_DURATION_MS}ms linear`
            }}
        >
            <div className={'modal fade in'}>
                <div className="modal-dialog" role="document"> 
                    <div className="modal-content"> 
                        {props.title && (
                            <div className="modal-header">
                                <h4 className="modal-title">{props.title}</h4>
                            </div> 
                        )}
                        <div className="modal-body">{props.children}</div>
                        {props.footer && (
                            <div className="modal-footer">{props.footer}</div>
                        )}
                    </div>
                </div> 
            </div>

            <div  className={'modal-backdrop fade in'}></div>
        </div>

    );
}

export default Dialog;
