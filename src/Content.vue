<template>
    <div>
        <github :title="titles.github"></github>
        <medium :title="titles.medium"></medium>
    </div>
</template>

<script>
    import axios from 'axios';
    import Github from './Content/Github.vue'
    import Medium from './Content/Medium.vue'

    export default {
        data() {
            return {
                titles: {
                    github: 'Latest pieces of code written',
                    medium: 'Read one of my stories'
                }
            }
        },
        components: {
            github: Github,
            medium: Medium
        }
    }
</script>

<style lang="sass">
    $color: #424242
    $color-links: #0d355a
</style>
