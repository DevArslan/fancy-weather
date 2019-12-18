const wrapper = document.getElementsByClassName('wrapper')
const blackout = document.createElement('div')
blackout.className = 'blackout'

const settingsNav = document.createElement('div')
settingsNav.className = 'settingsNav'

const refreshBG = document.createElement('div')
refreshBG.className = 'refreshBG'

const languageNav = document.createElement('div')
languageNav.className = 'languageNav'

let selectLanguage = document.createElement('span')
selectLanguage.className = 'selectLanguage'

const languageNavUl = document.createElement('ul')
let languages = ['EN','BE','RU']

const toggleTemp = document.createElement('div')
toggleTemp.className = 'toggleTemp'

const titleBlock = document.createElement('div')
titleBlock.className = 'titleBlock'

let titleBlockCity = document.createElement('p')
titleBlockCity.className = 'titleBlock-city'

let titleBlockDate = document.createElement('p')
titleBlockDate.className = 'titleBlock-date'

const CurrentWeather = document.createElement('div')
CurrentWeather.className = 'currentWeather'

let CurrentWeatherTemp = document.createElement('p')
CurrentWeatherTemp.className = 'currentWeather-temp'

const CurrentWeatherOther = document.createElement('div')
CurrentWeatherOther.className = 'currentWeatherOther'

let CurrentWeatherOtherUl = document.createElement('ul')
let CurrentWeatherOtherList = ['summary','apparentTemperature','windSpeed','humidity']
let listOfCurrentWeatherData = []

const weatherTheOtherDay = document.createElement('div')
weatherTheOtherDay.className = 'weatherTheOtherDay'

let weatherTheFirstDay = document.createElement('div')
weatherTheFirstDay.className = 'weatherTheFirstDay'

let weatherTheSecondDay = document.createElement('div')
weatherTheSecondDay.className = 'weatherTheSecondDay'

let weatherTheThirdDay = document.createElement('div')
weatherTheThirdDay.className = 'weatherTheThirdDay'

let locationArea = document.createElement('div')
locationArea.className = 'locationArea'

let latitude = document.createElement('p')

let longitude = document.createElement('p')

latitudeLatitudeDiv = document.createElement('div')

let mapDiv = document.createElement('div')
mapDiv.id = 'map'



let weatherDaysArray = [weatherTheFirstDay,weatherTheSecondDay,weatherTheThirdDay]

let img = new Image();

let weatherDaysData = []

const week = new Map()
const weekDaysName = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

const months = new Map()
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

function createWeekMap(weekDaysName) {
    for (let i = 0; i < weekDaysName.length; i++){
        week.set(i,weekDaysName[i])
    }
}
createWeekMap(weekDaysName)

function createMonthsMap(monthNames) {
    for (let i = 0; i < monthNames.length; i++) {
        months.set(i,monthNames[i])
    }
}
createMonthsMap(monthNames)


for(day of weatherDaysArray){
    let title = document.createElement('p')
    title.className = weatherTheOtherDay.className + '-title'
    weatherDaysData.push(title)

    let tempValue = document.createElement('p')
    tempValue.className = weatherTheOtherDay.className + '-tempValue'
    weatherDaysData.push(tempValue)

    day.appendChild(title)
    day.appendChild(tempValue)

}

for(item of CurrentWeatherOtherList){

    let itemOfList = document.createElement('li')
    itemOfList.id = item
    itemOfList.className = 'currentWeatherOther-itemList'
    listOfCurrentWeatherData.push(itemOfList)
    CurrentWeatherOtherUl.appendChild(itemOfList)

}

for (language of languages){
    
    let itemOfList = document.createElement('li')
    itemOfList.innerHTML = language
    itemOfList.id = language
    languageNavUl.appendChild(itemOfList)

    itemOfList.addEventListener('click',(event)=>{
        selectLanguage.innerHTML = itemOfList.innerHTML
    })
}

function changeLang(event) {
    languageNav.classList.toggle('open')
}


function getDate() {

    let date = new Date()
    let hours = date.getHours()
    let dayWeek = date.getDay()
    let month = date.getMonth()
    let minutes = date.getMinutes()
    let day = date.getDate() 

    if (minutes<10){
        titleBlockDate.innerHTML = week.get(dayWeek)+' '+day+' '+months.get(month)+' '+hours+':'+'0'+minutes
    }else{
        titleBlockDate.innerHTML = week.get(dayWeek)+' '+day+' '+months.get(month)+' '+hours+':'+minutes
    }

    return dayWeek

}


function refreshBackground() {
    refreshBG.addEventListener('click',getBackgroundImage)
}


