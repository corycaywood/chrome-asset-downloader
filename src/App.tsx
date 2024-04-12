import React, { useState, useEffect, ReactNode } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './css/style.css';

import ResourceName from './components/resources/resource/ResourceName';
import ResourceContainer from './components/resources/ResourceContainer';
import DownloadDialog from './components/dialogs/DownloadDialog';
import PermissionDeniedDialog from './components/dialogs/PermissionDeniedDialog';
import DownloadsFailedDialog from './components/dialogs/DownloadsFailedDialog';
import { Resource, Resources, emptyResources } from './components/resources/resource/Resource';
import download from './actions/download';
import subscribeResources from './actions/subscribe-resources';
import getPageTitle from './actions/get-page-title';
import downloadAll from './actions/download-all';
import { requestHostPermission, checkHostPermission } from './actions/permissions';
import storage from './actions/storage';
import zipFileName from './utils/zip-file-name';

const tabNames = [ResourceName.stylesheets, ResourceName.scripts, ResourceName.images, ResourceName.fonts];

function App() {
    const [active, setActive] = useState<ResourceName>(tabNames[0]);
    const [resources, setResources] = useState<Resources>(emptyResources);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [permissionDialogProps, setPermissionDialogProps] = useState<{onConfirm: () => void, onCancel: () => void} | null>();
    const [hasHostPermission, setHasHostPermission] = useState(false);
    const [dontAskPermissions, setDontAskPermissions] = useState(storage.dontAskPermissions());
    const [warningMessage, setWarningMessage] = useState<ReactNode | null>();
    const [failedDownloads, setFailedDownloads] = useState<string[] | null>()

    useEffect(() => {
        subscribeResources(resources => setResources(resources));

        checkHostPermission().then(hasPermission => {
            if (hasPermission != hasHostPermission) {
                setHasHostPermission(hasPermission);
            }
        });
    }, []);

    useEffect(() => {
        if (!hasHostPermission && storage.dontAskPermissions()) {
            const onClickGrant = async () => {
                const isGranted = await requestHostPermission();
                setHasHostPermission(isGranted);
            };

            setWarningMessage(
                <>
                    <p>
                        <strong>Warning:</strong> You have denied the "Host" permission to this plugin, so downloads of some files might fail. 
                        Click the button below to grant the permission.
                    </p>
                    <p><button className='btn btn-warning' onClick={onClickGrant}>Grant Permission</button></p>
                </>
            );
        } else {
            setWarningMessage(null);
        }
    }, [dontAskPermissions, hasHostPermission]);

    const onDownloadProgress = (progress: number) => setDownloadProgress(progress);

    const onDownloadAll = async (resources: Resource[]) => {
        const downloadResources = async () => {
            setIsDownloading(true);
            setDownloadProgress(0);
            const title = await getPageTitle();
            const response = await downloadAll(resources, zipFileName(title), onDownloadProgress);
            if (response.failed.length > 0 && !hasHostPermission) {
                setFailedDownloads(response.failed);
            }
            setIsDownloading(false);
        }

        if (storage.dontAskPermissions()) {
            downloadResources();
            return;
        }

        const isGranted = await requestHostPermission();
        setHasHostPermission(isGranted);
        if (!isGranted) {
            const onDismissDialog = () => {
                setPermissionDialogProps(null);
                setDontAskPermissions(storage.dontAskPermissions());
            };

            setPermissionDialogProps({
                onConfirm: () => {
                    onDismissDialog();
                    onDownloadAll(resources);
                },
                onCancel: () => {
                    onDismissDialog();
                    downloadResources();
                }
            })
            return;
        }

        downloadResources();
    }

    return (
        <div className="container app-wrap">
            <ResourceContainer 
                active={active} 
                tabNames={tabNames} 
                resources={resources}
                message={warningMessage}
                onChangeTab={(name: ResourceName) => setActive(name)} 
                onDownload={download}
                onDownloadAll={onDownloadAll}
                />
            
            <DownloadDialog visible={isDownloading} progress={downloadProgress} />

            <PermissionDeniedDialog 
                visible={permissionDialogProps != null}
                onClickCheckbox={(checked) => storage.setDontAskPermissions(checked)}
                onRequestPermission={() => permissionDialogProps && permissionDialogProps.onConfirm()}
                onCancel={() => permissionDialogProps && permissionDialogProps.onCancel()}
            />

            <DownloadsFailedDialog 
                visible={failedDownloads != null}
                failed={failedDownloads || []}
                onClickOkay={() => setFailedDownloads(null)}
            />
        </div>
    );
}

export default App;
