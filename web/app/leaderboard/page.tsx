'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {useEffect} from "react";


const LeaderboardPage = () => {

    const socket = new WebSocket("ws://localhost:8080/api/socket/leaderboard/user-2");
    socket.onopen = () => {
        console.log("opened socket");
    }
    socket.onmessage = (m) => {
        console.log(m.data);
    }


    return (
        <AuthorizedLayout>
            <h1>Leaderboard</h1>
        </AuthorizedLayout>
    )
}

export default LeaderboardPage;