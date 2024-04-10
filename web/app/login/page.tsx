'use client';
import {Box, Button, FormControl, FormLabel, Stack, Typography, Input, Link, Card, CardContent} from "@mui/joy";


const LoginPage = () => {


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
                        <form>
                            <FormControl required>
                                <FormLabel>Nutzername</FormLabel>
                                <Input type="text" name="username" />
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