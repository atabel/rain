export type Station = {
    id: string;
    name: string;
    province: string;
    lat: number;
    lon: number;
    alt: number;
};

export type Reading = {
    time: number;
    rain: number;
    stationId: string;
};

const API_KEY = String(process.env.AEMET_API_KEY);

const API_URL = 'https://opendata.aemet.es/opendata/api/';
const apiUrl = (path: string) => {
    const url = new URL(`${API_URL}${path}`);
    url.searchParams.set('api_key', API_KEY);
    return url.toString();
};

const fetchJson = async <T>(url: string, requestOptions?: RequestInit): Promise<T> => {
    const res = await fetch(url, requestOptions);
    const decoder = new TextDecoder('ISO-8859-15');
    const text = decoder.decode(await res.arrayBuffer());
    const decodedJson = JSON.parse(text);
    return decodedJson;
};

const apiCall = async <T>(path: string, requestOptions?: RequestInit, retry: number = 0): Promise<T> => {
    const url = apiUrl(path);
    console.log(`[AEMET] Call ${path}`);
    const res = await fetchJson<{estado: number; datos: string}>(url, requestOptions);

    if (res.estado !== 200 || !res.datos) {
        console.error(`[AEMET] error response for ${path}`, res);
        throw res;
    }

    const finalRes = await fetchJson<{estado?: number; descripcion?: string}>(res.datos);

    if (finalRes.estado && finalRes.estado !== 200) {
        if (finalRes.descripcion === 'datos expirados' && retry < 3) {
            console.warn(`[AEMET] expired data ${path} (retry ${retry})`);
            return apiCall(path, {next: {revalidate: 0}}, retry + 1);
        } else {
            console.error(`[AEMET] error datos response (retry ${retry}) for ${path} ${res.datos}`, finalRes);
            throw finalRes;
        }
    }

    return finalRes as T;
};

const parseLatitude = (latStr: string) => {
    const sign = latStr.slice(-1) === 'N' ? 1 : -1;
    const [deg, min, sec] = latStr.slice(0, -1).match(/\d{2}/g)?.map(Number) as [number, number, number];
    return sign * (deg + min / 60 + sec / 3600);
};

const parseLongitude = (lonStr: string) => {
    const sign = lonStr.slice(-1) === 'E' ? 1 : -1;
    const [deg, min, sec] = lonStr.slice(0, -1).match(/\d{2}/g)?.map(Number) as [number, number, number];
    return sign * (deg + min / 60 + sec / 3600);
};

type StationFromServer = {
    indicativo: string;
    nombre: string;
    latitud: string;
    longitud: string;
    altitud: string;
    provincia: string;
};

type HourlyReadingFromServer = {
    fint: string;
    prec: string;
};

type DailyReadingFromServer = {
    prec: string;
    fecha: string;
};

type MontlyReadingFromServer = {
    p_mes: string;
    fecha: string;
};

const parseApiNum = (num: string) => {
    const parsed = num ? Number(num.replace(',', '.')) : 0;
    if (Number.isNaN(parsed)) {
        return 0;
    }
    return parsed;
};

const createStation = ({
    indicativo,
    nombre,
    latitud,
    longitud,
    provincia,
    altitud,
}: StationFromServer): Station => ({
    id: indicativo,
    name: nombre
        .toLowerCase()
        .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
        .trim(),
    lat: parseLatitude(latitud),
    lon: parseLongitude(longitud),
    alt: parseApiNum(altitud),
    province: provincia,
});

const createReading =
    (stationId: string) =>
    ({fint, prec}: HourlyReadingFromServer): Reading => ({
        time: new Date(fint + 'Z').getTime(),
        rain: Number(prec || 0),
        stationId,
    });

const createReadingFromDaily =
    (stationId: string) =>
    ({fecha, prec}: DailyReadingFromServer): Reading => ({
        time: new Date(fecha).getTime(),
        rain: parseApiNum(prec),
        stationId,
    });

const createReadingFromMontly =
    (stationId: string) =>
    ({fecha, p_mes}: MontlyReadingFromServer): Reading => ({
        time: new Date(fecha).getTime(),
        rain: parseApiNum(p_mes),
        stationId,
    });

export const getStations = (): Promise<Array<Station>> =>
    apiCall<Array<StationFromServer>>('valores/climatologicos/inventarioestaciones/todasestaciones/', {
        next: {
            revalidate: 60 * 60 * 24, // 24 hours
        },
    }).then((stations) => stations.map(createStation));

