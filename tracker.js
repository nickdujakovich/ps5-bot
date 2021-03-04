const axios = require('axios');
const player = require('play-sound')(opts = {})
const tynt = require('tynt');
const fs = require('fs');
const { get } = require('http');

// [ OPTIONS ]
// ~ WEBSITES
const sonyDirectPS5 = 'https://direct-queue.playstation.com/?c=sonyied&e=psdirectprodku1&ver=v3-javascript-3.6.3&cver=144&man=PS%20Direct%20Prod%20KU%20Action&t=https%3A%2F%2Fdirect.playstation.com%2Fen-us%2Fhardware%2Fps5&kupver=akamai-1.0.2'
const bestbuyPS5 = 'https://www.bestbuy.com/api/tcfb/model.json?paths=%5B%5B%22shop%22%2C%22magellan%22%2C%22v1%22%2C%22item%22%2C%22skus%22%2C%226426149%22%5D%5D&method=get'
const bestbuyPS5Digital = 'https://www.bestbuy.com/api/tcfb/model.json?paths=%5B%5B%22shop%22%2C%22magellan%22%2C%22v1%22%2C%22item%22%2C%22skus%22%2C%226430161%22%5D%5D&method=get'
const walmartPS5 = 'https://www.walmart.com/ip/PlayStation-5-Console/363472942'
const walmartPS5Digital = 'https://www.walmart.com/ip/Sony-PlayStation-5-Digital-Edition/493824815'
const targetPS5 = 'https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?key=ff457966e64d5e877fdbad070f276d18ecec4a01&tcin=81114595&store_id=1764&store_positions_store_id=1764&has_store_positions_store_id=true&zip=75093&state=TX&latitude=33.050&longitude=-96.850&scheduled_delivery_store_id=1764&pricing_store_id=1764&fulfillment_test_mode=grocery_opu_team_member_test&is_bot=false'
const targetPS5Digital = 'https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?key=ff457966e64d5e877fdbad070f276d18ecec4a01&tcin=81114596&store_id=1764&store_positions_store_id=1764&has_store_positions_store_id=true&zip=75093&state=TX&latitude=33.050&longitude=-96.850&scheduled_delivery_store_id=1764&pricing_store_id=1764&fulfillment_test_mode=grocery_opu_team_member_test&is_bot=false'
const targetController = 'https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?key=ff457966e64d5e877fdbad070f276d18ecec4a01&tcin=81114477&store_id=1764&store_positions_store_id=1764&has_store_positions_store_id=true&zip=75093&state=TX&latitude=33.050&longitude=-96.850&scheduled_delivery_store_id=1764&pricing_store_id=1764&fulfillment_test_mode=grocery_opu_team_member_test&is_bot=false'
// ~ SOUND
const audio = 'alert.mp3';
// ~ TIME TO REFRESH (seconds)
const refreshTime = 10


let tries = 0

