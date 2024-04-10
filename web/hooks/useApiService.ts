'use client';
import {createContext, useContext} from "react";
import ApiService from "@/service/ApiService";


export const API_SERVICE_CONTEXT = createContext<ApiService>(new ApiService());


const useApiService = () => useContext(API_SERVICE_CONTEXT);

export default useApiService;