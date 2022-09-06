class ArcSensor {
    static RAINBOW_GRADIENT = 'gradient1'
    static WATER_GRADIENT = 'gradient2'

    constructor(_elem, _settings) {
        if (!_elem) {
            throw "Небыл передан элемент!"
        }

        this.elem = _elem
        this.settings = _settings

        if (!this.#searchHidden()) {
            this.#addHiddenSvgGradients()
        }

        let html = `
            <svg viewBox="0 0 95 60">
                    <path fill="none" class="gradient" d="M5,50 A40,40 0 1,1 90,50" style="stroke: url(#${this.settings.gradient});"></path>
                    <path fill="none" class="pointer" d="M5,50 A40,40 0 1,1 90,50"></path>
            </svg>
            <div class="value"><span>0</span>${this.settings.measure ? ' ' + this.settings.measure : ''}</div>
            <div class="name_sensor">${this.settings.name}</div>
            <div class="min_value">${this.settings.min}</div>
            <div class="max_value">${this.settings.max}</div>
        `

        this.elem.insertAdjacentHTML('beforeend', html)
    }

    update(value) {
        const indicatorVal = this.#getIndicatorVal(value)
        this.elem.style.setProperty('--percent', indicatorVal);
        value = parseFloat(value).toFixed(this.settings.toFixed)
        this.elem.querySelector('.value span').innerHTML = value
    }

    #getIndicatorVal(value) {
        if (value <= this.settings.min) {
            return 134
        }
        if (value >= this.settings.max) {
            return 1
        }

        const k = 134 / (this.settings.max - this.settings.min)     // коэф

        let tempVal = value - this.settings.min

        let res = Math.round(tempVal * k)   // от 1 до 134
        res = Math.abs(res - 134) + 1   // от 134 до 1

        return res
    }

    #addHiddenSvgGradients() {
        let hiddenSvgGradients = `
            <svg width="0" height="0" id="sensor_gradients">
                <defs>
                    <linearGradient id="gradient1" x1="0" y1="0" x2="100%" y2="0">
                        <stop offset="0%" stop-color="#0392ce"></stop>
                        <stop offset="25%" stop-color="#00f044"></stop>
                        <stop offset="60%" stop-color="#feff35"></stop>
                        <stop offset="100%" stop-color="#fd5306"></stop>
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0" y1="0" x2="100%" y2="0">
                        <stop offset="0%" stop-color="#66d4fb" />
                        <stop offset="100%" stop-color="#0baeff" />
                    </linearGradient>
                </defs>
            </svg>
        `

        document.querySelector('body').insertAdjacentHTML('beforeend', hiddenSvgGradients)
    }

    #searchHidden() {
        const $svgGradients = document.querySelector('#sensor_gradients')

        return $svgGradients ? true : false
    }
}