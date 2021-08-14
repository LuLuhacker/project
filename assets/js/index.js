// 获取用户基本信息
function getInfo() {
    let layer = layui.layer
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        success: function (res) {
            if (res.code !== 0) {
                return layer.msg('获取用户信息失败')
            }
            console.log(res.data);
            renderUser(res.data)
        }
    });
}
//渲染用户头像
function renderUser(user) {
    //获取用户姓名
    let name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html(`欢迎  ${name}`)
    //按需求渲染头像
    if (user.user_pic !== null) {
        //渲染存在的头像,并显示
        $('.layui-nav-img').attr('src', user.user_pic).show()
        //文字头像隐藏
        $('.text-avatar').hide()
    } else {
        //渲染文字头像,并显示
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        //隐藏图片头像
        $('.layui-nav-img').hide()
    }
}

$(function () {
    getInfo()
    //点击退出
    $('#tuichu').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // console.log('ok');
            //首先清空本地存储
            localStorage.removeItem('token')
            //跳转到登录页面
            location.href = "http://127.0.0.1:5500/%E5%89%8D%E7%AB%AFday57/login.html"
            //layui自带的参数,保留不要更改
            layer.close(index);
        });
    })
})