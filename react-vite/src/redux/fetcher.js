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
            return { server: "Something went wrong. Please try again" }
        }
    }

    post = async (url, payload) => {
        const response = await fetch(this.prefix + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if(response.ok) {
            const data = await response.json();
            return data;
        } else {
            return { server: "Something went wrong. Please try again" }
        }
    }

    put = async (url, payload) => {
        const response = await fetch(this.prefix + url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if(response.ok) {
            const data = await response.json();
            return data;
        } else {
            return { server: "Something went wrong. Please try again" }
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
            return { server: "Something went wrong. Please try again" }
        }
    }
}