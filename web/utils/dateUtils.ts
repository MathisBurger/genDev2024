import {LeaderboardElement} from "@/components/LeaderboardComponent";

export const leaderboardSortByCreation = (elements: LeaderboardElement[]) => {
    let placementArrays: Map<number, LeaderboardElement[]> = new Map();
    for (let element of elements) {
        if (placementArrays.has(element.placement)) {
            placementArrays.set(element.placement, placementArrays.get(element.placement)!.concat(element));
        } else {
            placementArrays.set(element.placement, [element]);
        }
    }
    let sorted: LeaderboardElement[] = [];
    for (let key of placementArrays.keys()) {
        let samePlacementArray = placementArrays.get(key)!;
        sorted.push(...samePlacementArray.sort((a, b) => new Date(a.user!.createdAt).getTime() < new Date(b.user!.createdAt).getTime() ? -1 : 1))
    }
    return sorted;
}