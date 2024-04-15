import ResponseCode from "@/service/ResponseCode";
import {Community, CommunityMember, ExtendedCommunity} from "@/typings/community";
import {PersonalBet} from "@/typings/bet";
import {MinifiedGame} from "@/typings/game";

export interface ApiResponse<T> {
    status: ResponseCode;
    data: T|string;
}


class ApiService {

    private username: string|null;
    private password: string|null;

    constructor(username?: string|null, password?: string|null) {
        this.username = username ?? null;
        this.password = password ?? null;
    }

    /**
     * Sets the username
     *
     * @param username The username
     */
    public setUsername(username: string) {
        this.username = username;
    }

    /**
     * Sets the password
     *
     * @param password The password
     */
    public setPassword(password: string) {
        this.password = password;
    }

    public isLoggedIn(): boolean {
        return this.username !== null;
    }

    public isLoggedInAdmin(): boolean {
        return this.password !== null;
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
     * @param search The search query
     */
    public async getAllCommunities(pageSize: number, pageNr: number, search?: string): Promise<ApiResponse<Community[]>> {
        return await ApiService.get<Community[]>(`/api/communities?pageNr=${pageNr}&pageSize=${pageSize}${search ? `&search=${search}` : ""}`) as ApiResponse<Community[]>;
    }

    /**
     * Gets the amount of communities
     */
    public async getCommunityCount(search?: string): Promise<number> {
        return parseInt(`${(await ApiService.get<number>(`/api/communities/count${search ? `?search=${search}` : ""}`)).data as string}`, 10);
    }

    /**
     * Joins a community
     *
     * @param id The ID of the community
     */
    public async joinCommunity(id: number): Promise<ApiResponse<ExtendedCommunity>> {
        return await ApiService.post<ExtendedCommunity>("/api/communities/join", {username: this.username, communityId: id});
    }

    /**
     * Gets a specific community by ID
     *
     * @param id The ID of the community
     */
    public async getCommunity(id: number): Promise<ApiResponse<ExtendedCommunity>> {
        return await ApiService.get<ExtendedCommunity>(`/api/communities/${id}`);
    }

    /**
     * Gets all personal communities
     */
    public async getPersonalCommunities(): Promise<ApiResponse<Community[]>> {
        return await ApiService.get<Community[]>(`/api/communities/personal?username=${this.username}`);
    }

    /**
     * Gets all personal bets
     */
    public async getPersonalBets(): Promise<ApiResponse<PersonalBet[]>> {
        return await ApiService.get<PersonalBet[]>(`/api/bets/personal?username=${this.username}`);
    }

    /**
     * Places a bet
     *
     * @param gameId The ID of the game
     * @param homeGoals The number of home goals
     * @param awayGoals The number of away goals
     */
    public async placeBet(gameId: number, homeGoals: number, awayGoals: number): Promise<ApiResponse<string>> {
        return await ApiService.post<string>("/api/bets/place", {username: this.username, gameId, homeGoals, awayGoals});
    }

    public async getAllGames(): Promise<ApiResponse<MinifiedGame[]>> {
        return await ApiService.get<MinifiedGame[]>("/api/games");
    }

    /**
     * Logs in the user into the admin UI
     *
     * @param password The admin PW
     */
    public async adminLogin(password: string): Promise<ApiResponse<never>> {
        return await ApiService.post<never>("/api/admin/login", {password});
    }

    /**
     * Updates a game in the admin UI
     *
     * @param gameId The id of the game
     * @param goalsHome All home goals
     * @param goalsAway All away goals
     */
    public async updateGame(gameId: number, goalsHome: number, goalsAway: number): Promise<ApiResponse<string>> {
        return await ApiService.post<string>("/api/admin/updateGame", {password: this.password, gameId, goalsHome, goalsAway});
    }

    /**
     * Gets all pinned users
     *
     * @param communityId The ID of the community
     */
    public async getPinnedUsers(communityId: number): Promise<ApiResponse<CommunityMember[]>> {
        return await ApiService.get<CommunityMember[]>(`/api/pinned?communityId=${communityId}&username=${this.username}`);
    }

    /**
     * Pins a user
     *
     * @param communityId The ID of the community
     * @param userToPin The username of the user to pin
     */
    public async pinUser(communityId: number, userToPin: string): Promise<ApiResponse<CommunityMember[]>> {
        return await ApiService.post<CommunityMember[]>("/api/pinned/pin", {communityId, userToPin, username: this.username});
    }

    /**
     * Unpins a user
     *
     * @param communityId The ID of the community
     * @param userToPin The username of the user to pin
     */
    public async unpinUser(communityId: number, userToPin: string): Promise<ApiResponse<CommunityMember[]>> {
        return await ApiService.post<CommunityMember[]>("/api/pinned/unpin", {communityId, userToPin, username: this.username});
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