# API Data Mapping Guide

This document explains how the JSON response from the API is mapped to the frontend UI elements.

## JSON Structure → UI Mapping

### 1. Location Data

```json
{
  "location": {
    "latitude": -34.9011,
    "longitude": -56.1645,
    "place_name": "Montevideo, Uruguay",
    "grid_resolution_deg": 0.5
  }
}
```

**Maps to:**
- Page titles (h2): `location.place_name`
- Map center: `[location.latitude, location.longitude]`
- Stored in localStorage for persistence

---

### 2. Current Temperature

```json
{
  "atmospheric_conditions": {
    "temperature": {
      "surface_celsius": 20.3,
      "dew_point_celsius": 17.1,
      "min_celsius": 18.0,
      "max_celsius": 23.7
    }
  }
}
```

**Maps to:**
- Main temperature display: `Math.round(temperature.surface_celsius)°C`
- "Feels like": `Math.round(temperature.dew_point_celsius)°C`
- Max/Min: `max_celsius°C / min_celsius°C`

---

### 3. Weather Conditions & Icons

```json
{
  "atmospheric_conditions": {
    "precipitation": {
      "probability": 0.78,
      "type": "rain",
      "intensity_mm_hr": 1.4
    },
    "clouds": {
      "coverage_percent": 88,
      "type": "nimbostratus"
    }
  }
}
```

**Icon Selection Logic:**
```javascript
if (precipitation.probability > 0.7) → "wi-day-rain"
else if (precipitation.probability > 0.4) → "wi-day-showers"
else if (clouds.coverage_percent > 80) → "wi-cloudy"
else if (clouds.coverage_percent > 50) → "wi-day-cloudy"
else if (clouds.coverage_percent > 20) → "wi-day-sunny-overcast"
else → "wi-day-sunny"
```

**Condition Text:**
- "Rainy" if probability > 0.7
- "Showers" if probability > 0.4
- "Cloudy" if coverage > 80%
- "Partly Cloudy" if coverage > 50%
- "Mostly Sunny" if coverage > 20%
- "Sunny" otherwise

---

### 4. Humidity

```json
{
  "atmospheric_conditions": {
    "humidity": {
      "relative_percent": 82,
      "specific_humidity_kg_kg": 0.012
    }
  }
}
```

**Maps to:**
- Humidity display: `Math.round(humidity.relative_percent)%`

---

### 5. Wind

```json
{
  "atmospheric_conditions": {
    "wind": {
      "speed_m_s": 6.4,
      "direction_deg": 140,
      "gusts_m_s": 9.2
    }
  }
}
```

**Maps to:**
- Wind speed: `Math.round(wind.speed_m_s * 3.6) km/h`
  - Conversion: m/s → km/h (multiply by 3.6)

---

### 6. Precipitation Details

```json
{
  "atmospheric_conditions": {
    "precipitation": {
      "probability": 0.78,
      "intensity_mm_hr": 1.4
    }
  }
}
```

**Maps to:**
- Rain probability: `Math.round(precipitation.probability * 100)%`
- Precipitation amount: `precipitation.intensity_mm_hr.toFixed(1) mm/h`

---

### 7. Forecast Summary

```json
{
  "forecast_summary": "Alta probabilidad de lluvia ligera y nubosidad densa, con radiación solar reducida."
}
```

**Maps to:**
- Weather condition text on result page
- Used as descriptive text below temperature

---

### 8. Date & Time

```json
{
  "date": "2025-10-05",
  "time_window": {
    "start": "2025-10-05T14:00:00Z",
    "end": "2025-10-05T18:00:00Z"
  }
}
```

**Processing:**
```javascript
// Day name
new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
// Output: "Monday"

// Short date
new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
// Output: "Oct 5"
```

---

### 9. Additional Data (for future use)

The following data is available but not currently displayed in the UI:

- `solar.irradiance_w_m2` - Solar radiation
- `solar.sunrise` / `solar.sunset` - Sun times
- `pressure.surface_hpa` - Atmospheric pressure
- `lightning.activity_index` - Lightning risk
- `air_quality.aerosol_optical_depth` - Air quality
- `model_output.confidence_score` - Model confidence

These can be easily added to the UI by extending the update functions in `today.js`, `week.js`, or `main.js`.

---

## Activity Recommendations Logic

### Stargazing
```javascript
viable = precipitation.probability < 0.3 && clouds.coverage_percent < 30
```
- Needs clear skies (< 30% clouds)
- Low rain probability (< 30%)

### Park / Eating Out
```javascript
viable = precipitation.probability < 0.5 && wind.speed_m_s < 10
```
- Acceptable rain probability (< 50%)
- Moderate wind (< 10 m/s = 36 km/h)

---

## Weekly Forecast

The weekly endpoint should return an **array of 6-7 objects**, each with the same structure as the single weather data response.

Example:
```json
[
  { "date": "2025-10-06", "atmospheric_conditions": {...} },
  { "date": "2025-10-07", "atmospheric_conditions": {...} },
  { "date": "2025-10-08", "atmospheric_conditions": {...} },
  { "date": "2025-10-09", "atmospheric_conditions": {...} },
  { "date": "2025-10-10", "atmospheric_conditions": {...} },
  { "date": "2025-10-11", "atmospheric_conditions": {...} }
]
```

Each day card displays:
- Day name (e.g., "Monday")
- Date (e.g., "Oct 6")
- Weather icon (based on conditions)
- Condition text (e.g., "Sunny")
- Max/Min temperature
- Rain probability percentage
- Wind speed

---

## Error Handling

If the API call fails:
1. Error logged to console
2. UI keeps placeholder/default content
3. User can still interact with map and select location
4. Navigation and theme switching continue to work

No error messages are shown to the user to maintain a clean UI.
