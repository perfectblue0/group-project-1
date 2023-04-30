const input=document.querySelector("#input");
const searchButton=document.querySelector("#search");
const histButton=document.querySelector("#history");
const errorSection=document.querySelector("#errors");
const resultsSection=document.querySelector("#results");
const history=JSON.parse(localStorage.getItem('searches')) || [];
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var content = document.querySelector(".modal-body")

const url = 'http://en.wikipedia.org/w/api.php';
const params={
    origin:'*',
    format:'json',
    action:'query',
    prop:'extracts',
    exchars:250,
    exintro:true,
    explaintext:true,
    generator:'search',
    gsrlimit:20,

}
const disableUi=()=>{
    input.disabled=true;
    searchButton.disabled=true;
}
const enableUi=()=>{
    input.disabled=false;
    searchButton.disabled=false;
}
const clearPrev=()=>{
    resultsSection.innerHTML="";
    errorSection.innerHTML="";

}

const isEmpty=input=>{
    if(!input || input===''){
        return true;
    }
    else{
        return false;
    }

}
const showError= error =>{
    errorSection.innerHTML='🚨'+ error +'🚨';
}

const showResults = results => {
    results.forEach(result => {
        resultsSection.innerHTML += `
        <div class="results__item">
            <a href="https://en.wikipedia.org/?curid=${result.pageId}" target="_blank" class="card animated bounceInUp">
                <h2 class="results__item__title">${result.title}</h2>
                <p class="results__item__intro">${result.intro}</p>
            </a>
        </div>
    `;
    });
};
const gatherData = pages => {
    const results = Object.values(pages).map(page => ({
        pageId: page.pageid,
        title: page.title,
        intro: page.extract,
    }));

    showResults(results);
};


const getData=async ()=>{
    const userInput=input.value;
    history.push(userInput);
    localStorage.setItem("searches",JSON.stringify(history) );
   
    if(isEmpty(userInput)) return;
    params.gsrsearch = userInput;
    disableUi();
    clearPrev();

    try{
   const {data}= await axios.get(url,{params});
   if(data.error) throw new Error(data.error.info);
   gatherData(data.query.pages);
    }catch(error){
        showError(error); 
    } finally{
        enableUi();
    }
  
}
const handleKeyEvent=(e)=>{
    if (e.key === 'Enter'){
        getData();

    }

}
const registerEventHandlers= () =>{
    input.addEventListener('keydown', handleKeyEvent);
    searchButton.addEventListener('click', getData);
    histButton.addEventListener('click', getHistory);

}
const getHistory= () =>{
    var temp= JSON.parse(localStorage.getItem("searches"));
    content.innerHTML=temp;  
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  // Clears History Function
  const clearHistory = function() {
    localStorage.clear();
    history.length = 0;
}
// Clears History Button
clear.addEventListener("click", clearHistory);

registerEventHandlers();


// weather

// city and units
var currentC = "Tokyo";
var uni = "imperial";

// country code to name
function convCounCode(coun){
    let regNames = new Intl.DisplayNames(["en"], {type:"region"});
    return regNames.of(coun);
}
// query selectors
var wCity = document.querySelector(".weatherCity");
var dateNTime = document.querySelector(".weatherDateT");
var weatherCond = document.querySelector(".weatherCondition");
var weatherTemp = document.querySelector(".weatherTemp");
var weatherIcon = document.querySelector(".weatherIcon");
var weatherMinMax = document.querySelector(".weatherMinMax");

// search bar event listener!
document.querySelector(".weatherSearch").addEventListener('submit', e => {
    var look = document.querySelector(".weatherSearchForm");
    e.preventDefault();
    currentC = look.value;
    weatherGet();
    look.value = "";
});

// unit event listener will change to fahrenheit or celsius
document.querySelector(".unit-weather-celsius").addEventListener('click', () => {
    if (uni !== "metric") {
        uni = "metric";
        weatherGet();
    }
});

document.querySelector(".unit-weather-fahrenheit").addEventListener('click', () => {
    if (uni !== "imperial") {
        uni = "imperial";
        weatherGet(); 
    }
});

// BUGS :( converts unix timestamp to user friendly readable type 

/*function convUnixTime(stamp, timezone) {
    // seconds -> hours
    const convZone = timezone / 3600;
    const cDate = new Date(stamp * 1000);

    const choices = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timezone: `Etc/GMT${convZone>=0?"-":"+"}${Math.abs(convZone)}`,
        hour12: true,
    }
    return cDate.toLocaleString("en-US", choices);
};
*/

// function gets weather data, time, 
function weatherGet() {

    const apiKey = "63adc119973bfcef9d6eddaf4a6374cf";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentC}&appid=${apiKey}&units=${uni}`).then(resp=>resp.json()).then(info=> {
    console.log(info);
    wCity.innerHTML = `${info.name}, ${convCounCode(info.sys.country)}`;
    // BUGS :( dateNTime.innerHTML = convUnixTime(info.dt,info.timezone);
    weatherCond.innerHTML = `<p>${info.weather[0].main}`;
    weatherTemp.innerHTML = `${info.main.temp.toFixed()}&#176`;
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png"/>`;

    weatherMinMax.innerHTML = `<p>Min: ${info.main.temp_min.toFixed()}&#176</p><p>Max: ${info.main.temp_max.toFixed()}&#176</p>`;

    });
};

document.body.addEventListener('load', weatherGet());