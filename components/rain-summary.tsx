import {formatNumber} from '@/utils/number-formatter';
import {Stack} from './flex';
import {vars} from '@/app/global.css';

type Props = {
    rain?: number;
};

const RainSummary = ({rain}: Props) => {
    return (
        <div style={{fontWeight: 500, textAlign: 'center'}}>
            <Stack gap={16}>
                <div style={{fontSize: vars.fontSizes.extraLarge}}>
                    {typeof rain === 'number' ? formatNumber(rain) : '-'}{' '}
                    <span style={{fontSize: '0.8em'}}>mm</span>
                </div>
                <div>Hoy</div>
            </Stack>
        </div>
    );
};

export default RainSummary;
