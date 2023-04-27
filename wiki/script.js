const input=document.querySelector("#input");
const searchButton=document.querySelector("#search");
const errorSection=document.querySelector("#errors");
const resultsSection=document.querySelector("#results");


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
    if(isEmpty(userInput)) return;
    //console.log(userInput);
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

}



registerEventHandlers();

