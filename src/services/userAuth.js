import axios from "axios";
import { BASE_URL } from "../utils/constants";

const USER_AUTH_ROUTE = BASE_URL + "/users/api/v1"

const api = axios.create({
    baseURL: USER_AUTH_ROUTE, 
    headers: {
        "Content-Type": "application/json"
    }
});

