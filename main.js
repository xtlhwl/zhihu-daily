import Vue from 'vue';
import App from './app.vue';
import './style.css';
import Item from './components/item.vue';
import DailyArticle from './components/daily-article.vue'
Vue.component('Item',Item);
Vue.component('daily-article',DailyArticle);



new Vue({
    el: '#app',
    render: h => {
        return h(App)
    }
});


