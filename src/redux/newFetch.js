export const getBreweries = async (options) => {

    let allData = [];

    async function fetchLoop() {

        let pages_remain = true;

        //pages 0 and 1 in api are identical
        let currentPage = 1;

        while (pages_remain === true) {

            let url;

            switch (options.mode) {
                case 'by_state':
                    url = `https://api.openbrewerydb.org/breweries?by_state=${options.query}&per_page=50&page=${currentPage}`;
                    console.log(url);
                    break;
                case 'by_name':
                    url = `https://api.openbrewerydb.org/breweries?by_name=${options.query}&per_page=50&page=${currentPage}`;
                    console.log(url);
                    break;
                case 'by_postal':
                    url = `https://api.openbrewerydb.org/breweries?by_postal=${options.query}&per_page=50&page=${currentPage}`;
                    console.log(url);
                    break;
                default:
                    url = `https://api.openbrewerydb.org/breweries?per_page=50&page=${currentPage}`;
                    console.log(url);
            }

            let response = await fetch(encodeURI(url));

            let data = await response.json();

            if (data.length > 0) {
                for (const d of data) {
                    allData.push(d);
                }
            } else {
                pages_remain = false;
            }

            currentPage++;
        }

        if (allData.length === 0) {
            Swal.fire({
                title: 'Sorry, no results were found',
                text: 'Please try searching for something else',
                icon: 'error',
                confirmButtonColor: colors['theme-green'],
                confirmButtonText: 'CLOSE',
                background: colors.light
            })
        }

        console.log(`fetched data for ${allData.length} breweries`);
    }

    fetchLoop().catch(error => {
        console.error(error);
        console.error("Oops! There's an issue with the fetch request defined in actions.js");
    });
};


const fetchData = (options) => {
    return async function (dispatch) {

        dispatch(requestData());

        let data;

        if (options.mode === 'by_geo') {
            /**
             * Geo mode fetches data for user's state and surrounding states, and then filters results.
             * This is a workaround as openbrewerydb does not have a geolocation endpoint.
             * Data is fetched from adjacent states, as the specified search radius could cross state lines.
             * Still results in fetching more data than needed, but ultimately requires significantly fewer API calls than fetching ALL data and then filtering.
             */
            for (const state in options.state_cluster) {
                const results = await getBreweries({ mode: 'by_state', query: state });
                data = [...data, ...results];
            }

            const geoFilteredData = data.filter(brewery => options.geoFilter(brewery));

            dispatch(receiveData(geoFilteredData));

        } else {
            data = [...await getBreweries({ mode: options.mode, query: options.query })];

            dispatch(receiveData(data));
        }
    }
}