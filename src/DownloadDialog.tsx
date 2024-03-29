import React, { useEffect, useState } from 'react';

interface Props extends React.PropsWithChildren {
    visible: boolean,
    progress: number
}

const ANIMATION_DURATION_MS = 150

function DownloadDialog(props: Props) {
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
                        <div className="modal-header">
                            <h4 className="modal-title">Downloading files...</h4>
                        </div> 
                        <div className="modal-body">
                            <div className="progress" style={{marginTop: '15px'}}>
                                <div className="progress-bar progress-bar-striped active" style={{width: `${props.progress}%`}}>
                                    <span className="sr-only">{props.progress}% Complete</span>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div> 
            </div>

            <div  className={'modal-backdrop fade in'}></div>
        </div>

    );
}

export default DownloadDialog;
