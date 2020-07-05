

var URL_LOCAL='http://127.0.0.1:8088';
var categoryName = $("#categoryName").val();//商品名称

$(function(){
	//加载table列表数据
	layui.use(['table','form'],function(){
		//第一个实例
		var table = layui.table;
		var form = layui.form;
		table.render({
			elem: '#table',
			height: 500,
			url: URL_LOCAL+'/category/list',//数据接口
			method:'post',
			where:{categoryName:categoryName},
			contentType: 'application/json',
			page: true,//开启分页
			parseData: function(res){ //res 即为原始返回的数据
				    return {
				        "code": 0, //解析接口状态
				        "msg": "", //解析提示文本
				        "count": res.data.total, //解析数据长度
				        "data": res.data.list //解析数据列表
				    };
				},
				cols: [[ //表头
						{checkbox: true},
				  		{field: 'id', title: 'ID', width:'25%',unresize:true},
				  		{field: 'categoryName', title: '分类名称', width:'30%',unresize:true},
                        {field: 'showTop', title: '是否展示到首页',unresize:true,width: '15%',align:'center',templet:function(cate){
                            if(cate.showTop==0){
                                return '<span>否</span>';
                            }else if(cate.showTop==1){
                                return '<span>是</span>';
                            }
						}},
						{fixed: 'right',title: '操作', width:'25%', align:'center', toolbar: '#barDemo'} //这里的toolbar值是模板元素的选择器

			    ]]
		});
		//查询条件
		var $ = layui.$,active = {
	            reload: function () {
					var categoryName = $('#categoryName').val();
	                table.reload('table', {
	                    page: {
	                        curr: 1//重新从第一页开始
	                    },
	                    where: {
	                        categoryName: categoryName
	                    },
	                    url: URL+'/category/list',//数据接口
	                    contentType: 'application/json',
	                    method: 'post'
	                });
	            }
		};
        $("#search").click(function(){//条件查询事情
	    	var type = $(this).data('type');
	        active[type] ? active[type].call(this) : '';
    	});       
		// 重置事件
		$("#reset").click(function(){
			$("#memberType").val("");
			$("#dr").val("");
			memberType='';
			dr='';
			form.render("select");
	   });

	});
	


});
function editOpen(obj){
	var id = $(obj).parents("tr").find("td[data-field='id']").find("div").text();
	var categoryName = $(obj).parents("tr").find("td[data-field='categoryName']").find("div").text();
	var showTop = $(obj).parents("tr").find("td[data-field='showTop']").find("div").text();
	var url = './goodsCateGoryAdd.html?id='+id+'&categoryName='+categoryName+'&showTop='+showTop;
	url = encodeURI(encodeURI(url));
	xadmin.open('编辑',url,600,400);
}

function delCate(obj){
	var id = $(obj).parents("tr").find("td[data-field='id']").find("div").text();
	var url = URL + "/category/delCategory";
	var param = {}; 
	param.id=id;
	layer.confirm('确定要删除吗?',{
		btn : [ '确定', '取消' ], //按钮
		shade : false
		//不显示遮罩
	},
	function(index) {
		$.ajax({
			url:url,
			contentType: "application/json;charset=UTF-8",
			type:'POST',
			dataType:'json',
			data:JSON.stringify(param),
			success:function(data){
				//请求成功后执行的代码
				var list = eval(data);//解析json  
				if(list.code==200){//请求执行成功
					layer.alert("删除成功", {icon: 6},
					function() {
						location.reload();
					});
				}else{
					layer.open({
						type: 0,
						title:'错误提示',
						content: list.msg
					});
				}
			},
			error:function(data){
				//失败后执行的代码
				layer.open({
						type: 0,
						title:'错误提示',
						content: "请求数据失败!"
				});
			}
		});
		layer.close(index);
		return;
	}, function(index) {
		layer.close(index);
		return;

	});
}

