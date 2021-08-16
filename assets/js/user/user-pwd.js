$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //    判断新旧密码是否相同
        samePwd: function (value) {
            if (value == $('[name=old_pwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        // 判断第二次确认密码与第一次是否相同
        rePwd: function (value) {
            if (value !== $('[name=new_pwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "patch",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功')
                $('.layui-form')[0].reset()
            }
        });
    })
})