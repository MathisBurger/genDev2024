export interface Community {
    id: number;
    name: string;
    memberCount: number;
}

export interface ExtendedCommunity {
    id: number;
    name: string;
    members: CommunityMember[];
}

export interface CommunityMember {
    id: number;
    username: string;
}