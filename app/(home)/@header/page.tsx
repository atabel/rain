import {getStations} from '@/lib/api';

const Header = async () => {
    const stations = await getStations();
    return <>Estaciones ({stations.length})</>;
};

export default Header;
