import { APIResponse } from "@/lib/api";
import { IPage } from "@/lib/page.types";
import axios from "axios";

const _axios = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    },
});


export const CreateNewPage = async (page: IPage) => {
    return _axios.post<APIResponse<null>>("/api/admin/pages", page);
};