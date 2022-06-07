const isWindowsPath = (path) => {
    const winPathRegex = /[A-Za-z]:\\.*/;
    return winPathRegex.test(path);
}

const toWslPath = (windowsPath) => {
    const path = windowsPath;
    const drive = path[0];
    let newPath = `/mnt/${drive.toLowerCase()}/${path.slice(3)}`;
    newPath = newPath.replace(/\\/g, "/");
    newPath = newPath.replace(/\\\\/g, "/");
    return newPath;
}

exports.middleware = (store) => (next) => (action) => {
    if (process.platform != 'win32') {
        next(action);
        return;
    }

    switch (action.type) {
        case "SESSION_USER_DATA":
            const possiblePath = action.data;
            if (isWindowsPath(possiblePath)) {
                const path = possiblePath;
                const newPath = toWslPath(path);

                action.effect = () => {
                    rpc.emit('data', {
                        uid: store.getState().sessions.activeUid,
                        data: newPath,
                        escaped: true
                    });
                }
            }
            break;

        case "CONFIG":
            break;
    }

    next(action);
};
