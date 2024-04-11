'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Button, FormControl, FormLabel, Input, Stack} from "@mui/joy";
import useApiService from "@/hooks/useApiService";
import {FormEvent} from "react";
import {useRouter} from "next/navigation";
import useSnackbar from "@/hooks/useSnackbar";
import {ExtendedCommunity} from "@/typings/community";


const CreatePage = () => {

    const apiService = useApiService();
    const router = useRouter();
    const snackbar = useSnackbar();

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const resp = await apiService.createCommunity(data.get("name") as string);
        if (resp.status !== 200) {
            snackbar.error(resp.data as string);
        } else {
            router.push(`/communities/details?id=${(resp.data as ExtendedCommunity).id}`);
        }
    }

    return (
        <AuthorizedLayout>
            <h1>Community erstellen</h1>
            <form onSubmit={onSubmit}>
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel>Community name</FormLabel>
                        <Input type="text" name="name" />
                    </FormControl>
                    <Button type="submit" sx={{width: '200px'}}>Erstellen</Button>
                </Stack>
            </form>
        </AuthorizedLayout>
    )
}

export default CreatePage;