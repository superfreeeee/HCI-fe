let data = undefined

function api () {
    console.log('api')
    return Promise.resolve('api return')
}

async function action () {
    /*1*/
    console.log('action')
    const res/*2*/ = await api()
    console.log(`res = ${res}`)
    data = res
    return res
}

function method () {
    console.log('method')
    console.log(`data = ${data}`)
}

(function () {
    const res = action() // Promise<pending>
    method()
}())

/*
1: method
2: data = ???
3: action
4: api
5: res = 'api return'

3, 4, 1, 2 
3, 4, 1, 2, 5 //csd
3, 4, 1, 5, 2 
??? = 
*/

