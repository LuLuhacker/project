$(function () {
    $('#link-log').on('click', function () {
        $('.log-box').hide()
        $('.reg-box').show();
    })
    $('#link-reg').on('click', function () {
        $('.reg-box').hide()
        $('.log-box').show();
    })

    // 从 layui 中获取 form 对象
    let form = layui.form
    let layer = layui.layer
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })
    // 监听注册表单的提交事件
    $('#reg-form').on('submit', function (e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
        // console.log($(this).serialize());
        // 2. 发起Ajax的POST请求
        let data = {
            username: $('#reg-form [name=username]').val(),
            password: $('#reg-form [name=password]').val(),
            repassword: $('#reg-form [name=repassword]').val()
        }
        // let data = $(this).serialize()
        // console.log(data);
        $.post('/api/reg', data, function (res) {
            console.log(res);
            if (res.code !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message)
            }
            // console.log('注册成功，请登录！');
            layer.msg('注册成功，请登录！')
            // 模拟人的点击行为
            $('#link-reg').click()
        })
    })
    // 监听登录表单的提交事件
    $('#log-form').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'post',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                // console.log(res.token);
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = 'http://127.0.0.1:5500/%E5%89%8D%E7%AB%AFday57/index.html'
            }
        })
    })
})