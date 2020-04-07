# Brew Locator

Integrates [Leaflet.js](https://leafletjs.com/) with [OpenBreweryDB API](https://www.openbrewerydb.org/) to deliver an interactive map of breweries by location.

## Key Dependencies
 - Leaflet.js
 - Mapbox
 - React
 - Redux
 - OpenBreweryDB
 - Bootstrap

## Usage
There is a live demo of the app available at https://geo-hop.herokuapp.com

Alternatively, to clone the respository and run the app via a live development server:

```bash
git clone https://github.com/jgullickson/brew_locator.git
cd brew_locator
npm install
npm start
```

<!-- ![app screenshot](app_screenshot_brew_locator.png) -->

### Development Notes:
Current implementation allows user to select state (e.g. 'Minnesota') and display breweries in that state.
Future feature may allow user to filter breweries by radius of current gps location.