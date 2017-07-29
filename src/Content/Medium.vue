<template>
    <div class="medium">
        <h2>{{ title }}</h2>
        <div class="stories">
            <ul>
                <li v-for="story in stories">
                    <a :href="story.url" target="_blank">
                        <div class="img">
                            <img :src="story.src" class="cover">
                        </div>
                        <div class="text">
                            <h3>{{ story.title }}</h3>
                            <h4>{{ story.subtitle }}</h4>
                            <div class="bottom">
                                <p><strong>{{ story.date }}</strong></p>
                                <p>{{ story.readingTime.text }}</p>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import timeago from 'timeago.js';
    import readingTime from 'reading-time';
    import { EventBus } from '../event-bus';

    let mediumURL = 'https://medium.com/',
        publication = 'malin-codes/',
        user = '@malin.codes/',
        feed = `${mediumURL}feed/${publication}`;
    let rss2jsonAPI = 'https://api.rss2json.com/v1/api.json';
    let medium = axios.create({
        baseURL: `${rss2jsonAPI}?rss_url=${feed}`
    });

    export default {
        props: ['title'],
        data() {
            return {
                stories: []
            }
        },
        created() {
            let self = this;
            medium()
                .then(response => {
                    response.data.items.map(i => {

                        let doc = new DOMParser().parseFromString(i.description, 'text/html');
                        let date = new Date(i.pubDate).toDateString()
                            .split(' ').reverse()
                            .filter((e, i) => i > 0 && i < 3).join(' ');

                        self.stories.push({
                            title: i.title,
                            subtitle: doc.getElementsByTagName('h4')[0].innerText,
                            url: i.guid,
                            src: doc.getElementsByTagName('img')[0].src,
                            date: date,
                            readingTime: readingTime(doc.documentElement.textContent.replace(/\r?\n|\r/g, ''))
                        });
                    });
                })
                .catch(e => (console.log(e), EventBus.$emit('loaded', 'medium')));
        },
        updated() {
            EventBus.$emit('loaded', 'medium');
        }
    }
</script>

<style lang="sass">
    $color: #424242
    $color-links: #0d355a

    .medium
        margin-top: 40px

        h3
            font-size: 1.3em
            margin-bottom: 15px
        h4
            font-size: 1em
            font-weight: 300

        .stories
            ul
                list-style: none
            li
                width: 100%
                height: 230px
                max-width: 660px
                @media (max-width: 500px)
                    height: auto
            a
                display: block
                width: 100%
                height: 100%
                border-radius: 3px
                overflow: hidden
                border: 1px solid #e3e3e3
                transition: .2s ease
                &:hover
                    img
                        opacity: 0.9
                        transform: scale(1.05);
        .img
            width: 30%
            height: 100%
            display: inline-block
            overflow: hidden
            img
                transition: transform .2s ease
            @media (max-width: 600px)
                width: 40%
            @media (max-width: 500px)
                width: 100%
                height: 200px
        .text
            width: 65%
            height: 100%
            padding: 30px 20px
            position: relative
            display: inline-block
            vertical-align: top
            @media (max-width: 600px)
                width: 59%
            @media (max-width: 500px)
                width: 100%
                padding-bottom: 55px
        .bottom
            position: absolute
            bottom: 20px
            color: $color
            p
                font-size: 1em
                display: inline-block
                vertical-align: bottom
                margin: 0
            strong:after
                content: '•'
                margin-left: 6px

</style>
