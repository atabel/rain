import {getStations, type Station} from '@/lib/api';
import Link from 'next/link';
import Title from '@/components/title';
import Card from '@/components/card';
import {Stack} from '@/components/flex';
import * as styles from './list.css';
import SearchField from './search-field';
import {Metadata} from 'next';

const getStationsByProvince = async (
    stations: Array<Station>
): Promise<{[province: string]: Array<Station>}> => {
    const byProvince: {[province: string]: Array<Station>} = {};
    stations.forEach((s) => {
        byProvince[s.province] = byProvince[s.province] || [];
        byProvince[s.province].push(s);
    });
    return byProvince;
};

const compareStationName = (a: Station, b: Station) => a.name.localeCompare(b.name);

export const metadata: Metadata = {
    title: 'Pluviómetros',
    description: 'Registro de lluvia de la red de la Agencia Estatal de Meteorología',
};

const Home = async ({searchParams}: {searchParams: {search?: string}}) => {
    const search = searchParams?.search ?? '';
    const stations = (await getStations()).filter(
        (station) =>
            station.name.toLowerCase().includes(search.toLowerCase()) ||
            station.province.toLowerCase().includes(search.toLowerCase())
    );
    const stationsByProvince = await getStationsByProvince(stations);

    return (
        <main style={{padding: '24px 16px', maxWidth: 1024, margin: '0 auto'}}>
            <Stack gap={16}>
                <Title>Estaciones ({stations.length})</Title>
                <div style={{paddingTop: 16}}>
                    <SearchField />
                </div>
                <Stack gap={16} as="ul">
                    {Object.keys(stationsByProvince)
                        .sort()
                        .map((province, idx) => (
                            <li key={province}>
                                <Card title={province} right={`(${stationsByProvince[province].length})`}>
                                    <ul className={styles.list}>
                                        {stationsByProvince[province]
                                            .sort(compareStationName)
                                            .map((station) => (
                                                <li
                                                    key={station.id}
                                                    value={station.id}
                                                    className={styles.row}
                                                >
                                                    <Link
                                                        href={`/station/${station.id}`}
                                                        className={styles.rowLink}
                                                    >
                                                        <div className={styles.rowText}>{station.name}</div>
                                                        <svg
                                                            style={{marginRight: -6, display: 'block'}}
                                                            fill="#86888C"
                                                            height="24"
                                                            viewBox="0 -960 960 960"
                                                            width="24"
                                                        >
                                                            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                                                        </svg>
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                </Card>
                            </li>
                        ))}
                </Stack>
            </Stack>
        </main>
    );
};

export default Home;
