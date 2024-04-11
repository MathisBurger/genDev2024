'use client';
import {useSearchParams} from "next/navigation";
import useApiService from "@/hooks/useApiService";
import {useEffect, useState} from "react";
import {ExtendedCommunity} from "@/typings/community";
import AuthorizedLayout from "@/components/AuthorizedLayout";


const DetailsPage = () => {

    const id = useSearchParams().get('id') ?? '';
    const apiService = useApiService();
    const [community, setCommunity] = useState<ExtendedCommunity|null>(null);

    useEffect(() => {
        const fetcher = async () => {
            const resp = await apiService.getCommunity(parseInt(id, 10));
            if (resp.status !== 200) {
                console.log(resp.data);
            } else {
                setCommunity(resp.data as ExtendedCommunity);
            }
        }
        fetcher();
    }, [id, apiService]);

    return (
        <AuthorizedLayout>
            {community === null ? (
                <h1>Community existiert nicht</h1>
            ) : (
                <>
                    <h1>{community.name}</h1>
                </>
            )}
        </AuthorizedLayout>
    );
}

export default DetailsPage;