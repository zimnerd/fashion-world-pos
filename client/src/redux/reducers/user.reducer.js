import { RETRIEVE_DETAILS } from "../constants/user.constants";

export default function userReducer(state = { }, action) {
    switch (action.type) {
        case RETRIEVE_DETAILS:
            return { ...state, ...action.user };
        default:
            return state;
    }
}
