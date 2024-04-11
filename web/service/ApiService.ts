import ResponseCode from "@/service/ResponseCode";
import {Community, ExtendedCommunity} from "@/typings/community";

export interface ApiResponse<T> {
    status: ResponseCode;
    data: T|string;
}


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
        const resp = await ApiService.post<never>("/api/user/login", {username});
        return resp.status === ResponseCode.OK;
    }

    /**
     * Registers a user
     *
     * @param username The username
     */
    public async register(username: string): Promise<boolean> {
        const resp = await ApiService.post<never>("/api/user/register", {username});
        return resp.status === ResponseCode.OK;
    }

    /**
     * Creates a new community
     *
     * @param name The name of the community
     */
    public async createCommunity(name: string): Promise<ApiResponse<ExtendedCommunity>> {
        const resp = await ApiService.post<ExtendedCommunity>("/api/communities/create", {username: this.username, communityName: name});
        return resp as ApiResponse<ExtendedCommunity>;
    }

    /**
     * Gets all communities
     *
     * @param pageSize The size of the page
     * @param pageNr The number of the page
     */
    public async getAllCommunities(pageSize: number, pageNr: number): Promise<ApiResponse<Community[]>> {
        return await ApiService.get<Community[]>(`/api/communities?pageNr=${pageNr}&pageSize=${pageSize}`) as ApiResponse<Community[]>;
    }

    /**
     * Gets the amount of communities
     */
    public async getCommunityCount(): Promise<number> {
        return parseInt(`${(await ApiService.get<number>("/api/communities/count")).data as string}`, 10);
    }

    /**
     * Joins a community
     *
     * @param id The ID of the community
     */
    public async joinCommunity(id: number): Promise<ApiResponse<ExtendedCommunity>> {
        return await ApiService.post<ExtendedCommunity>("/api/communities/join", {username: this.username, communityId: id}) as ApiResponse<ExtendedCommunity>;
    }

    /**
     * Gets a specific community by ID
     *
     * @param id The ID of the community
     */
    public async getCommunity(id: number): Promise<ApiResponse<ExtendedCommunity>> {
        return await ApiService.get<ExtendedCommunity>(`/api/communities/${id}`) as ApiResponse<ExtendedCommunity>;
    }


    /**
     * GET method
     *
     * @param path Path that should be fetched
     * @private
     */
    private static async get<T>(path: string): Promise<ApiResponse<T>> {
            const fullPath = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + path;
            const resp = await fetch(fullPath, {
                method: "GET"
            });
            const text = await resp.text();
            try {
                return {status: resp.status, data: JSON.parse(text) as T};
            } catch (_) {
                return {status: resp.status, data: text};
            }
    }

    /**
     * POST method
     *
     * @param path The path that should be fetched
     * @param body The body of the request
     * @private
     */
    private static async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
        const fullPath = (process.env.NODE_ENV === "development" ? "http://localhost:8080" : "") + path;
        const resp = await fetch(fullPath, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const text = await resp.text();
        try {
            return {status: resp.status, data: JSON.parse(text) as T};
        } catch (_) {
            return {status: resp.status, data: text};
        }
    }
}

export default ApiService;