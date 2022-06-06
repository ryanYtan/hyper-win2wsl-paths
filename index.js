const isWindows = process.platform == 'win32';
const isWindowsPath = (p) => /[A-Za-z]:\\.*/.test(p);

exports.middleware = (store) => (next) => (action) => {
    switch (action.type) {
        case 'CONFIG_LOAD':
            // for configs later
            break;
        case 'SESSION_USER_DATA':
            const possiblePath = action.data;
            if (isWindows && isWindowsPath(possiblePath)) {
                const winPath = possiblePath;
                const newPath = winPath
                    .replaceAll("\\", "/")
                    .replace("C:", "/mnt/c")
                action.effect = () => {
                    rpc.emit('data', {
                        uid: store.getState().sessions.activeUid,
                        data: newPath,
                        escaped: true
                    });
                }
            }
    };
    next(action);
};
