'use client';

import Sidebar from "@/components/Sidebar";
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Grid} from "@mui/joy";
import CurrentGamesCard from "@/components/dashboard/CurrentGamesCard";

const Page = () => {
  return (
      <AuthorizedLayout>
          <h1>Dashboard</h1>
          <Grid container direction="row" spacing={2}>
              <Grid xs={4}>
                  <CurrentGamesCard />
              </Grid>
          </Grid>
      </AuthorizedLayout>
  );
}

export default Page;