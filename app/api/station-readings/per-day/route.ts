import {getReadingsByDay} from '@/lib/aemet';

export const GET = async (request: Request) => {
    const {searchParams} = new URL(request.url);
    const stationId = searchParams.get('stationId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (!stationId) {
        return Response.json({error: 'Missing stationId'});
    }
    if (!from) {
        return Response.json({error: 'Missing from timestamp'});
    }
    if (!to) {
        return Response.json({error: 'Missing to timestamp'});
    }

    try {
        const readings = await getReadingsByDay(stationId, Number(from), Number(to));
        return Response.json({readings});
    } catch (err: any) {
        return Response.json({error: err}, {status: err?.estado || 500});
    }
};
