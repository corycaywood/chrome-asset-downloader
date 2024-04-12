const KEY_DONT_ASK_PERMISSIONS = 'dont_ask_permissions';

const dontAskPermissions = () => JSON.parse(localStorage.getItem(KEY_DONT_ASK_PERMISSIONS) || 'false');
const setDontAskPermissions = (value: boolean) => localStorage.setItem(KEY_DONT_ASK_PERMISSIONS, value.toString());

const storage = {
    dontAskPermissions,
    setDontAskPermissions
}

export default storage;
