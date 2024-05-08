import React from 'react';

import Dialog from './Dialog';

interface Props extends React.PropsWithChildren {
    visible: boolean,
    progress: number
}

function DownloadDialog(props: Props) {
    return (
        <Dialog 
            visible={props.visible}
            title="Download files..."
        >
            <div className="progress" style={{marginTop: '15px'}}>
                <div className="progress-bar progress-bar-striped active" style={{width: `${props.progress}%`}}>
                    <span className="sr-only">{props.progress}% Complete</span>
                </div>
            </div>
        </Dialog>
    );
}

export default DownloadDialog;
