import React from 'react';

import ConfirmationDialog from './ConfirmationDialog';

interface Props extends React.PropsWithChildren {
    visible: boolean;
    failed: string[];
    onClickOkay: () => void;
}

function DownloadsFailedDialog(props: Props) {
    return (
        <ConfirmationDialog 
            visible={props.visible}
            title={`Download failed for ${props.failed.length} files`}
            confirmText={"Okay"}
            onClickConfirm={props.onClickOkay}
        >
            <p>Your ZIP file was downloaded, but <strong>{props.failed.length} files failed to download</strong> because you haven't granted the "Host" permission for this extension.</p>
        </ConfirmationDialog>
    );
}

export default DownloadsFailedDialog;
