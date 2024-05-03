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
            getExpectedValue(data, option)
        })
        .then(()=>{
            buttons = document.querySelector('.app__buttons')
            buttons.addEventListener('click', buttonsEventHandler)
        })
        .catch(err => {
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
    Object.keys(ratings).forEach(rating => {
        let element = document.querySelector(`[data-param=${rating}]`)
        option === 0 && rating === 'quality' ? showUntilLeft(element, ratings[rating], countOfMarks) : element.querySelector('.app__count-container').classList.add('hidden')
        ratings[rating] = ratings[rating] / countOfMarks
        element.querySelector(`[data-param=${rating}] .app__mark`).textContent = `${ratings[rating].toFixed(1)}/5`
        element.querySelector('.app__progress').style = `width: ${ratings[rating] / 5 * 100}%`
        ratings[rating] = 0
    })
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
        document.querySelector('.app').innerHTML +=
            '<div class="app__quality" data-param=\'' + el.id + '\'>\n' +
            '        <div class="app__param">\n' +
            '            <div>' + el.text + '</div>\n' +
            '            <div>-</div>\n' +
            '            <div class="app__mark">2/5</div>\n' +
            '        </div>\n' +
            '        <div class="app__progress" data-color=\'' + el.id + '\'></div>\n' +
            '        <div class="app__count-container">\n' +
            '            5 до 4\n' +
            '            <div>\n' +
            '                -\n' +
            '            </div>\n' +
            '            <div class="app__count">\n' +
            '                12\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>'
    })
    return outputObject
}




await getData()





