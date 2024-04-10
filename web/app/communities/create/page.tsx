'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Button, FormControl, FormLabel, Input, Stack} from "@mui/joy";
import useApiService from "@/hooks/useApiService";


const CreatePage = () => {

    const apiService = useApiService();

    return (
        <AuthorizedLayout>
            <h1>Community erstellen</h1>
            <form>
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