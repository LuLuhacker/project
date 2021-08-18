$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;
  //查询参数
  let q = {
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 2, //每页显示几条数据
    cate_id: "", //文章分类id
    state: "", //state文章发布状态
  };
  //   美化时间
  template.defaults.imports.dataF = function (data) {
    const dt = new Date(data);
    let n = dt.getFullYear();
    let m = dt.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d = dt.getDate();
    d = d < 10 ? "0" + d : d;
    let h = dt.getHours();
    h = h < 10 ? "0" + h : h;
    let mm = dt.getMinutes();
    mm = mm < 10 ? "0" + mm : mm;
    let s = dt.getSeconds();
    s = s < 10 ? "0" + s : s;
    return `${n}-${m}-${d}  ${d}:${mm}:${s}`;
  };

  initTable();
  initCate();
  //   渲染表单内容函数
  function initTable() {
    $.ajax({
      method: "get",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("数据获取失败");
        }
        let str = template("tplT", res);
        $("tbody").html(str);
        //调用渲染分页的函数
        renderPage(res.total);
      },
    });
  }

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
        // 重新渲染页面
        form.render();
      },
    });
  }

  //   给筛选表单绑定事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取当前的分类名对应的id
    let id = $("[name=cate_id]").val();
    // 获取当前的状态
    let state = $("[name=state]").val();
    // 给参数q赋值
    q.cate_id = id;
    q.state = state;
    // 重新渲染表单
    initTable();
  });

  //渲染分页的函数
  function renderPage(res) {
    console.log(res);
    // 调用layPage.render()方法渲染
    laypage.render({
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      elem: "pageBox", //指向存放分页的容器，值可以是容器ID、DOM对象,这里不能加 # 号
      count: res, //数据总数,页数
      limit: q.pagesize, //每页显示的条数
      curr: q.pagenum, //起始页
      //1,当切换页码时触发jump函数 2,laypage.render()也会触发jump函数
      jump: function (obj, first) {
        console.log(obj);
        // 将切换的页面重新赋值给q.pagenum
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }

  //绑定删除事件
  $("tbody").on("click", ".btnDe", function () {
    let len = $(".btnDe").length;
    console.log(len);
    let id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      //发起ajax请求
      $.ajax({
        method: "delete",
        url: "/my/article/info?id=" + id,
        success: function (res) {
          console.log(res);
          if (res.code !== 0) {
            return layer.msg("删除失败");
          }
          //判断当前页还剩几栏数据,如果第一页则保持，如果不是则减一
          //len=1则删完后，页面上没有数据了
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          layer.msg("删除成功");
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
