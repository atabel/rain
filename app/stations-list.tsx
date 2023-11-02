import Link from 'next/link';
import Card from '@/components/card';
import {Stack} from '@/components/flex';
import * as styles from './list.css';
import {type Station} from '@/lib/aemet';

const getStationsByProvince = (stations: Array<Station>): {[province: string]: Array<Station>} => {
    const byProvince: {[province: string]: Array<Station>} = {};
    stations.forEach((s) => {
        byProvince[s.province] = byProvince[s.province] || [];
        byProvince[s.province].push(s);
    });
    return byProvince;
};

const compareStationName = (a: Station, b: Station) => a.name.localeCompare(b.name);

type Props = {
    stations: Array<Station>;
};

const StationsList = ({stations}: Props) => {
    const stationsByProvince = getStationsByProvince(stations);
    return (
        <Stack gap={16} as="ul">
            {Object.keys(stationsByProvince)
                .sort()
                .map((province, idx) => (
                    <li key={province}>
                        <Card title={province} right={`(${stationsByProvince[province].length})`}>
                            <ul className={styles.list}>
                                {stationsByProvince[province].sort(compareStationName).map((station) => (
                                    <li key={station.id} value={station.id} className={styles.row}>
                                        <Link href={`/station/${station.id}`} className={styles.rowLink}>
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
    );
};

export default StationsList;