function getBackgroundImage(summary) {

    const url = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=${summary}&client_id=be027396046efab6a3dd31ec67219e7de9141cebb208f07bc61465ab1fa01b45`;
    console.log(url)
    fetch(url)
    .then(res => res.json())
    .then(data => { 
        img.src = data.urls.regular 

        img.addEventListener('load',()=>{
            wrapper[0].style.backgroundImage  = `url(${data.urls.regular })`
            wrapper[0].style.backgroundSize  = '100%'
        })
    
    });
}
//! УБРАТЬ затычку 
//wrapper[0].style.backgroundImage  = 'url(src/images/bg3.png)'
//!

function getWeather(func) {

    let currentDay = getDate()

    getLocation()
        .then(data=>{
            let loc = data.loc 
            const WEATHER_ACCESS_KEY = '80fc1d3e3e943d107d8141a435a0adc0'
            //const location = '37.8267,-122.4233'
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const url = `${proxy}https://api.darksky.net/forecast/${WEATHER_ACCESS_KEY}/${loc}`;
            fetch(url)
                .then(res => res.json())
                .then(data =>{
                    console.log(data)
                    CurrentWeatherTemp.innerHTML = Math.ceil(data.currently.temperature)
                    listOfCurrentWeatherData[0].innerHTML = data.currently.summary
                    listOfCurrentWeatherData[1].innerHTML = `feels like: ${data.currently.apparentTemperature}`  
                    listOfCurrentWeatherData[2].innerHTML = `wind: ${data.currently.windSpeed} m/s`
                    listOfCurrentWeatherData[3].innerHTML = `humidity: ${data.currently.humidity*100} %`

                    weatherDaysData[0].innerHTML = week.get(currentDay+1)
                    weatherDaysData[1].innerHTML = Math.ceil(data.daily.data[1].apparentTemperatureHigh)

                    weatherDaysData[2].innerHTML = week.get(currentDay+2)
                    weatherDaysData[3].innerHTML =  Math.ceil(data.daily.data[2].apparentTemperatureHigh)

                    weatherDaysData[4].innerHTML = week.get(currentDay+3)
                    weatherDaysData[5].innerHTML =  Math.ceil(data.daily.data[3].apparentTemperatureHigh)

                    let summary = data.currently.summary
                    getBackgroundImage(summary)




                })
        })
}

function getLocation() {
    const url = 'https://ipinfo.io/json?token=76c358ff16e3b8'
    return fetch(url)
    .then(res => res.json())
    .then(data =>{
        return data
    })
}

function setLocation() {
    
    getLocation()
        .then(data=>{
            titleBlockCity.innerHTML = data.city + ', ' + data.country 
            console.log(data)
            const [x, y] = data.loc.split(',')
            
            latitude.innerHTML = 'latitude: ' + x
            longitude.innerHTML = 'longitude: ' + y
        })
    
}


CurrentWeatherOther.appendChild(CurrentWeatherOtherUl)
CurrentWeather.appendChild(CurrentWeatherTemp)
CurrentWeather.appendChild(CurrentWeatherOther)

weatherTheOtherDay.appendChild(weatherTheFirstDay)
weatherTheOtherDay.appendChild(weatherTheSecondDay)
weatherTheOtherDay.appendChild(weatherTheThirdDay)


selectLanguage.innerHTML = 'EN'

languageNav.addEventListener('click', changeLang)
languageNav.appendChild(selectLanguage)
languageNav.appendChild(languageNavUl)

settingsNav.appendChild(refreshBG)
settingsNav.appendChild(languageNav)
settingsNav.appendChild(toggleTemp)

titleBlock.appendChild(titleBlockCity)
titleBlock.appendChild(titleBlockDate)

locationArea.appendChild(mapDiv)
latitudeLatitudeDiv.appendChild(latitude)
latitudeLatitudeDiv.appendChild(longitude)
locationArea.appendChild(latitudeLatitudeDiv)

wrapper[0].appendChild(blackout)
blackout.appendChild(settingsNav)
blackout.appendChild(titleBlock)
blackout.appendChild(CurrentWeather)
blackout.appendChild(weatherTheOtherDay)
blackout.appendChild(locationArea)


setLocation()
getWeather(getBackgroundImage)

refreshBackground()

setInterval(getDate(), 60000);


let getMap = new Promise((resolve, reject) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGlyZWxpbmciLCJhIjoiY2s0N2U0eDZpMHJxZzNmcGdkcGpodjNsdCJ9.qh2pEJefXkoIMpFYon7gLg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11'
    });
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    );
    setTimeout(()=>{
        resolve ('complete')
    }, 1000);
    
});

getMap
    .then(complete=> {
        
        let locButton = document.getElementsByClassName('mapboxgl-ctrl-geolocate')
        console.log(locButton[0])
        locButton[0].click()
        
    }
    
    
)