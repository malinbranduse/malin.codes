<template>
    <div>
        <github :title="titles.github"></github>
    </div>
</template>

<script>
    import axios from 'axios';

    import Github from './Content/Github.vue'

    export default {
        data() {
            return {
                titles: {
                    github: 'Latest piece of code I\'ve written'
                }
            }
        },
        components: {
            github: Github
        }
    }
</script>

<style lang="sass">
    $color: #424242
    $color-links: #0d355a

</style>
