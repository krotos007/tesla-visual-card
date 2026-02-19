class TeslaCard extends HTMLElement {
    set hass(hass) {
        if (!this._initialized) {
            this._initialize();
        }
        this._hass = hass;
        this._updateCard();
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('Please define an entity');
        }
        this.config = {
            ...config,
            height: config.height || 280,
            background: config.background || 'rgba(0, 0, 0, 0)',
            image_width: config.image_width || '100%',
            image_path: config.image_path || '/local/tesla_doors/'
        };
    }

    _initialize() {
        this._initialized = true;
        const card = document.createElement('ha-card');
        card.style.cssText = `
      background: ${this.config.background};
      border-radius: 12px;
      overflow: hidden;
      padding: 0;
      box-shadow: none;
      position: relative;
      width: 100%;
      height: ${this.config.height}px;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
        this.appendChild(card);
        this._card = card;
    }

    _updateCard() {
        if (!this._hass || !this.config) return;

        // --- ENTITY MAPPING ---
        // Tenta encontrar o estado em várias variações de nomes comuns na integração Tesla Fleet
        const carState =
            this._hass.states['sensor.dream_charging']?.state?.toLowerCase() ||
            this._hass.states['sensor.dream_state']?.state?.toLowerCase();

        const shiftState =
            this._hass.states['sensor.dream_shift_state']?.state ||
            this._hass.states['sensor.dream_shift_state_2']?.state ||
            this._hass.states['sensor.dream_shift_state_3']?.state ||
            'P'; // Default to Park
        // Charge cable sensor (often binary_sensor.dream_charger_connected)
        // If unavailable, we infer from carState
        const chargeCable = (carState === 'charging' || carState === 'complete' || carState === 'stopped') ? 'on' : 'off';

        // Doors & Covers (Tesla Fleet uses 'open'/'closed' or 'on'/'off')
        // Helper function to try variations
        const getState = (base) => {
            return this._hass.states[base]?.state ||
                this._hass.states[`${base}_2`]?.state ||
                this._hass.states[`${base}_3`]?.state;
        };

        const frunk = getState('cover.dream_frunk');
        const trunk = getState('cover.dream_trunk');
        const frontDriver = getState('binary_sensor.dream_front_driver_door');
        const frontPass = getState('binary_sensor.dream_front_passenger_door');
        const rearDriver = getState('binary_sensor.dream_rear_driver_door');
        const rearPass = getState('binary_sensor.dream_rear_passenger_door');

        // Helper booleans
        const isCharging = carState === 'charging';
        const isPlugged = chargeCable === 'on';
        const isDriving = shiftState && shiftState !== 'p' && shiftState !== 'P' && shiftState !== 'park';

        const flOpen = frontDriver === 'on' || frontDriver === 'open';
        const frOpen = frontPass === 'on' || frontPass === 'open';
        const rlOpen = rearDriver === 'on' || rearDriver === 'open';
        const rrOpen = rearPass === 'on' || rearPass === 'open';
        const trunkOpen = trunk === 'open';
        const frunkOpen = frunk === 'open';
        const flRlBothOpen = flOpen && rlOpen;

        const path = this.config.image_path;
        let layers = [];

        // --- LOGIC START ---

        // 1. Driving Mode (Overrides everything)
        if (isDriving) {
            layers.push(`<img src="${path}driving.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:1;">`);
        }
        // 2. Charging / Plugged In
        else if (isPlugged) {
            // BASE IMAGE
            if (frunkOpen) {
                layers.push(`<img src="${path}frunk_base.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:1;">`);
            } else {
                layers.push(`<img src="${path}plug.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:1;">`);
            }

            // OVERLAYS
            if (flRlBothOpen) {
                layers.push(`<img src="${path}plug_FLRL.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:5;">`);
            } else {
                if (flOpen) layers.push(`<img src="${path}plug_FL.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:5;">`);
                if (rlOpen) layers.push(`<img src="${path}plug_RL.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:5;">`);
            }

            if (frOpen) layers.push(`<img src="${path}plug_FR.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:4;">`);
            if (rrOpen) layers.push(`<img src="${path}plug_RR.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:4;">`);
            if (trunkOpen) layers.push(`<img src="${path}plug_trunk.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:6;">`);

            if (isCharging) {
                layers.push(`<img src="${path}charging.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:7;">`);
            }
        }
        // 3. Parked (Not Plugged)
        else {
            // BASE IMAGE
            if (trunkOpen) {
                layers.push(`<img src="${path}trunk_base.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:1;">`);
            } else {
                layers.push(`<img src="${path}base.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:1;">`);
            }

            // OVERLAYS
            if (flRlBothOpen) {
                layers.push(`<img src="${path}flrl.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:5;">`);
            } else {
                if (flOpen) layers.push(`<img src="${path}fl.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:5;">`);
                if (rlOpen) layers.push(`<img src="${path}rl.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:5;">`);
            }

            if (frOpen) layers.push(`<img src="${path}fr.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:4;">`);
            if (rrOpen) layers.push(`<img src="${path}rr.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:4;">`);
            if (frunkOpen) layers.push(`<img src="${path}frunk.png" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:6;">`);
        }

        this._card.innerHTML = layers.join('');
    }
}

customElements.define('tesla-doors-visual', TeslaCard);
