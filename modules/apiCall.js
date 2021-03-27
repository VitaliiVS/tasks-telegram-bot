module.exports = class ApiCall {
    constructor(method, body, token) {
        this.method = method
        this.cache = 'no-cache'
        this.headers = {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
        this.body = JSON.stringify(body)
    }
}