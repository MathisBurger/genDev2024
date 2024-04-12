'use client';
import useApiService from "@/hooks/useApiService";
import useSnackbar from "@/hooks/useSnackbar";
import {useRouter} from "next/navigation";
import {useCookies} from "react-cookie";
import {FormEvent} from "react";
import {maxLoginDuration} from "@/auth";
import {Box, Button, Card, CardContent, FormControl, FormLabel, Input, Link, Stack, Typography} from "@mui/joy";


const LoginPage = () => {

    const apiService = useApiService();
    const snackbar = useSnackbar();
    const router = useRouter();
    const [_, setCookie] = useCookies(['admin_pw']);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const password = data.get("password") as string;
        const resp = await apiService.adminLogin(password);
        if (resp) {
            snackbar.success("Login erfolgreich!");
            apiService.setPassword(password);
            setCookie('admin_pw', password, {path: '/', expires: new Date((new Date()).getTime() + maxLoginDuration)});
            router.push("/admin");
        } else {
            snackbar.error("Login fehlgeschlagen!");
        }
    }

    return (
        <Box sx={{width: '25vw', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <Card>
                <CardContent>
                    <Stack gap={4} sx={{ mb: 2 }}>
                        <Typography component="h1" level="h3">
                            Anmelden
                        </Typography>
                    </Stack>
                    <Stack gap={4} sx={{ mt: 2 }}>
                        <form onSubmit={onSubmit}>
                            <FormControl required>
                                <FormLabel>Passwort</FormLabel>
                                <Input type="password" name="password" required />
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