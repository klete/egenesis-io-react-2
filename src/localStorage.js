export const saveAuthData = (authData) => {
    try {
        let savableState = {
            token: authData.token,
            user: authData.user
        };

        if (authData.user.is_student) {
            savableState.student = authData.user
        }

        localStorage.setItem('auth', JSON.stringify(savableState));
    } catch (error) {

    }
};
export const saveCredentials = (credentials) => {
    try {
        if (credentials.rememberCredentials) {
            localStorage.setItem('credentials', JSON.stringify({
                savedUsername: credentials.savedUsername
            }));
        } else {
            localStorage.removeItem('credentials');
        }
    } catch (error) {

    }
};

export const clearAuthData = () => {
    clear('auth');
};
export const clearSavedCredentials = () => {
    clear('credentials');
};
export const loadAuthData = () => {
    return load('auth');
};
export const loadSavedCredentials = () => {
    return load('credentials');
};


const load = (item) => {
    try {
        const serializedState = localStorage.getItem(item);

        if (serializedState === null) {
            return undefined;
        }
        
        return JSON.parse(serializedState);
    } catch (error) {
        return undefined;
    }
};

const clear = (item) => {
    try {
        localStorage.removeItem(item);
    } catch (error) {
        return undefined;
    }
};