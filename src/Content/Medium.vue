<template>
    <div class="github">
        <h2>{{ title }}</h2>
        <div class="medium">
            <ul>
                <li v-for="story in stories">
                    <a :href="story.url" target="_blank">
                        <img :src="story.src" alt="">
                        <div class="text">
                            <h3>{{ story.title }}</h3>
                            <h4>{{ story.subtitle }}</h4>
                            <p>{{ story.date }}</p>
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
                        self.stories.push({
                            title: i.title,
                            subtitle: doc.getElementsByTagName('h4')[0].innerText,
                            url: i.guid,
                            src: doc.getElementsByTagName('img')[0].src,
                            date: timeago().format(i.pubDate)
                        })
                    });
                })
                .catch(e => console.log(e));
        }
    }
</script>

<style lang="sass">
    $color: #424242
    $color-links: #0d355a

</style>
