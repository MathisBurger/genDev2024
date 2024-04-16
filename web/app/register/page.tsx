'use client';
import {Box, Button, FormControl, FormLabel, Stack, Typography, Input, Link, Card, CardContent} from "@mui/joy";
import {useRouter} from "next/navigation";
import useApiService from "@/hooks/useApiService";
import useSnackbar from "@/hooks/useSnackbar";
import {FormEvent} from "react";


const RegisterPage = () => {

    const apiService = useApiService();
    const snackbar = useSnackbar();
    const router = useRouter();

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const username = data.get("username") as string;
        const resp = await apiService.register(username);
        if (resp) {
            snackbar.success("Registrierung erfolgreich!");
            router.push("/login");
        } else {
            snackbar.error("Dieser Benutzername is bereits vergeben!");
        }
    }


    return (
            <Box sx={{width: {xs: '70vw', lg: '25vw', md: '25vw'}, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <Card>
                    <CardContent>
                        <Stack gap={4} sx={{ mb: 2 }}>
                            <Stack gap={1}>
                                <Typography component="h1" level="h3">
                                    Registrieren
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack gap={4} sx={{ mt: 2 }}>
                            <form onSubmit={onSubmit}>
                                <FormControl required>
                                    <FormLabel>Nutzername</FormLabel>
                                    <Input type="text" name="username" required />
                                </FormControl>
                                <Stack gap={4} sx={{ mt: 2 }}>
                                    <Button type="submit" fullWidth>
                                        Registrieren
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>

    );
}

export default RegisterPage;