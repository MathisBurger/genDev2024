import {Box, Button, Grid} from "@mui/joy";
import Sidebar from "@/components/Sidebar";
import {ReactNode} from "react";
import {openSidebar, toggleSidebar} from "@/utils/sidebarUtils";
import MenuIcon from '@mui/icons-material/Menu';

interface AuthorizedLayoutProps {
    children: ReactNode;
}

const AuthorizedLayout = ({children}: AuthorizedLayoutProps) => {

    return (
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
            <Sidebar />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    px: { xs: 2, md: 6 },
                    pt: {
                        xs: 'calc(12px + var(--Header-height))',
                        sm: 'calc(12px + var(--Header-height))',
                        md: 3,
                    },
                    pb: { xs: 2, sm: 2, md: 3 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    height: '100dvh',
                    gap: 1,
                }}
            >
                <Grid container direction="row" justifyContent="flex-end">
                    <Grid lg={0} md={0} xs={2}>
                        <Button onClick={() => toggleSidebar()} color="neutral" variant="outlined" sx={{
                            display: {
                                xs: 'block',
                                md: 'none',
                                lg: 'none'
                            }
                        }}>
                            <MenuIcon />
                        </Button>
                    </Grid>
                </Grid>
                {children}
            </Box>
        </Box>
    );
}

export default AuthorizedLayout;