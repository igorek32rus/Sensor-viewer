const $tempSensor = document.querySelector('#sensors div[name="temperature"]')
const $humSensor = document.querySelector('#sensors div[name="humidity"]')
const $outsideTemp = document.querySelector('#sensors div[name="outsideTemp"]')

const tempSensor = new ArcSensor($tempSensor, {
    gradient: ArcSensor.RAINBOW_GRADIENT,   // имя градиента
    min: 15,                                // мин значение индикатора
    max: 30,                                // макс значение индикатора
    measure: '&deg;C',                      // ед измерения
    name: 'Температура',                    // имя датчика
    toFixed: 1                              // кол-во знаков после запятой, 0 - целое
})

const humSensor = new ArcSensor($humSensor, {
    gradient: ArcSensor.WATER_GRADIENT,
    min: 0,
    max: 100,
    measure: '%',
    name: 'Влажность',
    toFixed: 0
})

const outsideSensor = new ArcSensor($outsideTemp, {
    gradient: ArcSensor.RAINBOW_GRADIENT,
    min: -5,
    max: 35,
    measure: '&deg;C',
    name: 'Температура',
    toFixed: 2
})

const getData = async () => {
    try {
        const response = await fetch("./data.json")
        return await response.json()
    } catch(e) {
        throw e
    }
}

const timestampToDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    }
}

async function updateData() {
    const fullData = await getData()
    const data = fullData.last
    tempSensor.update(data.temp)
    humSensor.update(data.hum)
    outsideSensor.update(data.outside)
    const date = timestampToDate(fullData.last.timestamp)
    console.log(`${date.day}.${date.month}.${date.year} ${date.hours}:${date.minutes}:${date.seconds}`)
}

setInterval(() => {
    updateData()
}, 60000)

updateData()
