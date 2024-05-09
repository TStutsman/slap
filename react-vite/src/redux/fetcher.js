// returns the correct payload object
// dynamically based on type (json || form-data)
const fetchOptions = payload => {
    if(payload instanceof FormData) {
        return { body: payload }
    } 
    // else
    return {
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    }
}

export default class Fetcher {
    constructor(prefix = "") {
        this.prefix = prefix;
    }

    get = async url => {
        const response = await fetch(this.prefix + url);

        if(response.ok) {
            const data = await response.json();
            return data;
        } else {
            return { errors: "Something went wrong. Please try again" }
        }
    }

    post = async (url, payload) => {
        const response = await fetch(this.prefix + url, {
            method: 'POST',
            ...fetchOptions(payload)
        });

        // if the response has data or errors return them
        if(response.status < 500) {
            const data = await response.json();
            return data;
        } else {
            return { errors: "Something went wrong. Please try again" }
        }
    }

    put = async (url, payload) => {
        const response = await fetch(this.prefix + url, {
            method: 'PUT',
            ...fetchOptions(payload)
        });

        // if the response has data or errors return them
        if(response.status < 500) {
            const data = await response.json();
            return data;
        } else {
            return { errors: "Something went wrong. Please try again" }
        }
    }

    delete = async url => {
        const response = await fetch(this.prefix + url, {
            method: 'DELETE'
        });

        if(response.ok) {
            const data = await response.json();
            return data;
        } else {
            return { errors: "Something went wrong. Please try again" }
        }
    }
}