export const fetchData = (options) => {

    return function (dispatch, getState) {

        dispatch(requestData());

        let allData = [];
        const { selectedState } = getState();

        async function fetchLoop() {

            let pages_remain = true;

            //pages 0 and 1 in api are identical
            let currentPage = 1;

            const endpoint = (function () {
                switch (options.mode) {
                    case 'by_geo':
                        return 'by_state';
                    default:
                        return options.mode
                }
            })();

            while (pages_remain === true) {

                let url = `https://api.openbrewerydb.org/breweries?${endpoint}=${selectedState}&per_page=50&page=${currentPage}`;

                let response = await fetch(encodeURI(url));

                let data = await response.json();

                if (data.length > 0) {
                    data.map(d => allData.push(d));
                } else {
                    pages_remain = false;
                }

                currentPage++;
            }

            if (options.mode === 'by_geo') {
                let geoFilteredResults = allData.filter(brewery => options.geoFilter(brewery));
                dispatch(receiveData(geoFilteredResults));
            } else {
                dispatch(receiveData(allData));
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
            console.log("Oops! There`s an issue with the fetch request defined in actions.js");
        });

    };
};