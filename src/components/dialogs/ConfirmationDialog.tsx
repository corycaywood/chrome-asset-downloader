import React from 'react';

import Dialog from './Dialog';

interface Props extends React.PropsWithChildren {
    visible: boolean;
    title: string;
    confirmText: string;
    cancelText: string;
    onClickConfirm: () => void;
    onClickCancel: () => void;
}

function ConfirmationDialog(props: Props) {
    const renderButtons = () => (
        <>
            <button 
                className="btn btn-default" 
                onClick={props.onClickCancel}
            >
                {props.cancelText}
            </button>
            <button 
                className="btn btn-primary" 
                onClick={props.onClickConfirm}
            >
                {props.confirmText}
            </button>
        </>
    )

    return (
        <Dialog 
            visible={props.visible}
            title={props.title}
            footer={renderButtons()}
        >
            {props.children}
        </Dialog>
    );
}

export default ConfirmationDialog;
