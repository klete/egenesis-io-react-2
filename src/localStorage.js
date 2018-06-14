export const saveAuthData = ({ token, user }) => {
    try {
        let savableState = {
            token: token,
            user: user,
            student: user.is_student ? user : null
        };        

        const payload = JSON.stringify(savableState);
        localStorage.setItem('auth', payload);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
export const saveCredentials = ({ savedUsername, rememberCredentials }) => {
    try {
        if (rememberCredentials) {
            const payload = JSON.stringify({ savedUsername: savedUsername });
            localStorage.setItem('credentials', payload);
        } else {
            localStorage.removeItem('credentials');
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const clearAuthData = () => clear('auth');
export const clearSavedCredentials = () => clear('credentials');
export const loadAuthData = () => load('auth');
export const loadSavedCredentials = () => load('credentials');

const load = (item) => {
    try {
        const serializedState = localStorage.getItem(item);
        return serializedState === undefined ? null : JSON.parse(serializedState);        
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

const clear = (item) => {
    try {
        localStorage.removeItem(item);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

/*
localStorage["foo"]
undefined

localStorage.getItem("foo")
null
*/