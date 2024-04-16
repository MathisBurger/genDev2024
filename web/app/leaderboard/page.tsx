'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {useEffect, useState} from "react";
import LeaderboardComponent, {LeaderboardElement} from "@/components/LeaderboardComponent";
import {element} from "prop-types";
import {useCookies} from "react-cookie";


const LeaderboardPage = () => {

    const [leaderboardElements, setElements] = useState<LeaderboardElement[]>([]);
    const [maxElementCount, setMaxElementCount] = useState<number>(0);
    const [cookies] = useCookies(['application_user']);
    const [socket, setSocket] = useState<WebSocket|null>(null);

    useEffect(() => {
        const socket = new WebSocket(`ws://${process.env.NODE_ENV === "development" ? "localhost:8080" : location.host}/api/socket/leaderboard/${cookies.application_user}`);
        socket.onopen = () => {
            console.log("opened socket");
        }
        socket.onmessage = (m) => {
            const data = JSON.parse(m.data);
            setElements(data.data);
            setMaxElementCount(data.count);
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
                maxCount={maxElementCount}
            />
        </AuthorizedLayout>
    )
}

export default LeaderboardPage;