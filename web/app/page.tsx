'use client';

import Sidebar from "@/components/Sidebar";
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Grid} from "@mui/joy";
import CurrentGamesCard from "@/components/dashboard/CurrentGamesCard";
import DashboardLeaderboard from "@/components/DashboardLeaderboard";
import usePersonalCommunities from "@/hooks/usePersonalCommunities";

const Page = () => {

    const {getter} = usePersonalCommunities();

  return (
      <AuthorizedLayout>
          <h1>Dashboard</h1>
          <Grid container direction="row" spacing={2}>
              <Grid xs={4}>
                  <CurrentGamesCard />
              </Grid>
              <Grid xs={4}>
                  <DashboardLeaderboard />
              </Grid>
              {getter.map(comm => (
                  <Grid xs={4}>
                      <DashboardLeaderboard community={comm} />
                  </Grid>
              ))}
          </Grid>
      </AuthorizedLayout>
  );
}

export default Page;