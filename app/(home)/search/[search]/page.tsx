import {getStations, type Station} from '@/lib/api';
import StationsList from '@/app/stations-list';

const SearchPage = async ({params}: {params: {search: string}}) => {
    const search = params.search ?? '';
    const stations = (await getStations()).filter(
        (station) =>
            station.name.toLowerCase().includes(search.trim().toLowerCase()) ||
            station.province.toLowerCase().includes(search.trim().toLowerCase())
    );

    return <StationsList stations={stations} />;
};

export default SearchPage;
