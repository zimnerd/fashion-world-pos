import {
    ERROR_RESET,
    LOGIN_USER,
    LOGOUT_USER,
    RETRIEVE_ROLES,
    SET_AUTH,
    VALIDATION_ERROR
} from "../constants/auth.contants";

export default function authReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, token: action.token };
        case LOGOUT_USER:
            return { ...state, ...action.token };
        case VALIDATION_ERROR:
            return { ...state, errors: action.errors };
        case ERROR_RESET:
            return { ...state, errors: action.errors };
        case RETRIEVE_ROLES:
            return { ...state, roles: action.roles };
        case SET_AUTH:
            return { ...state, auth: action.auth };
        default:
            return state;
    }
}
