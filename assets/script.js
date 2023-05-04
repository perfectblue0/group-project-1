const input=document.querySelector("#input");
const searchButton=document.querySelector("#search");
const histButton=document.querySelector("#history");
const clearButton=document.querySelector("#clear");
const errorSection=document.querySelector("#errors");
const resultsSection=document.querySelector("#results");
const history=JSON.parse(localStorage.getItem('searches')) || [];
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var content = document.querySelector(".modal-body")
var dateTime = new Date();
function updateTime() {
  const dateTime = new Date();
  const DT = dateTime.toLocaleString();
  document.getElementById('date-time').innerHTML = DT;
}

// Update time every second
setInterval(updateTime, 1000);
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
    clearButton.addEventListener('click', clearHistory)

}
const getHistory= () =>{
    var temp= JSON.parse(localStorage.getItem("searches"));
    content.innerHTML=temp;  
    modal.style.display = "block";
}
const clearHistory= () =>{
    localStorage.clear();
    history.length=0;
    var message="No searches in history";
    if(history.length==0){
        content.innerHTML=message;

    }
    return;
  }
span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

registerEventHandlers();


// dog section

const img = document.getElementById('dogImg');
const dogBtn = document.getElementById("dogBtn");

const randDog = function() {
    fetch("https://dog.ceo/api/breeds/image/random")
    .then((res) => res.json())
    .then((data) => {
        img.innerHTML = `<img src='${data.message}'/>`;
    });
};

dogBtn.addEventListener("click", randDog);