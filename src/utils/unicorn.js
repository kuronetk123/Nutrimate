import useSWR from 'swr';
import fetcher from "@/utils/api"

export const useUnicorns = () => {
    const pathKey = `/unicorns`;
    const { data, error } = useSWR(pathKey, fetcher, {
        refreshInterval: 10000
    });

    return { data: data || [], loading: !error && !data };
};