export const getTodayReadings = async (stationId: string): Promise<Array<Reading>> => {
    // using this startOfCurrentHour as url param to invalidate cache and get fresh data
    const today = new Date();
    const startOfCurrentHour = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours()
    ).getTime();
    const readings = await apiCall<Array<HourlyReadingFromServer>>(
        `observacion/convencional/datos/estacion/${stationId}?d=${startOfCurrentHour}`,
        {
            next: {
                revalidate: 10 * 60, // 5 minutes
            },
        }
    );
    return readings.map(createReading(stationId));
};

const twoDigits = (num: number): string => String(num).padStart(2, '0');
const getApiDateFromTs = (ts: number) => {
    const date = new Date(ts);
    const year = date.getUTCFullYear();
    const month = twoDigits(date.getUTCMonth() + 1);
    const day = twoDigits(date.getUTCDate());
    const hour = twoDigits(date.getUTCHours());
    const min = twoDigits(date.getUTCMinutes());
    const sec = twoDigits(date.getUTCSeconds());
    return `${year}-${month}-${day}T${hour}:${min}:${sec}UTC`;
};

const getLastDaysFromCsv = async (stationId: string): Promise<Array<Reading>> => {
    // using this startOfDay as url param to invalidate cache and get fresh data
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const url = `https://www.aemet.es/es/eltiempo/observacion/ultimosdatos_${stationId}_resumenes-diarios-anteriores.csv?l=${stationId}&datos=det&w=2&d=${startOfDay}`;

    const res = await fetch(url, {
        next: {
            revalidate: 60 * 60 * 1, // 1 hours
        },
    });
    const decoder = new TextDecoder('ISO-8859-15');
    const text = decoder.decode(await res.arrayBuffer());
    const readings: Array<Reading> = [];
    console.log('[AEMET] CSV', url, text);
    text.split('\n')
        .slice(4, -1)
        .forEach((line) => {
            const [date, _maxTemp, _minTemp, _avgTemp, _wind1, _wind2, rain] = line.split(',');
            readings.unshift({
                time: new Date(date).getTime(),
                rain: parseApiNum(rain.replace(/"/g, '')),
                stationId,
            });
        });

    return readings;
};

const getReadingsByDayFromApi = async (stationId: string, from: number, to: number) => {
    const startDate = getApiDateFromTs(from);
    const endDate = getApiDateFromTs(Math.min(to, Date.now()));
    const readings = await apiCall<Array<DailyReadingFromServer>>(
        `valores/climatologicos/diarios/datos/fechaini/${startDate}/fechafin/${endDate}/estacion/${stationId}/`,
        {
            next: {
                revalidate: 60 * 60 * 1, // 1 hours
            },
        }
    );

    return readings.map(createReadingFromDaily(stationId));
};

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const needsReadingsOlderThanOneWeek = (from: number) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const oneWeekAgo = startOfToday - ONE_WEEK;
    return from < oneWeekAgo;
};

export const getReadingsByDay = async (
    stationId: string,
    from: number,
    to: number
): Promise<Array<Reading>> => {
    // this csv gives us the rain in the last 7 days
    const csvReadingsPromise = getLastDaysFromCsv(stationId);
    // this api usually don't have info of the last 3 days, so we compliment data with the csv
    const apiReadingsPromise = needsReadingsOlderThanOneWeek(from)
        ? getReadingsByDayFromApi(stationId, from, to)
        : Promise.resolve([]);

    const csvReadings = await csvReadingsPromise;
    const firstCsvReading = csvReadings[0];

    const historicalReadings = (await apiReadingsPromise).filter(
        (reading) => reading.time < Number(firstCsvReading.time)
    );

    return [...historicalReadings, ...csvReadings];
};

export const getReadingsByMonth = async (stationId: string): Promise<Array<Reading>> => {
    const today = new Date();
    const currentYear = today.getUTCFullYear();
    const currentMonth = today.getUTCMonth() + 1;

    const readings = await apiCall<Array<MontlyReadingFromServer>>(
        `valores/climatologicos/mensualesanuales/datos/anioini/${
            currentYear - 1
        }/aniofin/${currentYear}/estacion/${stationId}`,
        {
            next: {
                revalidate: 60 * 60 * 24, // 24 hours
            },
        }
    );

    return readings
        .filter((r) => {
            const [readingYear, readingMonth] = r.fecha.split('-');

            // aemet uses the month 13 to aggregate the data of the whole year
            if (readingMonth === '13') {
                return false;
            }

            if (Number(readingYear) === currentYear) {
                return Number(readingMonth) < currentMonth;
            } else {
                return Number(readingMonth) >= currentMonth;
            }
        })
        .map(createReadingFromMontly(stationId));
};
