import React, { useState } from 'react';
import { connect } from 'react-redux';
import { selectState, resetMapZoom } from '../../redux/actions';
import styles from './BreweryList.module.scss';
import icon from '../../assets/images/geohop-marker.svg';
import Swal from 'sweetalert2';
import colors from '../../styles/colors.scss';

const BreweryList = (props) => {

    let previousMarker = null;

    const noLatLon = (breweryInfo) => {
        return (!breweryInfo.latitude || !breweryInfo.longitude)
    }

    const showInfo = (breweryInfo) => {
        if (noLatLon(breweryInfo)) {

            if (previousMarker) {
                previousMarker.closePopup();
            }

            if (props.mode === 'by_state') {
                props.selectState(props.selectedState)
            } else {
                props.resetMapZoom()
            }

            Swal.fire({
                html: createModalHTML(breweryInfo),
                confirmButtonColor: colors['theme-green'],
                confirmButtonText: 'CLOSE',
                background: colors.light
            })
        } else {

            props.mapRef.fire('popupopen-from-list', [breweryInfo.latitude, breweryInfo.longitude]);

            const marker = props.markers.filter(marker => marker.id === breweryInfo.id)[0];

            marker.fire('click');

            previousMarker = marker;
        }

        if (isMobile()) {
            toggleMobileListVisibility()
        }
    }

    const isMobile = () => window.screen.width <= 600 ? true : false;

    const createModalHTML = (breweryInfo) => {
        let html = `<div class=${styles['modal-html-container']}>`;

        html += `<h2>${breweryInfo.name}</h2>`
        html += `<p class=${styles['modal-html-notice']}><span class='text-danger'>No latitude/longitude data was found for this brewery.</span> Here's what we do know:</p>`

        html += `<div class=${styles['modal-html-address']}>`;
        html += `<span class=${styles['modal-html-title']}>${breweryInfo.name}</span>`;
        if (breweryInfo.street) html += `<span'>${breweryInfo.street}</span><br>`
        if (breweryInfo.state) html += `<span>${breweryInfo.city}, ${breweryInfo.state}</span>`
        html += `</div>`;

        if (breweryInfo.phone) html += `<a class=${styles['modal-html-link']} href=tel:${breweryInfo.phone}><i class='material-icons'>phone</i>${breweryInfo.phone}</a>`;

        if (breweryInfo.website_url) html += `<a class=${styles['modal-html-link']} href=${breweryInfo.website_url}><i class='material-icons'>computer</i>Website</a>`;

        let search_url = encodeURI(`http://www.google.com/search?q=${breweryInfo.name} ${breweryInfo.state}`);
        html += `<a class=${styles['modal-html-link']} href=${search_url}><i class='material-icons'>search</i>More info</a>`

        html += `</div>`;

        return html;
    }

    const resultsList = document.getElementById('brewery-list');

    const mobileListVisible = () => resultsList.style.visibility === 'visible' ? true : false;

    const toggleMobileListVisibility = () => {
        if (mobileListVisible()) {
            resultsList.style.visibility = 'hidden';
            setButtonText("Results List")
            setButtonIcon("keyboard_arrow_down")
        } else {
            resultsList.style.visibility = 'visible';
            setButtonText("Back to Map");
            setButtonIcon("keyboard_arrow_up");
        }
    }

    const [buttonText, setButtonText] = useState("Results List");
    const [buttonIcon, setButtonIcon] = useState("keyboard_arrow_down");

    return (
        <div className={styles['brewery-list']} id="brewery-list">
            {
                props.results.length > 0 && (
                    <>
                        <button
                            className={`btn btn-info
                            ${styles['mobile-list-toggle']}`}
                            onClick={() => toggleMobileListVisibility()}>
                                <span>{buttonText}</span>
                                <i className='material-icons'>{buttonIcon}</i>
                        </button>
                        <h3>Results</h3>
                        <ul>
                            {props.results.map(brewery => {
                                return (
                                    <li key={brewery.id}>
                                        <button onClick={() => showInfo(brewery)}>
                                            <img src={icon} className={styles.icon} alt="app logo; artistic rendition of a hop plant on a map marker" />
                                            <div>
                                                <span>{brewery.name}</span>
                                                {noLatLon(brewery) && <small className='text-danger'>No location data.</small>}
                                            </div>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                )
            }
            </div>
    )
}

const mapState = ({ results, markers, mapRef, selectedState, mode }) => {
    return { results, markers, mapRef, selectedState, mode }
}

const mapDispatch = (dispatch) => {
    return {
        resetMapZoom: () => dispatch(resetMapZoom()),
        selectState: (state) => dispatch(selectState(state))
    }
}

export default connect(mapState, mapDispatch)(BreweryList)