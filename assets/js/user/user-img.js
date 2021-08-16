$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域

    // 绑定事件
    $image.cropper(options)
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        console.log(e);
        let imgs = e.target.files
        if (imgs.length === 0) {
            return layer.msg('请选择图片!')
        }
        let file = e.target.files[0]
        let imgUrl = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgUrl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    $('#btnUpload').on('click', function () {
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //发起ajax请求
        $.ajax({
            type: "patch",
            url: "/my/update/avatar",
            data: { avatar: dataURL },
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('用户头像更新失败')
                }
                layer.msg('用户头像更新成功')
                // 更新成功后重新渲染头像
                window.parent.getInfo()
            }
        });
    })
})