function getTime() {
    var d = new Date(),
        minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
        hours = d.getHours() > 12 ? d.getHours()-12 : d.getHours(),
        ampm = d.getHours() >= 12 ? 'pm' : 'am',
        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function timeCountdown() {
    let spaces = ' '
    for(let time = refreshTime - 1; time >= 0; time--) {
        process.stdout.write(tynt.Yellow("Refreshing in " + time) + spaces);
        await sleep(1000);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        spaces = spaces + ' '
    }
}

function checkBestBuyPS5() {
    return axios.get(bestbuyPS5)
            .then((res) => {
                let result
                if(isSuccess = res.data.jsonGraph.shop.magellan.v1.item.skus['6426149'].value.omsOrderable === true) {
                    result = tynt.Green('IN STOCK')
                    fs.appendFile('successResults.txt', getTime() + ' ---- Best Buy PS5 - IN STOCK\n', function (err) {
                        if (err) throw err;
                    });
                    //player.play(audio, (err) => console.log(err))
                } else {
                    result = tynt.Red('Out Of Stock')
                }
                console.log(getTime(), '-----BestBuy PS5\t\t\t', result)
            })
            .catch((err) => {
                console.log('BestBuy ps5 error')
                console.log(err)
            })
}

function checkBestBuyPS5Digital() {
    return axios.get(bestbuyPS5Digital)
            .then((res) => {
                let result
                if(res.data.jsonGraph.shop.magellan.v1.item.skus['6430161'].value.omsOrderable === true) {
                    result = tynt.Green('IN STOCK')
                    fs.appendFile('successResults.txt', getTime() + ' ---- Best Buy PS5 Digital - IN STOCK\n', function (err) {
                        if (err) throw err;
                    });
                    player.play(audio, (err) => console.log(err))
                } else {
                    result = tynt.Red('Out Of Stock')
                }
                console.log(getTime(), '-----BestBuy PS5 Digital\t\t', result)
            })
            .catch((err) => {
                console.log('BestBuy ps5 digital error')
                console.log(err)
            })
}

function checkTargetPS5() {
    return axios.get(targetPS5)
            .then((res) => {
                let result
                if(res.data.data.product.fulfillment.shipping_options.availability_status === "OUT_OF_STOCK") {
                    result = tynt.Red('Out Of Stock')
                } else {
                    result = tynt.Green('IN STOCK')
                    fs.appendFile('successResults.txt', getTime() + ' ---- Target PS5 - IN STOCK\n', function (err) {
                        if (err) throw err;
                    });
                    player.play(audio, (err) => console.log(err))
                }
                console.log(getTime(), '-----Target PS5\t\t\t', result)
            })
            .catch((err) => {
                console.log('Target ps5 error')
                console.log(err)
            })
}

function checkTargetPS5Digital() {
    return axios.get(targetPS5Digital)
            .then((res) => {
                let result
                if(res.data.data.product.fulfillment.shipping_options.availability_status === "OUT_OF_STOCK") {
                    result = tynt.Red('Out Of Stock')
                } else {
                    result = tynt.Green('IN STOCK')
                    fs.appendFile('successResults.txt', getTime() + ' ---- Target PS5 Digital - IN STOCK\n', function (err) {
                        if (err) throw err;
                    });
                    player.play(audio, (err) => console.log(err))
                }
                console.log(getTime(), '-----Target PS5 Digital\t\t', result)
            })
            .catch((err) => {
                console.log('Target ps5 digital error')
                console.log(err)
            })
}

function checkSonyDirectPS5() {
    return axios.get(sonyDirectPS5)
            .then((res) => {
                let result
                if(res.status === 200) {
                    result = tynt.Green('QUEUE IS LIVE')
                } else {
                    result = tynt.Red('No Queue')
                }
                console.log(getTime(), '-----Sony Direct PS5 Queue\t', result)
            })
            .catch((err) => {
                console.log('Sony Direct ps5 error')
                console.log(err)
            })
}

function checkWalmartPS5() {
    return axios.get(walmartPS5)
            .then((res) => {
                let result
                if(res.status === 200) {
                    result = tynt.Green('PS5 is LIVE')
                    player.play(audio, (err) => console.log(err))
                } else {
                    result = tynt.Red('404 Not Found')
                }
                console.log(getTime(), '-----Walmart PS5\t', result)
            })
            // .catch((err) => {
            //     console.log('Walmart ps5 error')
            //     console.log(err)
            // })
}

async function checkStock() {
    
    console.log('\nCheck #' + ++tries)

    await checkTargetPS5()
    await checkTargetPS5Digital()
    await checkBestBuyPS5()
    await checkBestBuyPS5Digital()
    //await checkSonyDirectPS5()
    //await checkWalmartPS5()
    
    setTimeout(checkStock, refreshTime*1000)
    await timeCountdown()
}

console.log('\n\n')
console.log('██████╗░░██████╗███████╗  ████████╗██████╗░░█████╗░░█████╗░██╗░░██╗███████╗██████╗░')
console.log('██╔══██╗██╔════╝██╔════╝  ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░██╔╝██╔════╝██╔══██╗')
console.log('██████╔╝╚█████╗░██████╗░  ░░░██║░░░██████╔╝███████║██║░░╚═╝█████═╝░█████╗░░██████╔╝')
console.log('██╔═══╝░░╚═══██╗╚════██╗  ░░░██║░░░██╔══██╗██╔══██║██║░░██╗██╔═██╗░██╔══╝░░██╔══██╗')
console.log('██║░░░░░██████╔╝██████╔╝  ░░░██║░░░██║░░██║██║░░██║╚█████╔╝██║░╚██╗███████╗██║░░██║')
console.log('╚═╝░░░░░╚═════╝░╚═════╝░  ░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝')

checkStock()