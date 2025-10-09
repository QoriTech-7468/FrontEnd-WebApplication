import axios from "axios";


const RutanaApi = import.meta.env.VITE_RUTANA_API_URL;

export class BaseApi {

    /**
     * @type {import("axios").AxiosInstance}
     */
    #http;
    constructor(resource) {
        this.#http = axios.create({ baseURL: RutanaApi });
    }



    get http() {
        return this.#http;
    }
}