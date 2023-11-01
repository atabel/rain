import {getStations} from '@/lib/aemet';

export const GET = async () => {
    const stations = await getStations();
    return Response.json({stations});
};
