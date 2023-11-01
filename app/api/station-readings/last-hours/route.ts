import {getTodayReadings} from '@/lib/aemet';

export const GET = async (request: Request) => {
    const {searchParams} = new URL(request.url);
    const stationId = searchParams.get('stationId');
    if (!stationId) {
        return Response.json({error: 'Missing stationId'});
    }
    try {
        const readings = await getTodayReadings(stationId);
        return Response.json({readings});
    } catch (err: any) {
        return Response.json({error: err}, {status: err?.estado || 500});
    }
};
