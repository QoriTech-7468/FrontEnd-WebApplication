import axios from "axios";
import { iamInterceptor } from "../../iam/infrastructure/iam.interceptor.js";

const RutanaApi = import.meta.env.VITE_RUTANA_API_URL;

export class BaseApi {

    /**
     * @type {import("axios").AxiosInstance}
     */
    #http;
    constructor(resource) {
        this.#http = axios.create({ 
            baseURL: RutanaApi,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.#http.interceptors.request.use(iamInterceptor);
    }



    get http() {
        return this.#http;
    }
}