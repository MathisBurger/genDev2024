'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {useEffect, useState} from "react";
import LeaderboardComponent, {LeaderboardElement} from "@/components/LeaderboardComponent";
import {element} from "prop-types";
import {useCookies} from "react-cookie";


const LeaderboardPage = () => {

    const [leaderboardElements, setElements] = useState<LeaderboardElement[]>([]);
    const [cookies] = useCookies(['application_user']);
    const [socket, setSocket] = useState<WebSocket|null>(null);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8080/api/socket/leaderboard/${cookies.application_user}`);
        socket.onopen = () => {
            console.log("opened socket");
        }
        socket.onmessage = (m) => {
            setElements(JSON.parse(m.data));
        }
        setSocket(socket);
    }, []);

    const onPageChange = (top: number, bottom: number) => {
        if (socket !== null) {
            socket.send(`${top},${bottom}`);
        }
    }


    return (
        <AuthorizedLayout>
            <h1>Leaderboard</h1>
            <LeaderboardComponent
                elements={leaderboardElements}
                topPageIncrease={() => onPageChange(1, 0)}
                bottomPageIncrease={() => onPageChange(0, -1)}
            />
        </AuthorizedLayout>
    )
}

export default LeaderboardPage;