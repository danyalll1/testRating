import '/public/styles.css'

let buttons = document.querySelector('.app__buttons')
let option = Number(buttons.querySelector('.active').dataset.option)
let ratings = {}
let leftUntilFour = 4
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
            ratings = getRatingOptions(data)
            setRatingsInnerHtml(data)
            getExpectedValue(data, option)
        })
        .then(()=>{

        })
        .catch(err => {
            console.log(err);
            return null
        });
}

function filterByDate(data, days) {
    const currentDate = new Date();
    if (days === 0) {
        return data
    } else {
        return data.filter(item => new Date(item.created_at).getTime() >= currentDate.getTime() - days * 24 * 60 * 60 * 1000)
    }


}

function getExpectedValue(data, option) {
    let filteredData = filterByDate(data, option)
    let countOfMarks = filteredData.length
    filteredData.forEach(el => {
        el.ratings.forEach(item => {
            ratings[item.id] += item.rating
        })
    })

    for(let key  in ratings){
        let element = document.querySelector(`[data-param=${key}]`)
        option === 0 && key === 'quality' ? showUntilLeft(element, ratings[key], countOfMarks) : element.querySelector('.app__count-container').classList.add('hidden')
        ratings[key] = ratings[key] / countOfMarks
        element.querySelector(`[data-param=${key}] .app__mark`).textContent = `${ratings[key].toFixed(1)}/5`
        element.querySelector('.app__progress').style = `width: ${ratings[key] / 5 * 100}%`
        ratings[key] = 0
    }
}

function showUntilLeft(element, param, count) {
    element.querySelector('.app__count').textContent = leftUntil(param, leftUntilFour, count)
    element.querySelector('.app__count-container').classList.remove('hidden')
}


function leftUntil(currRating, num, count) {
    let i = 0
    while (currRating / count < num) {
        currRating += 5
        i++
    }
    return i
}

function buttonsEventHandler(event) {
    if (event.target.closest('.app__button')) {
        buttons.querySelectorAll('.app__button').forEach(el => {
            el.classList.remove('active')
        })
        event.target.classList.add('active')
        option = Number(event.target.dataset.option)
        getExpectedValue(data, option)
    }
}

function getRatingOptions(arrayOfElements) {
    let outputObject = {}
    arrayOfElements[0].ratings.forEach(el =>{
        outputObject[el.id] = 0
    })
    return outputObject
}

function setRatingsInnerHtml(arrayOfElements){
    arrayOfElements[0].ratings.forEach(el =>{
        document.querySelector('.app').insertAdjacentHTML('beforeend',
            `<div class="app__quality" data-param=${el.id}>
                    <div class="app__param">
                       <div>${el.text}</div>
                       <div>-</div>
                        <div class="app__mark">2/5</div>
                   </div>
                    <div class="app__progress" data-color=${el.id}></div>
                    <div class="app__count-container">
                        5 до 4
                        <div>
                           -
                        </div>
                        <div class="app__count">
                            12
                        </div>
                    </div>
                </div>`
        )
    })

}

await getData()
buttons = document.querySelector('.app__buttons')
buttons.addEventListener('click', buttonsEventHandler)



