import ResponseCode from "@/service/ResponseCode";
import {Community, ExtendedCommunity} from "@/typings/community";


class ApiService {

    private username: string|null;

    constructor(username?: string|null) {
        this.username = username ?? null;
    }

    /**
     * Sets the username
     *
     * @param username The username
     */
    public setUsername(username: string) {
        this.username = username;
    }

    public isLoggedIn(): boolean {
        return this.username !== null;
    }

    /**
     * Performs login
     *
     * @param username The username
     */
    public async login(username: string): Promise<boolean> {
        const resp = await ApiService.post<never>("/api/user/login", {username}, false);
        return resp === ResponseCode.OK;
    }

    /**
     * Registers a user
     *
     * @param username The username
     */
    public async register(username: string): Promise<boolean> {
        const resp = await ApiService.post<never>("/api/user/register", {username}, false);
        return resp === ResponseCode.OK;
    }

    /**
     * Creates a new community
     *
     * @param name The name of the community
     */
    public async createCommunity(name: string): Promise<ExtendedCommunity> {
        const resp = await ApiService.post<ExtendedCommunity>("/api/communities/create", {username: this.username, communityName: name});
        return resp as ExtendedCommunity;
    }

    /**
     * Gets all communities
     *
     * @param pageSize The size of the page
     * @param pageNr The number of the page
     */
    public async getAllCommunities(pageSize: number, pageNr: number): Promise<Community[]> {
        return await ApiService.get<Community[]>(`/api/communities?pageNr=${pageNr}&pageSize=${pageSize}`) as Community[];
    }

    /**
     * Gets the amount of communities
     */
    public async getCommunityCount(): Promise<number> {
        return parseInt(`${await ApiService.get<number>("/api/communities/count", false, true) as string}`, 10);
    }

    /**
     * Joins a community
     *
     * @param id The ID of the community
     */
    public async joinCommunity(id: number): Promise<ExtendedCommunity> {
        return await ApiService.post<ExtendedCommunity>("/api/communities/join", {username: this.username, communityId: id}) as ExtendedCommunity;
    }


    /**
     * GET method
     *
     * @param path Path that should be fetched
     * @param json If the response should be json
     * @param text If text should be returned
     * @private
     */
    private static async get<T>(path: string, json: boolean = true, text: boolean = false): Promise<T|ResponseCode|string> {
        const fullPath = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + path;
        const resp = await fetch(fullPath, {
            method: "GET"
        });
        if (!json && !text) {
            return resp.status as ResponseCode;
        }
        if (text && !json) {
            return await resp.text() as string
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
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!json) {
            return resp.status as ResponseCode;
        }
        return await resp.json() as T;
    }
}

export default ApiService;