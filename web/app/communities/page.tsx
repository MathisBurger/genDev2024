'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Button, ButtonGroup} from "@mui/joy";
import {useRouter} from "next/navigation";


const CommunitiesPage = () => {

    const router = useRouter();

    return (
        <AuthorizedLayout>
            <h1>Communities</h1>
            <ButtonGroup>
                <Button color="primary">Suchen</Button>
                <Button color="primary" onClick={() => router.push("/communities/create")}>Erstellen</Button>
            </ButtonGroup>
        </AuthorizedLayout>
    );
}

export default CommunitiesPage;