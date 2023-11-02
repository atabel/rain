import {getStations} from '@/lib/api';

const SearchHeader = async ({params}: {params: {search: string}}) => {
    const search = params.search ?? '';
    const stations = (await getStations()).filter(
        (station) =>
            station.name.toLowerCase().includes(search.trim().toLowerCase()) ||
            station.province.toLowerCase().includes(search.trim().toLowerCase())
    );

    return <>Estaciones ({stations.length})</>;
};

export default SearchHeader;
