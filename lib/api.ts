import {cache} from 'react';
import {notFound} from 'next/navigation';
import * as aemet from './aemet';

export type Reading = aemet.Reading;
export type Station = aemet.Station;

const handleAemetError = (err: any) => {
    console.error('handleAemetError', err);
    if (err?.estado === 404) {
        notFound();
    }
    throw err;
};

export const getStations = cache(async () => {
    try {
        const res = await aemet.getStations();
        return res;
    } catch (err: any) {
        return handleAemetError(err);
    }
});

export const getLastHours = cache(async (stationId: string): Promise<Array<aemet.Reading>> => {
    try {
        return await aemet.getTodayReadings(stationId);
    } catch (err: any) {
        return handleAemetError(err);
    }
});

export const getPerDay = cache(
    async (stationId: string, from: number, to: number): Promise<Array<aemet.Reading>> => {
        try {
            return await aemet.getReadingsByDay(stationId, from, to);
        } catch (err: any) {
            return handleAemetError(err);
        }
    }
);

export const getPerMonth = cache(async (stationId: string): Promise<Array<aemet.Reading>> => {
    try {
        return await aemet.getReadingsByMonth(stationId);
    } catch (err: any) {
        return handleAemetError(err);
    }
});
