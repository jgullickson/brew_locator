import config from '../config.json';
import buffer from '@turf/buffer';
import bbox from '@turf/bbox';
import { point } from '@turf/helpers';
import L from 'leaflet';
import adjacent_state_data from '../helpers/adjacent-states.json';

/**
 * Get user geolocation
 */
export const geo_get = (position_options = { enableHighAccuracy: true }) => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position)
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        error: false
                    })
                },
                (error) => {

                    let error_description;

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            error_description = 'permission denied';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            error_description = 'position unavailable';
                            break;
                        case error.TIMEOUT:
                            error_description = 'timeout';
                            break;
                        case error.UNKNOWN_ERROR:
                            error_description = 'unknown error';
                            break;
                        default:
                            error_description = 'unhandled error';
                    }

                    reject({
                        error: true,
                        error_code: error.code,
                        error_description
                    })
                }, {enableHighAccuracy: true})
        } else {
            reject({
                error: true,
                error_code: null,
                error_description: '!navigator.geolocation'
            })
        }
    })
}

/**
 * Use MapBox reverse geocode api to derive location info from lat/lng
 * @param {{lat: number, lng: number}} latlng
 */
export const geo_rev = ({ lat, lon }, feature_type) => {
    return new Promise(async (resolve, reject) => {
        let url;
        if (!feature_type) {
            url = encodeURI(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${config.mapAccessToken}`);
        } else {
            url = encodeURI(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?types=${feature_type}&access_token=${config.mapAccessToken}`);
        }
        const response = await fetch(url);

        const content_type = response.headers.get('content-type');
        // const response_contains_json = content_type.indexOf('application/vnd.geo+json') !== -1;
        const response_contains_json = content_type.indexOf('json') !== -1;

        if (response.ok && response_contains_json) {
            const location_data = await response.json();
            resolve(location_data);
        } else {
            reject(new Error(`${response.status}: ${response.statusText}`))
        }
    })
}

/**
 * Use mapbox reverse geocode to derive user's US State from their lat/lon location
 * 
 */
export const get_state_cluster = async ({ lat, lon }) => {
    
    const data = await geo_rev({ lat, lon }, 'region');

    const state_cluster = {
        center: data.features[0].text, // State name, e.g. "Minnesota"
        cluster: [data.features[0].text]
    }

    const helper_data = (function () {
        for (const key in adjacent_state_data) {
            if (adjacent_state_data[key].name === state_cluster.center) {
                return adjacent_state_data[key];
            }
        }
    })();

    for (const state_abbreviation of helper_data.adjacent) {
        state_cluster.cluster.push(adjacent_state_data[state_abbreviation].name);
    }
    
    return state_cluster.cluster;
}

/**
 * Parse mapbox reverse geo lookup data for features
 */
export const derive_postcode = ({lat, lng}) => {
    return new Promise(async (resolve, reject) => {
        await geo_rev({ lat, lng }, 'postcode').then(
            (results) => resolve(results.features[0].text),
            (error) => reject(error)
        )
    })
}

export const create_buffer = ({ lat, lon }, radius) => {
    const p = point([lon, lat]);
    return buffer(p, radius, { units: 'miles' });
}

export const bbox_from_buffer = buff => bbox(buff);

export const latlng_bounds_from_bbox = (bb) => {
    console.log('latlng_bounds_from_bbox')
    const corner1 = L.latLng(bb[1], bb[0]);
    const corner2 = L.latLng(bb[3], bb[2]);
    console.log('corner1: ' + corner1)
    console.log('corner2: ' + corner2)
    const llb = L.latLngBounds(corner1, corner2);
    console.log(llb)
    return llb
}

