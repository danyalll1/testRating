import '/public/styles.css'
const tracks = document.querySelectorAll('[data-param]')
const  buttons = document.querySelector('.app__buttons')
let option = Number(buttons.querySelector('.active').dataset.option)
let ratings = getRatingOptions(tracks)
let data

async function getData() {
    return fetch('users.json')

        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })

        .then(res => {
            data = res.data.items
            getExpectedValue(data, option)
        })

        .catch(err => {
            return null
        });
}
function filterByDate(data, days) {
    const currentDate = new Date();
    if (days === 0){
        return data
    }else{
        return data.filter(item => new Date(item.created_at).getDate() >= currentDate.getDate() - days)
    }


}
function getExpectedValue(data, option) {
    let filteredData = filterByDate(data,option)
    let countOfMarks = filteredData.length
    filteredData.forEach(el => {
        el.ratings.forEach(item => {
            switch (item.text) {
                case "качество товара":
                    ratings.quality += item.rating
                    break
                case "вид товара":
                    ratings.visual += item.rating
                    break
                case "удобство товара":
                    ratings.ergonomic += item.rating
                    break
            }

        })
    })
    Object.keys(ratings).forEach(rating=>{
        let element = document.querySelector(`[data-param=${rating}]`)
        console.log(rating)
        option === 0 && rating === 'quality' ?  showUntilLeft(element,ratings[rating],countOfMarks) : element.querySelector('.app__count-container').classList.add('hidden')
        ratings[rating] = ratings[rating] / countOfMarks
        element.querySelector(`[data-param=${rating}] .app__mark`).textContent = `${ratings[rating].toFixed(1)}/5`
        element.querySelector('.app__progress').style = `width: ${ratings[rating]/5*100}%`
        ratings[rating] = 0
    })
}

function showUntilLeft(element, param, count){
    element.querySelector('.app__count').textContent = leftUntil(param,4,count)
    element.querySelector('.app__count-container').classList.remove('hidden')
}


function leftUntil(currRating,num, count){
    let i = 0
    while (currRating/count < num){
        currRating +=5
        i++
    }
    return i
}

function buttonsEventHandler(event){
    if(event.target.closest('.app__button')){
        buttons.querySelectorAll('.app__button').forEach(el =>{
            el.classList.remove('active')
        })
        event.target.classList.add('active')
        option = Number(event.target.dataset.option)
        getExpectedValue(data, option)
    }
}
function getRatingOptions (arrayOfElements){
    let outputObject ={}
    arrayOfElements.forEach(el=>{
        outputObject[el.dataset.param] = 0
    })
    return outputObject
}

getRatingOptions(tracks)

buttons.addEventListener('click', buttonsEventHandler)

await getData()




