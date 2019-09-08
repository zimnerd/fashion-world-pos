import { RETRIEVE_DETAILS } from "../constants/user.constants";

export function retrieveDetails(user) {
    return { type: RETRIEVE_DETAILS, user };
}
