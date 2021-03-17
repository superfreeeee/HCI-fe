// let data = undefined

// function api () {
//     console.log('api')
//     return Promise.resolve('api return')
// }

// async function action () {
//     /*1*/
//     console.log('action')
//     const res/*2*/ = await api()
//     console.log(`res = ${res}`)
//     data = res
//     return res
// }

// function method () {
//     console.log('method')
//     console.log(`data = ${data}`)
// }

// (function () {
//     const res = action() // Promise<pending>
//     method()
// }())

// /*
// 1: method
// 2: data = ???
// 3: action
// 4: api
// 5: res = 'api return'

// 3, 4, 1, 2 
// 3, 4, 1, 2, 5 //csd
// 3, 4, 1, 5, 2 
// ??? = 
// */

const p = new Promise((resolve, reject) => {
    // const n = Math.random()
    const n = 0
    console.log(`n = ${n}`) // 1: n = 0
    if (n > 0.5) {
        resolve(n)
    } else {
        reject(n)
    }
    console.log('promise end') // 2
})
p.then(res => {
    console.log(`res 1 = ${res}`) 
    return 'then 1 result' // Promise.resolve
}).catch(err => {
    console.log(`err 1 = ${err}`) // 3: err 1 = 0
    return 'catch 1 result'
}).then(res => {
    console.log(`res 2 = ${res}`) // 4
    return Promise.reject('then 2 result')
}).catch(err => {
    console.log(`err 2 = ${err}`) // 5: err 2 = catch 1 result
    return Promise.resolve('catch 2 result') 
}).then(res => {
    console.log(`res 3 = ${res}`) // 6: res 3 = catch 2 result
}).catch(err => {
    console.log(`err 3 = ${err}`) 
})
