import React, { useEffect, useState } from 'react';

interface Props extends React.PropsWithChildren {
    visible: boolean,
    progress: number
}

function DownloadDialog(props: Props) {
    const [display, setDisplay] = useState<'none' | 'block'>('none');

    useEffect(() => {
        if (props.visible) {
            setDisplay('block');
        } else {
            setTimeout(() => setDisplay('none'), 150);
        }
    }, [props.visible])

    return (
        <div style={{display}}>
            <div
                className={`${props.visible ? 'in ' : ''}` + 'modal fade'} 
                style={{display: 'block'}}
            >
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

            <div  className={`${props.visible ? 'in ' : ''}` + 'modal-backdrop fade'}></div>
        </div>

    );
}

export default DownloadDialog;
