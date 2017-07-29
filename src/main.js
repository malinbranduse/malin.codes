import Vue from 'vue'
import App from './App.vue'

let root = new Vue({
    render: h => h(App)
});

document.addEventListener('DOMContentLoaded', () => root.$mount('#app'));
