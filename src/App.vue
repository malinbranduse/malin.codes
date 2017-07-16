<template>
    <div itemscope itemtype="http://schema.org/WebPage" class="padded" :style="{ paddingTop: nav.windowHeight + 'px' }">

        <header class="header" :style="nav.navStyle">
            <div class="header__container">

                <div v-html="logo" class="logo"></div>

                <ul class="socials" :style="{ opacity: nav.socialOpacity }">
                    <li v-for="social in socials" class="social">
                        <a target="_blank" :href="social.url" v-html="social.svg" :class="social.name"></a>
                    </li>
                </ul>

                <div class="wrapper bg">

                    <img class="me" src="src/assets/me.gif" alt="Me">

                    <h1>Hello there!</h1>

                    <p itemprop="author" itemscope itemtype="http://schema.org/Person">
                        I'm <span itemprop="name">Mălin Brândușe</span>, a {{getAge('1997/11/13')}}yr old
                    <span itemprop="jobTitle">Web Developer</span> from <span itemprop="workLocation">Romania</span>
                    </p>


                    <div class="arrow bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" width="451.847" height="451.847" viewBox="0 0 451.847 451.847"><path d="M225.923 354.706c-8.098 0-16.195-3.092-22.37-9.263L9.27 151.157c-12.36-12.36-12.36-32.397 0-44.75 12.354-12.355 32.388-12.355 44.748 0L225.923 278.32 397.83 106.413c12.358-12.354 32.39-12.354 44.743 0 12.365 12.354 12.365 32.392 0 44.75L248.293 345.45c-6.178 6.17-14.275 9.256-22.37 9.256z"/></svg>
                    </div>
                </div>
            </div>
        </header>

        <section class="content-wrapper">
            <app-content></app-content>
        </section>

    </div>
</template>

<script>
    import axios from 'axios';
    import Content from './Content.vue'

    let svgs = [
        {
            name: 'github',
            url: 'https://github.com/malinushj'
        },
        {
            name: 'quora',
            url: 'https://www.quora.com/profile/M%C4%83lin-Br%C3%A2ndu%C5%9Fe'
        },
        {
            name: 'linkedin',
            url: 'https://www.linkedin.com/in/malinbranduse/'
        }
    ];

    export default {
        name: 'app',
        components: {
            appContent: Content
        },
        data() {
            return {
                logo: '',
                socials: svgs,
                nav: {
                    windowHeight: window.innerHeight,
                    targetHeight: 100,
                    socialOpacity: 0,
                    navStyle: {
                        height: ''
                    }
                }
            }
        },
        created() {
            this.setSVG();
            this.removeLoader();
            this.bindSetNavHeight();
            this.setResizeHeight();
        },
        methods: {
            setSVG() {
                let self = this;
                for (let i = 0; i < this.socials.length; i++)
                    axios.get(`/src/assets/svg/${this.socials[i].name}.svg`)
                        .then(svg => {
                            self.socials[i].svg = svg.data;
                            self.$forceUpdate();
                        })
                        .catch(e => console.log(e));

                axios.get('/src/assets/svg/logo-color.svg')
                    .then(svg => {
                        self.logo = svg.data;
                    })
                    .catch(e => console.log(e));
                this.$forceUpdate();
            },
            removeLoader() {
                let loader = document.getElementById('loader');
                if (loader !== null) {
                    loader.className = 'hidden';
                    'webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend'.split(' ')
                        .map(name => loader.addEventListener(name, () => loader.parentNode.removeChild(loader), false));
                }
            },
            getAge(dateString) {
                let today = new Date(),
                    birthDate = new Date(dateString),
                    age = today.getFullYear() - birthDate.getFullYear(),
                    m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            },
            setNavHeight() {
                let height = innerHeight - pageYOffset <= this.nav.targetHeight ?
                    this.nav.targetHeight : innerHeight - pageYOffset;
                this.nav.socialOpacity = this.nav.targetHeight / height * 2 - 1;
                this.nav.navStyle.height = `${height}px`;
            },
            bindSetNavHeight() {
                let self = this;
                let rAF = window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    // IE Fallback, you can even fallback to onscroll
                    function(callback){ window.setTimeout(callback, 1000/60) };
                let lastPosition = -1;
                function loop(){
                    // Avoid calculations if not needed
                    if (lastPosition === window.pageYOffset) {
                        rAF(loop);
                        return false;
                    } else lastPosition = window.pageYOffset;

                    console.log('called');

                    self.setNavHeight.call(self);

                    rAF( loop );
                }
                loop();
            },
            setResizeHeight() {
                let self = this;
                window.addEventListener('resize', function(){
                    self.nav.windowHeight = window.innerHeight;
                })
            }
        }
    }
</script>

<style lang="sass">
    @import '../node_modules/normalize.css/normalize'

    $color: #424242
    $color-links: #0d355a

    @import './sass/mixins'
    @import './sass/loader'
    @import './sass/header'

    html, body, *
        padding: 0
        margin: 0
        box-sizing: border-box
        font-family: 'Fira Sans', sans-serif

    body
        color: $color
        -webkit-font-smoothing: antialiased
        -moz-osx-font-smoothing: grayscale
        //+main-bg(#51e4d6, #2ce8fb)

    h1, h2, h3
        font-family: 'Lora', serif

    .content-wrapper
        width: 100%
        max-width: 1000px
        padding: 60px 20px
        background: #fff
        margin: 0 auto

    .padded
        padding-top: 100vh


    .wrapper
        padding: 20px 30px
        @media (max-width: 600px)
            padding: 20px

    h1
        font-size: 60px
        line-height: 1
        font-weight: 300
        margin: 20px 0

        @media (max-width: 600px)
            font-size: 42px

    p
        font-size: 18px
        font-weight: 500
        margin: 20px 0
        span
            font-weight: 900
    a
        text-decoration: none;
        color: $color
        transition: .12s ease
        &:hover
            color: $color-links

    .me
        width: 100px
        height: 100px
        border-radius: 30%
        overflow: hidden

    .socials
        position: absolute
        top: 0
        right: 0
        list-style-type: none
        padding: 0
        margin-top: 35px
        margin-right: 10px

    .social
        display: inline-block
        text-align: center
        margin: 0 10px
        a
            display: block
            transition: .12s ease
            &:hover
                transform: scale(1.1)
                svg
                    fill: lighten($color-links, 10%)
        svg
            width: 30px
            height: 30px
            fill: $color

    .logo svg
        width: 150px
        height: 100px
        padding: 0 30px

        @media (max-width: 600px)
            width: 120px
            height: 100px
            padding: 10px 20px

</style>
