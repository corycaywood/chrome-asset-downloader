import React from 'react';

import ConfirmationDialog from './ConfirmationDialog';

interface Props extends React.PropsWithChildren {
    visible: boolean;
    onRequestPermission: () => void;
    onCancel: () => void;
}

function PermissionDeniedDialog(props: Props) {
    return (
        <ConfirmationDialog 
            visible={props.visible}
            title="Permission was denied"
            confirmText={"Grant permission"}
            cancelText={"Continue without permission"}
            onClickConfirm={props.onRequestPermission}
            onClickCancel={props.onCancel}
        >
            <p>This extension requires the "Host" permission to download some files. 
                You can still continue to if you do not grant this permisison, however some of the files might fail to download.</p>
            <p>Would you like to grant the permission?</p>
        </ConfirmationDialog>
    );
}

export default PermissionDeniedDialog;
