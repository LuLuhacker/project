$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initCate();
  // 初始化富文本编辑器
  initEditor();
  //渲染下拉表单的分类
  function initCate() {
    $.ajax({
      type: "get",
      url: "/my/cate/list",
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("获取信息失败");
        }
        let str = template("tplC", res);
        $("[name=cate_id]").html(str);
        //由于动态插入的样式，又是渲染会失效
        // 重新渲染页面
        form.render();
      },
    });
  }

  //将文件保存发起ajax请求函数
  function publishA(can) {
    $.ajax({
      type: "post",
      url: "/my/article/add",
      data: can,
      //  如果向服务器提交的是FormData格式的数据
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("发布文章失败");
        }
        layer.msg("发布文章成功");

        window.parent.yi("文章列表");
        //跳转到文章列表
        location.href = "art-list.html";
      },
    });
  }
  // 1. 初始化图片裁剪器
  let $image = $("#image");

  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //选择封面绑定选择文件事件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  //监听文件选择框的事件
  $("#coverFile").on("change", function (e) {
    // 获取文件数组列表
    let file = e.target.files;
    // 判断是否选择了文件
    if (file.length === 0) {
      return layer.msg("请选择文件");
    }
    // 创建一个对应的 URL 地址
    var imgURL = URL.createObjectURL(file[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", imgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  //定义文章的发布状态
  let sta = "已发布";
  //如果点击的是发布草稿,改变文章的发布状态
  $("#btnSave2").on("click", function () {
    sta = "草稿";
  });

  //为表单绑定提交事件
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    // 创建FormData来保存数据
    let fd = new FormData($(this)[0]);
    //将文章状态添加到formData里
    fd.append("state", sta);
    // 遍历打印数据
    // fd.forEach((v, k) => {
    //   console.log(k, v);
    // });
    //将截取的图片输出为一个文件
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象追加到FormData中
        fd.append("cover_img", blob);
        //发送ajax请求
        publishA(fd);
      });
  });
});
