import * as storage from './localStorage';

const loginData = {
    username: 'rjeans',
    password: 'rjeans',
    rememberCredentials: true
};

const loginResponseData = {
    "user":{
        "first_name":"ANITA",
        "middle_name":"L",
        "last_name":"KELLEY",
        "user_no":14932,
        "cert_name":"ANITA L KELLEY",
        "cert_entity":6,
        "email":"",
        "roles":["STUDENT"],
        "is_admin":false,
        "is_student":true
    },
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vZWdlbmVzaXMuaW8vIiwic3ViIjoxNDkzMiwic2NvcGUiOlsiU1RVREVOVCJdLCJpYXQiOjE1MjY3NDU4NDQsImV4cCI6MTUyNjc0OTQ0NH0.crqisdH61E2nMDQRuJjelLrk4O--nLNp7tihjz4vBuM",
};

describe('testing localStorage.js: save and clear', () => {

    test('saveAuthData should return true when passed loginResponseData', () => {
    
        expect(storage.saveAuthData(loginResponseData)).toBe(true);
    
    });
    test('saveCredentials should return true when passed loginData', () => {
    
        expect(storage.saveCredentials(loginData)).toBe(true);
    
    });
    test('clearAuthData should return true', () => {
    
        expect(storage.clearAuthData()).toBe(true);
    
    });
    test('clearSavedCredentials should return true', () => {
    
        expect(storage.clearSavedCredentials()).toBe(true);
    
    });

});

describe('testing localStorage.js: load', () => {

    beforeEach(() => {
        storage.saveAuthData(loginResponseData);
        storage.saveCredentials(loginData);
    });

    test('loadSavedCredentials should return something truthy', () => {
    
        expect(storage.loadSavedCredentials()).toBeTruthy();
    
    });
    test('loadAuthData should return something truthy', () => {
    
        expect(storage.loadAuthData()).toBeTruthy();
    
    });

    afterEach(() => {
        storage.clearAuthData();
        storage.clearSavedCredentials();
    });
    
});