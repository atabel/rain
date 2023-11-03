import {formatNumber} from '@/utils/number-formatter';
import {type Reading} from '@/lib/api';
import {Inline, Stack} from './flex';
import * as styles from './rain-list.css';
import SROnly from './sr-only';

type Props = {
    readings: Array<Reading>;
};

export const HorizontalRainList = ({readings}: Props) => {
    const hourFormatter = new Intl.DateTimeFormat('es-ES', {hour: 'numeric', minute: 'numeric'});
    return (
        <div className={styles.horizontalList}>
            <Inline as="ul" gap={16}>
                {readings.map((reading, idx) => (
                    <Stack as="li" key={idx} gap={8} alignItems="center">
                        <time dateTime={new Date(reading.time).toISOString()} className={styles.hour}>
                            {hourFormatter.format(reading.time)}
                        </time>
                        <div aria-hidden style={{height: 24, display: 'flex', alignItems: 'center'}}>
                            {reading.rain ? '💧' : '・'}
                        </div>
                        <div className={styles.amount}>
                            {typeof reading.rain === 'number' ? `${formatNumber(reading.rain)}\u00A0mm` : '-'}
                        </div>
                    </Stack>
                ))}
            </Inline>
        </div>
    );
};

type VerticalRainListProps = {
    readings: Array<Reading>;
    formatter: (date: Date | number) => string;
};

export const VerticalRainList = ({readings, formatter}: VerticalRainListProps) => {
    const maxRain = Math.max(...readings.map((reading) => reading.rain ?? 0));
    const percentage = (rain: number) => (rain * 100) / maxRain;
    return (
        <table>
            <SROnly as="thead">
                <tr>
                    <th>periodo</th>
                    <th></th>
                    <th></th>
                    <th>lluvia</th>
                </tr>
            </SROnly>
            <tbody>
                {readings.map((reading, idx) => (
                    <tr key={idx} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                            <time dateTime={new Date(reading.time).toISOString()} className={styles.hour}>
                                {formatter(reading.time)}
                            </time>
                        </td>
                        <td aria-hidden className={styles.tableCell} style={{textAlign: 'center'}}>
                            <div>{reading.rain ? '💧' : '・'}</div>
                        </td>
                        <td aria-hidden style={{width: '100%'}} className={styles.tableCell}>
                            <div className={styles.progressBar}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        height: '100%',
                                        width: `${percentage(reading.rain ?? 0)}%`,
                                    }}
                                >
                                    <div className={styles.progressBarInner} />
                                </div>
                            </div>
                        </td>
                        <td className={styles.tableCell} style={{textAlign: 'right'}}>
                            <div className={styles.amount}>
                                {typeof reading.rain === 'number' ? formatNumber(reading.rain) : '-'}
                                <SROnly>mm</SROnly>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
