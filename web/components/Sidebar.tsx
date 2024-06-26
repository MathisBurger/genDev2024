'use client';
import {
    Avatar,
    Box, Divider,
    GlobalStyles,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    listItemButtonClasses,
    ListItemContent,
    Sheet, SvgIcon, Typography
} from "@mui/joy";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {useRouter} from "next/navigation";
import {closeSidebar} from "@/utils/sidebarUtils";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import {useCookies} from "react-cookie";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

/**
 * The sidebar
 *
 * @constructor
 */
const Sidebar = () => {

    const router = useRouter();
    const [cookies, _, removeCookie] = useCookies(['application_user']);

    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: { xs: 'fixed', md: 'sticky' },
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    md: 'none',
                },
                transition: 'transform 0.4s, width 0.4s',
                zIndex: 10000,
                height: '100dvh',
                width: 'var(--Sidebar-width)',
                top: 0,
                p: 2,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '220px',
                        [theme.breakpoints.up('lg')]: {
                            '--Sidebar-width': '240px',
                        },
                    },
                })}
            />
            <Box
                sx={{
                    minHeight: 0,
                    maxHeight: '80vh',
                    overflow: 'hidden auto',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 1.5,
                    },
                }}
            >
                <List
                    size="sm"
                    sx={{
                        gap: 1,
                        '--List-nestedInsetStart': '30px',
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                    }}
                >
                    <ListItem>
                        <ListItemButton onClick={() => router.push("/")}>
                            <DashboardIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Dashboard</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => router.push("/communities")}>
                            <PeopleIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Communities</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => router.push("/games")}>
                            <SportsSoccerIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Spiele</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => router.push("/bets")}>
                            <AttachMoneyIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Wetten</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => router.push("/leaderboard")}>
                            <LeaderboardIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Leaderboard</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography level="title-sm">{cookies.application_user}</Typography>
                </Box>
                <IconButton size="sm" variant="plain" color="neutral" onClick={() => removeCookie('application_user')}>
                    <LogoutRoundedIcon />
                </IconButton>
            </Box>
        </Sheet>
    );
}

export default Sidebar;