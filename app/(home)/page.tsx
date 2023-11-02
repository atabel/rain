import {getStations, type Station} from '@/lib/api';
import StationsList from '../stations-list';

const Home = async () => {
    const stations = await getStations();
    return <StationsList stations={stations} />;
};

export default Home;
