import { APIResponse } from "@/lib/api";
import { IPage, IPageWithoutId, PageStatus } from "@/lib/page.types";
import axios from "axios";

const _axios = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    },
});


export const CreateNewPage = async (page: IPageWithoutId) => {
    return _axios.post<APIResponse<IPage>>("/api/admin/pages", page);
};

export const GetAllPages = async (page: number = 1, limit: number = 10) => {
    return _axios.get<APIResponse<{ pages: IPage[], pagination: { total: number, page: number, limit: number, totalPages: number, hasMore: boolean } }>>(`/api/admin/pages`, {
        params: { page, limit }
    });
};

export const GetPageById = async (id: string) => {
    return _axios.get<APIResponse<IPage>>(`/api/admin/pages/${id}`);
};

export const UpdatePage = async (id: string, data: Partial<IPageWithoutId>) => {
    return _axios.patch<APIResponse<IPage>>(`/api/admin/pages/${id}`, data);
};

export const DeletePage = async (id: string) => {
    // Soft delete by setting status to TRASHED
    return UpdatePage(id, { status: PageStatus.TRASHED }); // Assuming PageStatus enum is available or string 'TRASHED'
};

export const PermanentDeletePage = async (id: string) => {
    return _axios.delete<APIResponse<null>>(`/api/admin/pages/${id}`);
};

export const GetDashboardStats = async () => {
    return _axios.get<APIResponse<{ total: number, published: number, drafts: number }>>('/api/admin/stats');
};