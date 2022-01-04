<template>
    <div class="login">
        <div class="box">
            <div class="title center">请登录</div>
            <div class="account center">
                <input type="text"
                    v-model="account"
                    placeholder="手机号码"
                    onfocus="if(placeholder ==='手机号码') placeholder=''" 
                    onblur="if(!placeholder)placeholder='手机号码'"
                >
            </div>
            <div class="password center">
                <input type="password"
                    v-model="password"
                    placeholder="密码"
                    onfocus="if(placeholder ==='密码') placeholder=''" 
                    onblur="if(!placeholder)placeholder='密码'"
                    @keyup.enter="getLogin"
                >
            </div>
            <div class="register center">
                <div class="start center" @click="getLogin">登&nbsp;&nbsp;&nbsp;&nbsp;录</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data(){
        return {
            account:'',
            password:''
        }
    },
    methods:{
        async getLogin(){
            this.password = encodeURIComponent(this.password)
            let player = await this.$store.dispatch('checkout',{account:this.account,password:this.password})
            if(player.data.code === 200){
                this.$router.push('/me')
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .login {
        width: 60%;
        height: 620px;
        margin: 2% 20%;
        background: #fff;
        border: 1px solid #ccc;
        .center {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .box {
            width: 60%;
            height: 60%;
            margin: 10% 20%;
            background: rgb(199, 25, 25);
            border: 2px solid #ccc;
            .title {
                width: 100%;
                height: 100px;
                font-size: 1.6em;
                font-weight: 900;
                color: #fff;
            }
            .account {
                width: 100%;
                height: 70px;
                input {
                    width: 250px;
                    height: 35px;
                    outline-style: none;
                    border: 1px solid #ccc;
                    font-size: 1.1em;
                    border-radius: 5px;
                }
            }
            .password {
                width: 100%;
                height: 70px;
                input {
                    width: 250px;
                    height: 35px;
                    outline-style: none;
                    border: 1px solid #ccc;
                    font-size: 1.1em;
                    border-radius: 5px;
                }
            }
            .register {
                width: 100%;
                height: 50px;
                margin-top: 30px;
                .start {
                    width: 130px;
                    height: 40px;
                    border: 2px solid #eee;
                    background: rgb(66, 164, 255);
                    color: #eee;
                    font-size: 1.1em;
                    font-weight: 700;
                    border-radius: 10px;
                    user-select: none;
                }
                .start:hover {
                    cursor: pointer;
                    color: #fff;
                    border: 2px solid #fff;
                    background: rgb(88, 180, 255);
                }
            }
        }
    }
</style>