<template>
    <div class="github">
        <h2>{{ title }}</h2>
        <div class="commit">
            <div class="icon"><svg aria-hidden="true" class="octicon octicon-git-commit" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg></div>
            <a :href="repo.url" target="_blank"><strong>{{ repo.message }}</strong></a>
            <p>{{ repo.date }} on <a :href="repo.repoUrl" target="_blank">{{ repo.name }}</a></p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import timeago from 'timeago.js';

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
                repo: {
                    message: '',
                    name: '',
                    date: '',
                    sha: '',
                    url: '',
                    repoUrl: ''
                }
            }
        },
        created() {
            let self = this,
                repos = [],
                lastRepo = '';

            github.get(reposPath)
                .then(response => {
                    response.data.map(e => {
                        repos.push({ name: e.name, url: e.html_url, pushed_at: e.pushed_at });
                    });
                    lastRepo = repos
                        .sort((a,b) => Date.parse(a.pushed_at) < Date.parse(b.pushed_at))
                        .slice(0,1)[0];
                })
                .then(() => github.get(`${commitsPath}/${lastRepo.name}/commits`))
                .then(response => {
                    self.repo.name = lastRepo.name;
                    self.repo.repoUrl = lastRepo.url;
                    self.repo.message = response.data[0].commit.message;
                    self.repo.sha = response.data[0].sha.substring(0, 7);
                    self.repo.url = response.data[0].html_url;
                    self.repo.date = timeago().format(response.data[0].commit.author.date);
                })
                .catch(e => console.log(e));

        }
    }
</script>

<style lang="sass">
    $color: #424242
    $color-links: #0d355a

    .commit
        display: inline-block
        margin: 10px 0
        padding: 20px 30px
        background: rgba(#000, 0.04)
        .icon
            display: inline-block
            height: 100%
            margin-right: 5px
            margin-left: -10px
            svg
                height: 100%
        a, p
            margin: 0
        strong
            font-size: 1.5em
        a
            display: inline-block
            margin-bottom: 5px
        p
            margin-left: 13px
            a
                margin: 0
                text-decoration: underline



</style>
