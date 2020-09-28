const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
var randomize = require('randomatic')
var random = require('random-name')
const { URLSearchParams } = require('url');
const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs-extra');
const delay = require('delay')

const getCookie = (reff) => new Promise((resolve, reject) => {
    fetch(`https://polypux.com/register?ref=${reff}`, {
        method: 'GET'
    }).then(async res => {
        const $ = cheerio.load(await res.text());
        const result = {
            cookie: res.headers.raw()['set-cookie'],
            token: $('input[name=_token]').attr('value')
        }

        resolve(result)
    })
    .catch(err => reject(err))
});

const functionRegist = (token, realCookie, username, email, reff) => new Promise((resolve, reject) => {
    const params = new URLSearchParams;
    params.append('_token', token)
    params.append('username', username)
    params.append('email', email)
    params.append('password', 'Berak321#')
    params.append('re-password', 'Berak321#')
    params.append('ref', reff)
    params.append('agree', 'on')

       fetch('https://polypux.com/signup', {
        method: 'POST', 
        body: params,
        headers: {
            'Host': 'polypux.com',
            'Origin': 'https://polypux.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': realCookie
           }
       })
       .then(res => res.text())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });

(async () => {
    const reff = readlineSync.question('[?] Reff : ')
    const jumlah = readlineSync.question('[?] Jumlah Reff: ')
    console.log("")
    for (var i = 0; i < jumlah; i++){
    try {
        const name = random.first()
        const rand = randomize('0', 5)
        const email = `${name}${rand}@gmail.com`
        const username = `${name}${rand}`
        const cookie = await getCookie(reff)
        const xsrf = cookie.cookie[0].split(';')[0]
        const session = cookie.cookie[1].split(';')[0]
        const token = cookie.token
        const realCookie = `${xsrf}; ${session}`
        const regist = await functionRegist(token, realCookie, username, email, reff)
        if (regist){
            console.log(`[${i+1}] Sukses => ${i+1}`)
        } else {
            console.log(`[${i+1}] Gagal => ${i+1}\n`)
        }
} catch (e) {
    console.log(e)
    }
}
})()