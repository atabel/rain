import {getLastHours, getPerDay, getPerMonth, getStations, type Reading} from '@/lib/api';
import {vars} from '@/app/global.css';
import Card from '@/components/card';
import {Stack} from '@/components/flex';
import {HorizontalRainList, VerticalRainList} from '@/components/rain-list';
import RainSummary from '@/components/rain-summary';
import SROnly from '@/components/sr-only';
import Title from '@/components/title';
import {formatNumber} from '@/utils/number-formatter';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {CardErrorBoundary, RainErrorBoundary} from './error-boundaries';

const reverse = <T,>(arr: Array<T>) => arr.slice().reverse();

const weekdayFormatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
});

const monthFormatter = new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    year: 'numeric',
});

const aggregateReadings = (readings: Array<Reading>): number => {
    return readings.reduce((acc, reading) => acc + (reading.rain ?? 0), 0);
};

const getTodayRains = async (stationId: string) => {
    const lastHours = await getLastHours(stationId);
    const todayWeekday = weekdayFormatter.format(lastHours[lastHours.length - 1].time);
    return lastHours.filter((reading) => weekdayFormatter.format(reading.time) === todayWeekday);
};

const TodaySummary = async ({stationId}: {stationId: string}) => {
    const todayRains = await getTodayRains(stationId);
    const aggregatedTodayRain = aggregateReadings(todayRains);
    return <RainSummary rain={aggregatedTodayRain} />;
};

const LastHours = async ({stationId}: {stationId: string}) => {
    const lastHours = await getLastHours(stationId);
    const totalRain = aggregateReadings(lastHours);
    return (
        <Card
            title="Últimas 24h"
            right={
                <div>
                    {formatNumber(totalRain)}
                    <SROnly>mm</SROnly>
                </div>
            }
        >
            <HorizontalRainList readings={reverse(lastHours)} />
        </Card>
    );
};

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const LastDays = async ({stationId}: {stationId: string}) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const lastDays = await getPerDay(stationId, startOfToday - ONE_WEEK, startOfToday);

    const todayRains = await getTodayRains(stationId);
    const aggregatedTodayRain = aggregateReadings(todayRains);

    const todayReading: Reading = {rain: aggregatedTodayRain, time: today.getTime(), stationId};

    const readings = [todayReading, ...reverse(lastDays)];
    const totalRain = aggregateReadings(readings);

    return (
        <Card
            title="Últimos días"
            right={
                <div>
                    {formatNumber(totalRain)}
                    <SROnly>mm</SROnly>
                </div>
            }
        >
            <VerticalRainList
                readings={readings}
                formatter={(date) => {
                    if (date === todayReading.time) {
                        return 'Hoy';
                    }
                    return weekdayFormatter.format(date);
                }}
            />
        </Card>
    );
};

const LastMonths = async ({stationId}: {stationId: string}) => {
    const lastMonths = await getPerMonth(stationId);
    const totalRain = aggregateReadings(lastMonths);
    return (
        <Card
            title="Por meses"
            right={
                <div>
                    {formatNumber(totalRain)}
                    <SROnly>mm en los ultimos 12 meses</SROnly>
                </div>
            }
        >
            <VerticalRainList readings={reverse(lastMonths)} formatter={monthFormatter.format} />
        </Card>
    );
};

const getStation = async (stationId: string) => {
    const stations = await getStations();
    const station = stations.find((station) => station.id === stationId);
    if (!station) {
        return notFound();
    }
    return station;
};

const StationName = async ({stationId}: {stationId: string}) => {
    const station = await getStation(stationId);
    return <Title>{station.name}</Title>;
};

const MapLink = async ({stationId, children}: {stationId: string; children: React.ReactNode}) => {
    const station = await getStation(stationId);

    return (
        <a
            style={{display: 'block', width: 24, height: 24, color: 'inherit'}}
            aria-label="Ver estación meteorológica en Google Maps"
            href={`https://maps.google.com/?q=${station.lat},${station.lon}&ll=${station.lat},${station.lon}&z=14`}
            target="_blank"
        >
            {children}
        </a>
    );
};

const StationPage = ({params}: {params: {id: string}}) => {
    const mapIcon = (
        <svg fill="currentColor" height="24" viewBox="0 -960 960 960" width="24">
            <path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z" />
        </svg>
    );
    return (
        <div>
            <main style={{padding: '24px 16px', maxWidth: 1024, margin: '0 auto'}}>
                <Suspense fallback={<Title>Cargando...</Title>}>
                    <StationName stationId={params.id} />
                </Suspense>
                <RainErrorBoundary>
                    <Stack gap={24}>
                        <Suspense fallback={<RainSummary />}>
                            <TodaySummary stationId={params.id} />
                        </Suspense>

                        <Stack gap={16}>
                            <Suspense fallback={<Card title="Últimas 24h">Cargando...</Card>}>
                                <LastHours stationId={params.id} />
                                <CardErrorBoundary title="Últimos días">
                                    <Suspense fallback={<Card title="Últimos días">Cargando...</Card>}>
                                        <LastDays stationId={params.id} />

                                        <CardErrorBoundary title="Por meses">
                                            <Suspense fallback={<Card title="Por meses">Cargando...</Card>}>
                                                <LastMonths stationId={params.id} />
                                            </Suspense>
                                        </CardErrorBoundary>
                                    </Suspense>
                                </CardErrorBoundary>
                            </Suspense>
                        </Stack>
                    </Stack>
                </RainErrorBoundary>
            </main>
            <div style={{width: '100%', height: 56}} />
            <footer
                style={{
                    position: 'fixed',
                    bottom: 0,
                    paddingBottom: 'env(safe-area-inset-bottom)',
                    width: '100%',
                    background: vars.colors.backgroundContainer,
                    borderTop: `1px solid ${vars.colors.border}`,
                }}
            >
                <div
                    style={{
                        padding: 16,
                        display: 'flex',
                        justifyContent: 'space-between',
                        maxWidth: 1024,
                        margin: '0 auto',
                    }}
                >
                    <Suspense fallback={mapIcon}>
                        <MapLink stationId={params.id}>{mapIcon}</MapLink>
                    </Suspense>
                    <Link
                        style={{display: 'block', width: 24, height: 24, color: 'inherit'}}
                        href="/"
                        aria-label="Ver listado de estaciones meteorológicas"
                    >
                        <svg fill="currentColor" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z" />
                        </svg>
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export const generateMetadata = async ({params}: {params: {id: string}}) => {
    const stations = await getStations();
    const station = stations.find((station) => station.id === params.id);

    if (!station) {
        return {};
    }

    return {
        title: `Lluvia en ${station.name}`,
        description: `Registro de lluvia en la estacion meteorológica de ${station.name} (${station.province})`,
    };
};

export default StationPage;
