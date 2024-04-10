import ResponseCode from "@/service/ResponseCode";


class ApiService {

    /**
     * Performs login
     *
     * @param username The username
     */
    public async login(username: string): Promise<boolean> {
        const resp = await ApiService.post<never>("/api/user/login", {username});
        return resp === ResponseCode.OK;
    }

    /**
     * Registers a user
     *
     * @param username The username
     */
    public async register(username: string): Promise<boolean> {
        const resp = await ApiService.post<never>("/api/user/register", {username});
        return resp === ResponseCode.OK;
    }


    /**
     * GET method
     *
     * @param path Path that should be fetched
     * @param json If the response should be json
     * @private
     */
    private static async get<T>(path: string, json: boolean = true): Promise<T|ResponseCode> {
        const fullPath = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + path;
        const resp = await fetch(fullPath, {
            method: "GET"
        });
        if (!json) {
            return resp.status as ResponseCode;
        }
        return await resp.json() as T;
    }

    /**
     * POST method
     *
     * @param path The path that should be fetched
     * @param body The body of the request
     * @param json If the response is json
     * @private
     */
    private static async post<T>(path: string, body: any, json: boolean = true): Promise<T|ResponseCode> {
        const fullPath = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + path;
        const resp = await fetch(fullPath, {
            method: "POST",
            body: JSON.stringify(body)
        });
        if (!json) {
            return resp.status as ResponseCode;
        }
        return await resp.json() as T;
    }
}

export default ApiService;