$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initArticle();

  // 获取图书列表信息
  function initArticle() {
    $.ajax({
      type: "get",
      url: "/my/cate/list",
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("获取文章分类列表失败");
        }
        layer.msg("获取文章分类列表成功");
        let str = template("tpl", res);
        $("tbody").html(str);
      },
    });
  }
  // 弹出框事件
  let indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#addTi").html(),
    });
  });
  //  根据弹出框添加数据,通过事件委托来绑定事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/my/cate/add",
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("添加失败");
        }
        layer.msg("添加成功");
        initArticle();
        layer.close(indexAdd);
      },
    });
  });

  //给弹出框绑定事件
  var indexEdit = null;
  $("tbody").on("click", "#btn-edit", function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#editTi").html(),
    });
    let id = $(this).attr("data-id");
    console.log(id);
    // 发起ajax请求
    $.ajax({
      method: "get",
      url: "/my/cate/info?id=" + id,
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("获取失败");
        }
        layer.msg("获取成功");
        form.val("form-edit", res.data);
      },
    });
  });

  // 修改弹出层的信息
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "put",
      url: "/my/cate/info",
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("更新失败");
        }
        layer.msg("更新成功");
        //重新渲染信息
        initArticle();
        //关闭弹出层
        layer.close(indexEdit);
      },
    });
  });

  //删除元素
  $("body").on("click", "#btnDe", function () {
    //获取当前的id，根据id删除
    let id = $(this).attr("data-id");
    //弹出提示框
    layer.confirm("确认删除吗?", { icon: 3, title: "提示" }, function (index) {
      //do something
      $.ajax({
        method: "delete",
        url: "/my/cate/del?id=" + id,
        success: function (res) {
          console.log(res);
          if (res.code !== 0) {
            return layer.msg("删除失败");
          }
          layer.msg("删除成功");
          //删除后重新渲染
          initArticle();
          //关闭提示框
          layer.close(index);
        },
      });
    });
  });
});
