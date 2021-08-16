$(function () {
    let layer = layui.layer
    let form = layui.form
    form.verify({
        // 创建用户的验证规则
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
    initUser()
    //初始化用户信息
    function initUser() {
        $.ajax({
            method: "get",
            url: "/my/userinfo",
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        });

    }
    //给重置按钮绑定事件
    $('#btnReset').on('click', function (e) {
        //阻止默认跳转行为
        e.preventDefault();
        // 再次调用初始化用户信息函数
        initUser()
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        // 发起ajax请求,注意这里是put不是post
        $.ajax({
            type: "put",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('用户信息更新失败！')
                }
                layer.msg('用户信息更新成功!')
                // 调用父级中的渲染页面函数
                window.parent.getInfo()

            }
        });
    })
})