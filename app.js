// input field script
const input = document.querySelector('.text-input input');
const placeholderText = document.querySelector('.placeholder-text');

input.addEventListener('input', (e)=>{
    let inputVal = e.target.value;
    handlePlaceholderText(inputVal);
    inputValidation(inputVal);
});

function handlePlaceholderText(inputVal){
    if(inputVal)
     placeholderText.classList.add('placeholder-text-close');
    else
    placeholderText.classList.remove('placeholder-text-close');
}

function inputValidation(inputVal){
    if (!/^[a-zA-Z\s]*$/.test(inputVal) && inputVal.length>1){
        input.style.boxShadow = '0px 0px 8px 0px tomato';
        return 0;
    }
    else
    {
        input.style.boxShadow = '';
        return 1;
    }
}

// render main content out

let countryInfoContainer = document.querySelector('.country-info-container');
countryInfoContainer.innerHTML = "";

async function fectchAPI(){
    const baseURL = 'https://restcountries.com/v2/all';
    const response = await fetch(baseURL);
    const data = await response.json();

    // render country info cards for the home-screen
    renderHome(data);
    document.querySelector('.loader').classList.add('hidden');
    // listen to text-input
    searchInputRender(data);
    // filter based on select drop down
    filterRender(data);
}

function renderCountryInfo(data){
    let html = '';
    html = 
    `
    <div class="country-info-card bg-light-1 tran-bg">
        <div class="country-image-container">
            <img src="${data.flag}" alt="flag-icon">
        </div>
        <div class="country-text-info txt-light tran-txt">
            <h3>${data.name}</h3>
            <ul>
                <li><span>Population:</span> ${addComma(data.population)}</li>
                <li><span>Region:</span> <span class="region-info">${data.region}</span></li>
                <li><span>Capital:</span> ${data.subregion}</li>
            </ul>
        </div>
    </div>
     `
    countryInfoContainer.innerHTML += html;
}

function renderCountryExpandInfo(data){
    document.querySelector('.input-container').classList.add('close');
    document.querySelector('.country-info-container').classList.add('close');
    let rootEl = document.querySelector('.content');
    let html = '';
    html = 
    `
    <div class="flag-image-container">
        <img src="${data.flag}" alt="flag-icon">
    </div>
    <div class="text-info-content">
        <div class="list-info-content">
            <div class="list-1">
                <h3>${data.name}</h3>
                <ul>
                    <li><span>Native Name:</span> ${data.nativeName}</li>
                    <li><span>Population:</span> ${addComma(data.population)}</li>
                    <li><span>Region:</span> ${data.region}</li>
                    <li><span>Sub Region:</span> ${data.subregion}</li>
                    <li><span>Capital:</span> ${data.capital}</li>
                </ul>
            </div>
            <div class="list-2">
                <ul>
                    <li><span>Top Level Domain:</span> ${data.topLevelDomain[0]}</li>
                    <li><span>Currencies:</span> ${data.currencies.map(currency => currency.code)}</li>
                    <li><span>Languages:</span> ${data.languages.map(language => language.name)}</li>
                </ul>
            </div>
        </div>
    </div>
    `
    rootEl.innerHTML += html;
}

function renderHome(data){
    let x = 0;
    while(x < data.length){
        renderCountryInfo(data[x]);
        x++;
    }

    document.querySelectorAll('.country-info-card h3').forEach(link => {
        link.addEventListener('click', (e)=>{
            let x = 0;
            while(x < data.length){
                if(e.target.innerText === data[x].name){
                    document.querySelector('.country-info-expand').style.display = 'flex';
                    renderCountryExpandInfo(data[x]);
                    document.querySelector('.country-info-expand .back-btn').addEventListener('click', ()=>{
                        document.querySelector('.content').innerHTML = '';
                        document.querySelector('.country-info-expand').style.display = 'none';
                        document.querySelector('.input-container').classList.remove('close');
                        document.querySelector('.country-info-container').classList.remove('close');
                    })
                }
                x++;
            }
        })
    })
    themeToggle();
}

function searchInputRender(data){
    document.querySelector('.country-name-input').addEventListener('input', (e)=>{
        document.querySelector('.select-input select').value = document.querySelector('.select-input select').options[0].value;
        let inpText = e.target.value;
        document.querySelectorAll('.country-info-card h3').forEach(head => {
            if(!head.innerText.toLowerCase().includes(inpText.toLowerCase())){
                head.parentNode.parentNode.style.display = 'none';
            }
            else
            {
                if(document.querySelector('.error').style.display = 'block'){
                    document.querySelector('.error').style.display = 'none';
                }
                head.parentNode.parentNode.style.display = 'block';
            }
        })
        if([...document.querySelectorAll('.country-info-card')].every(card => card.style.display === 'none'))
        {
            document.querySelector('.error').style.display= 'flex';
        }
    })
}

function filterRender(data){
    let select = document.querySelector('.select-input select');
    let inp = document.querySelector('.country-name-input');
    select.addEventListener('input', ()=>{
        inp.value = '';
        handlePlaceholderText(inp.value);
        let value = select.options[select.selectedIndex].value;
        document.querySelectorAll('.region-info').forEach(head => {
            if(value === 'All'){
                document.querySelectorAll('.country-info-card').forEach(card => card.style.display = 'block');
            }
            else if(!head.innerText.toLowerCase().includes(value.toLowerCase())){
                head.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            }
            else
            {
                head.parentNode.parentNode.parentNode.parentNode.style.display = 'block';
            }
        })
    })
}

function addComma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// theme toggler script

function themeToggle(){
    const themeTogglerContainer = document.querySelector('.theme-toggler-container');
    const bgLight1 = document.querySelectorAll('.bg-light-1');
    const bgLight2 = document.querySelectorAll('.bg-light-2');
    const txtLight = document.querySelectorAll('.txt-light');
    const moonLight = document.querySelector('.moon-light');
    const moonDark = document.querySelector('.moon-dark');
    themeTogglerContainer.addEventListener('click', ()=>{
        bgLight1.forEach(bg => bg.classList.toggle('bg-dark-1'));
        bgLight2.forEach(bg => bg.classList.toggle('bg-dark-2'));
        txtLight.forEach(tx => tx.classList.toggle('txt-dark'));
        moonLight.classList.toggle('moon-light-close');
        moonDark.classList.toggle('moon-dark-open');
    });
}

fectchAPI();