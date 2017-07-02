<template>
    <div itemscope itemtype="http://schema.org/WebPage" class="main-content">

        <div class="main-content__container">

            <div v-html="logo" class="logo"></div>

            <div class="wrapper bg">

                <h1>Hello there</h1>

                <p itemprop="author" itemscope itemtype="http://schema.org/Person">
                    I'm <span itemprop="name">Mălin Brândușe</span>, a {{getAge('1997/11/13')}}yr old
                    <span itemprop="jobTitle">Web Developer</span> from <span itemprop="workLocation">Romania</span>
                </p>

                <ul class="socials">
                    <li v-for="social in socials" class="social">
                        <a target="_blank" :href="social.url" v-html="social.svg" :class="social.name"></a>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'app',
        data() {
            return {
                logo: '',
                socials: [
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
                ]
            }
        },
        created() {
            for (let i = 0; i < this.socials.length; i++)
                axios.get(`/src/assets/svg/${this.socials[i].name}.svg`)
                    .then(svg => {
                        this.socials[i].svg = svg.data;
                        console.log(this.socials[i]);
                        this.$forceUpdate();
                    })
                    .catch(e => console.log(e));

            axios.get('/src/assets/svg/logo.svg')
                .then(svg => {
                    this.logo = svg.data;
                })
                .catch(e => console.log(e));
        },
        methods: {
            getAge(dateString) {
                var today = new Date();
                var birthDate = new Date(dateString);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            }
        }
    }
</script>

<style lang="scss">
    body {
        margin: 0;
    }

    $color: #0d355a;

    .main-content {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: $color;
        display: block;
        height: 100vh;
        font-size: 0;
        background: #2BC0E4;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #EAECC6, #2BC0E4);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #EAECC6, #2BC0E4); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

        background-size: 400% 400%;

        -webkit-animation: gradientAnimation 9s ease infinite;
        -moz-animation: gradientAnimation 9s ease infinite;
        -o-animation: gradientAnimation 9s ease infinite;
        animation: gradientAnimation 9s ease infinite;

        @-webkit-keyframes gradientAnimation {
            0%{background-position:0% 82%}
            50%{background-position:100% 19%}
            100%{background-position:0% 82%}
        }
        @-moz-keyframes gradientAnimation {
            0%{background-position:0% 82%}
            50%{background-position:100% 19%}
            100%{background-position:0% 82%}
        }
        @-o-keyframes gradientAnimation {
            0%{background-position:0% 82%}
            50%{background-position:100% 19%}
            100%{background-position:0% 82%}
        }
        @keyframes gradientAnimation {
            0%{background-position:0% 82%}
            50%{background-position:100% 19%}
            100%{background-position:0% 82%}
        }

        &:before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            height: 100%;
        }
        &__container {
            display: inline-block;
            vertical-align: middle;
            text-align: left;
            font-size: 20px;
            width: 100%;
            max-width: 600px;

            @media (max-width: 600px) {
                font-size: 14px;
            }
        }
    }

    .bg {
        background: rgba(#fff, 0.4);
    }

    .wrapper {
        padding: 20px 30px;
    }

    h1 {
        font-size: 60px;
        line-height: 1;
        font-weight: 300;
        margin-bottom: 0;

        @media (max-width: 600px) {
            font-size: 42px;
        }
    }

    p {
        font-size: 18px;
        font-weight: 500;

        span {
            font-weight: 900;
        }
    }

    .socials {
        list-style-type: none;
        padding: 0;
        margin-top: 40px;
    }

    .social {
        display: inline-block;
        text-align: center;
        margin: 0 10px;

        a {
            display: block;
            transition: .2s ease;

            &:hover {
                transform: scale(1.1);
            }
        }
        svg {
            width: 30px;
            height: 30px;
            fill: lighten($color, 10%);
        }
    }

    .logo svg {
        width: 100px;
        height: 100px;
        padding: 10px 30px;

        path {
            fill: #0d355a;
        }

        @media (max-width: 600px) {
            width: 80px;
            height: 80px;
        }
    }

</style>
