import { BaseApi } from "../../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../../shared/infrastructure/base-endpoints.js";

const signInEndpointPath = import.meta.env.VITE_RUTANA_SIGN_IN_ENDPOINT_PATH;
const signUpEndpointPath = import.meta.env.VITE_RUTANA_SIGN_UP_ENDPOINT_PATH;
const userEndpointPath = import.meta.env.VITE_RUTANA_USER_ENDPOINT_PATH;

export class IamApi extends BaseApi {
    #signInEndpointPath;
    #signUpEndpointPath;
    #userEndpointPath;
    constructor() {
        super();
        this.#signInEndpointPath = new BaseEndpoint(this, signInEndpointPath);
        this.#signUpEndpointPath = new BaseEndpoint(this, signUpEndpointPath);
        this.#userEndpointPath = new BaseEndpoint(this, userEndpointPath);
    }

    signIn(signInRequest) {
        return this.#signInEndpointPath.create(signInRequest);
    }
    signUp(signUpRequest) {
        return this.#signUpEndpointPath.create(signUpRequest);
    }
    getUsers() {
        return this.#userEndpointPath.getAll();
    }
}