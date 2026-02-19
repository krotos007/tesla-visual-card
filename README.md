# Tesla Doors Visual Card

A custom Home Assistant card that visualizes your Tesla Model 3 status (doors, trunk, frunk, charging) with realistic layered images.

## Installation

1. This repository is HACS compliant.
2. Add this repository URL to HACS > Frontend > Custom repositories.
3. Install "Tesla Doors Visual".
4. **IMPORTANT:** You must upload the images to `/config/www/tesla_doors/`.

## Configuration

type: custom:tesla-doors-visual
entity: sensor.dream_battery_level
image_path: /local/tesla_doors/
height: 250

```

## Credits

This card is based on the excellent work by **[threesquare](https://github.com/threesquare/Tesla-doors-visual)**.
This repository was created to make the installation process easier via HACS by organizing the files into a compliant structure.

All credit for the original design and logic goes to the original author.

