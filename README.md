# Tesla Doors Visual Card

A custom Home Assistant card that visualizes your Tesla Model 3 status (doors, trunk, frunk, charging) with realistic layered images.

## Installation

1. This repository is HACS compliant.
2. Add this repository URL to HACS > Frontend > Custom repositories.
3. Install "Tesla Doors Visual".
4. **IMPORTANT:** You must upload the images to `/config/www/tesla_doors/`.

## 💻 Ultimate Cockpit (Desktop / Tablet)

This is the full experience with 3D visuals, climate controls, tire pressure, and location map. Best viewed on a tablet or desktop.

```yaml
type: vertical-stack
cards:
  # 1. VISUAL 3D
  - type: custom:tesla-doors-visual
    entity: sensor.dream_battery_level
    image_path: https://raw.githubusercontent.com/krotos007/tesla-visual-card/master/images/
    height: 260

  # ... (Copy the full code from tesla_cockpit_supremo.yaml)
```

[View Full Desktop Code](https://github.com/krotos007/tesla-visual-card/blob/master/tesla_cockpit_supremo.yaml) *(You can host this file in the repo or just copy from HACS description if possible, but for now I will put minimal example and link to the file added to repo)*

## 📱 Mobile Optimized (Big Buttons)

Designed for phones with larger touch targets (2-column grid) and compact layout.

```yaml
type: vertical-stack
cards:
  # 1. VISUAL 3D (Compact)
  - type: custom:tesla-doors-visual
    entity: sensor.dream_battery_level
    image_path: https://raw.githubusercontent.com/krotos007/tesla-visual-card/master/images/
    height: 220

  # ... (Copy the full code from tesla_mobile_optimized.yaml)
```

## Credits

This card is based on the excellent work by **[threesquare](https://github.com/threesquare/Tesla-doors-visual)**.
This repository was created to make the installation process easier via HACS by organizing the files into a compliant structure and adding mobile-optimized configurations.
