// js/api.js

const API_BASE_URL = 'http://localhost:3000/api';

const api = {
    request: async function(endpoint, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // This is critical for sending and receiving the HttpOnly cookie
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API Request Failed');
            }
            
            return data;
        } catch (error) {
            console.error(`API Error on ${endpoint}:`, error);
            throw error;
        }
    },

    login: async function(username, password) {
        return await this.request('/login', 'POST', { username, password });
    },

    logout: async function() {
        return await this.request('/logout', 'POST');
    },

    me: async function() {
        return await this.request('/me', 'GET');
    },

    getDashboard: async function() {
        return await this.request('/dashboard', 'GET');
    },

    syncProgress: async function(progressData) {
        return await this.request('/progress', 'POST', progressData);
    },

    getReminders: async function() {
        return await this.request('/reminders', 'GET');
    },

    sendReminder: async function(message) {
        return await this.request('/reminders', 'POST', { message });
    }
};

window.api = api;
