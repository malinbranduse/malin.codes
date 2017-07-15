<template>
    <div class="github">
        <h2>{{ title }}</h2>
        <div class="commit">
            <a :href="repo.url" target="_blank">{{ repo.sha }}</a>
            <p>"{{ repo.message }}" on</p>
            <a :href="repo.repoUrl" target="_blank">{{ repo.name }}</a>
            <p>{{ repo.date }}</p>
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
                    console.log(response.data[0]);
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
        a, p
            display: inline-block

</style>
