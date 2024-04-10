import {Box} from "@mui/joy";
import Sidebar from "@/components/Sidebar";
import {ReactNode} from "react";

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
                {children}
            </Box>
        </Box>
    );
}

export default AuthorizedLayout;