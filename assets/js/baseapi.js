// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3008' + options.url

    //统一为有权限的设置headers
    if (options.url.includes('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局挂载complete回调函数
    // 判断是否输入信息跳转,阻止强制跳转
    options.complete = function (res) {
        console.log(res);
        if (res.responseJSON.code === 1 && res.responseJSON.message === "身份认证失败!") {
            //首先清空本地存储
            localStorage.removeItem('token')
            //跳转到登录页面
            location.href = "http://127.0.0.1:5500/%E5%89%8D%E7%AB%AFday57/login.html"
        }
    }
})