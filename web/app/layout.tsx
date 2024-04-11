'use client';
import {API_SERVICE_CONTEXT} from "@/hooks/useApiService";
import ApiService from "@/service/ApiService";
import {SnackbarProvider} from "notistack";
import React, {useEffect, useMemo, useState} from "react";
import {useCookies} from "react-cookie";
import {usePathname, useRouter} from "next/navigation";
import {unauthorizedLocations} from "@/auth";
import ContextWrapper from "@/components/ContextWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const [cookies, setCookie] = useCookies(['application_user']);
    const router = useRouter();
    const pathname = usePathname();

    const apiService = useMemo<ApiService>(() => {
        const cookie = cookies.application_user as string;
        return new ApiService(cookie);
    }, [cookies]);

    const isLoggedIn = useMemo(() => apiService.isLoggedIn(), [apiService]);

    useEffect(() => {
        console.log(isLoggedIn);
        if (!isLoggedIn && !unauthorizedLocations.includes(pathname)) {
            router.push("/login");
        }
    }, [router, isLoggedIn, unauthorizedLocations, pathname]);

  return (
    <html lang="en">
      <body>
        <SnackbarProvider maxSnack={5} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            <div>
                <API_SERVICE_CONTEXT.Provider value={apiService}>
                    <ContextWrapper>
                        {children}
                    </ContextWrapper>
                </API_SERVICE_CONTEXT.Provider>
            </div>
        </SnackbarProvider>
      </body>
    </html>
  )
}
