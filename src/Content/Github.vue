<template>
    <div class="github">
        <h2>{{ title }}</h2>
        <div class="commit" v-for="commit in commits">
            <a :href="commit.url" target="_blank">
                <div class="icon"><svg aria-hidden="true" class="octicon octicon-git-commit" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg></div>
                <strong>{{ commit.message }}</strong>
            </a>
            <p>{{ commit.date }} on <a :href="commit.repoUrl" target="_blank">{{ commit.name }}</a></p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import timeago from 'timeago.js';
    import { EventBus } from '../event-bus.js';

    const username = 'malinushj';
    const auth = 'bWFsaW51c2hqOmMwMGU2MDY5M2YyNGQzNWY1MTEzMzg4ZGRlMjQyZWM2ZjcwOWY0MzU=';
    const githubApi = 'https://api.github.com/';
    const reposPath = `user/repos`;
    const commitsPath = `repos/${username}`;

    const github = axios.create({
        baseURL: githubApi,
        headers: { 'Authorization': `Basic ${auth}` }
    });

    export default {
        props: ['title'],
        data() {
            return {
                commits: []
            }
        },
        created() {
            let self = this,
                repos = [],
                lastRepos = [];

            github.get(reposPath)
                .then(response => {
                    response.data.map(e => {
                        repos.push({ name: e.name, url: e.html_url, pushed_at: e.pushed_at });
                    });
                    lastRepos = repos
                        .sort((a,b) => new Date(b.pushed_at) - new Date(a.pushed_at))
                        .slice(0,3);
                })
                .then(() =>
                    axios.all(lastRepos.reduce((a, r) =>
                        a.concat(github.get(`${commitsPath}/${r.name}/commits`))
                        ,[]))
                )
                .then(response => {
                    response.map((r, i) => {
                        self.commits.push({
                            name: lastRepos[i].name,
                            repoUrl: lastRepos[i].url,
                            message: r.data[0].commit.message,
                            sha: r.data[0].sha.substring(0, 7),
                            url: r.data[0].html_url,
                            date: timeago().format(r.data[0].commit.author.date)
                        });
                    });
                    EventBus.$emit('loaded', 'github');
                })
                .catch(e => (console.log(e), EventBus.$emit('loaded', 'github')));
        }
    }
</script>

<style lang="sass">
    $color: #424242
    $color-links: #0d355a

    .commit
        display: inline-block
        margin: 10px 0
        margin-right: 20px
        padding: 20px 40px
        background: rgba(#000, 0.04)
        @media (max-width: 600px)
            width: 100%
            margin: 10px 0

        .icon
            position: absolute
            left: -15px
            top: 50%
            transform: translateY(-45%);
            margin-right: 5px
            margin-left: -10px
            svg
                height: 100%
        a, p
            margin: 0
            font-size: 1em
        strong
            font-size: 1.5em
            @media (max-width: 600px)
                font-size: 1.2em
        a
            position: relative
            display: inline-block
            margin-bottom: 5px
        p
            color: lighten($color, 30%)
            a
                margin: 0
                position: static
                text-decoration: underline



</style>
