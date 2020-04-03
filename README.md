# Brew Locator

Integrates [TomTom Maps SDK](https://developer.tomtom.com/products/maps-sdk?gclid=EAIaIQobChMIgoiogc_M6AIVaf7jBx3aBwreEAAYASAAEgIha_D_BwE) with [OpenBreweryDB API](https://www.openbrewerydb.org/) to deliver an interactive map of breweries by location.

## Key Dependencies
 - TomTom Maps SDK for web
 - React
 - Redux
 - OpenBreweryDB
 - Bootstrap

## Usage
At this time, the app has not been deployed, but you can run it locally via a development server.

```bash
git clone https://github.com/jgullickson/brew_locator.git
cd brew_locator
npm install
npm start
```

![app screenshot](app_screenshot_brew_locator.png)

### Development Notes:
Current implementation allows user to select state (e.g. 'Minnesota') and display breweries in that state.
Future feature may allow user to filter breweries by radius of current gps location.