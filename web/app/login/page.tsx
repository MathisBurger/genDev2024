'use client';
import {Box, Button, FormControl, FormLabel, Stack, Typography, Input, Link, Card, CardContent} from "@mui/joy";
import useApiService from "@/hooks/useApiService";
import useSnackbar from "@/hooks/useSnackbar";
import {useRouter} from "next/navigation";
import {FormEvent} from "react";
import {useCookies} from "react-cookie";
import {maxLoginDuration} from "@/auth";


const LoginPage = () => {

    const apiService = useApiService();
    const snackbar = useSnackbar();
    const router = useRouter();
    const [_, setCookie] = useCookies(['application_user']);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const username = data.get("username") as string;
        const resp = await apiService.login(username);
        if (resp) {
            snackbar.success("Login erfolgreich!");
            apiService.setUsername(username);
            setCookie('application_user', username, {path: '/', expires: new Date((new Date()).getTime() + maxLoginDuration)});
            router.push("/");
        } else {
            snackbar.error("Login fehlgeschlagen!");
        }
    }


    return (
        <Box sx={{width: '25vw', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <Card>
                <CardContent>
                    <Stack gap={4} sx={{ mb: 2 }}>
                        <Stack gap={1}>
                            <Typography component="h1" level="h3">
                                Anmelden
                            </Typography>
                            <Typography level="body-sm">
                                Neu hier?{' '}
                                <Link href="/register" level="title-sm">
                                    Registrieren
                                </Link>
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
                                    Anmelden
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </CardContent>
            </Card>
        </Box>

    );
}

export default LoginPage;