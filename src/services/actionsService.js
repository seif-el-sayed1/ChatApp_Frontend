import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ACTIONS_ROUTE = BASE_URL + "/actions";

const api = axios.create({
    baseURL: ACTIONS_ROUTE,
    headers: { "Content-Type": "application/json" }
});
