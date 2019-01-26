
import store from '@/store/index'
import $http from "@/api/fetch";
import api from '@/api/api';
import { Encrypt } from "@/untils/aes";

/**
 * 登录，退出操作
 * 
 **/
const user = {
    state: {
         userName:'none',
        localLanguage:'en'
    },
    mutations: {
        LOGING_STATE: (state, params) => {
            localStorage.setItem('sessionKey',params);
            localStorage.setItem('localLanguage','zh');
            state.userName = localStorage.getItem('userName');
                
        }
    },
    actions: {
        userLogin({ commit }, params) {//登录异步操作
            let userName=params.userName;
            let password;
            password = Encrypt(params.password,process.env.aesKey, process.env.ivKey);//加密
                return new Promise((resolve, reject) => {
                    $http.post(api.userLogin, { username: userName, aesPassword:password})
                    .then(res => {
                        if (res.code == '200') {
                            localStorage.setItem('userName',userName);
                            commit('LOGING_STATE',res.body);
                        }
                        resolve(res)
                    }).catch(error => {
                        reject(error);
                    })
                })
        },
    }
}

export default user