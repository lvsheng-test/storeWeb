$(function(){
	//加载table列表数据
	layui.use(['table','form'],function(){
		//第一个实例
		var table = layui.table;
		var form = layui.form;
		table.render({
			elem: '#table',
			height: 500,
			url: URL_LOCAL+'/goods/list',//数据接口
			method:'post',
			where:{goodsName:'11'},
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
						{checkbox: true,width:'4%'},
				  		{field: 'id', title: 'ID', width:'10%',unresize:true},
				  		{field: 'categoryName', title: '商品类型', width:'8%',unresize:true},
						{field: 'goodsName', title: '商品名称', width:'11%',unresize:true},
						{field: 'goodsUrl', title: '商品主图',unresize:true,width: '8%',align:'center',templet:function(cate){
							var str = cate.goodsUrl.split(',');
							return "<a href='#' onclick='shopImg(\""+str[0]+"\")'>查看</a>";
						}},
						{field: 'goodsPrice', title: '单价(元)', width:'8%',unresize:true},
						{field: 'goodsDiscount', title: '差价(元)', width:'8%',unresize:true},
						{field: 'goodsNum', title: '商品库存', width:'8%',unresize:true},
						{field: 'netContent', title: '净含量(g)', width:'8%',unresize:true},
                        {field: 'goodsStatus', title: '商品状态',unresize:true,width: '8%',align:'center',templet:function(cate){
							switch(cate.goodsStatus){
								case 0:
								return '<span>下架</span>';
								case 1:
								return '<span>上架</span>';
								case 2:
								return '<span>售罄</span>';
							}
						}},
						{field: 'createTime', title: '创建时间', width:'10%',unresize:true,templet:function(cate){
				  			return ''+getSmpFormatDateByLong(cate.createTime,false)
				  		}},
						{fixed: 'right',title: '操作', width:'7%', align:'center', toolbar: '#barDemo'} //这里的toolbar值是模板元素的选择器

			    ]]
		});
		//查询条件
		var $ = layui.$,active = {
	            reload: function () {
	                table.reload('table', {
	                    page: {
	                        curr: 1//重新从第一页开始
	                    },
	                    where: {
	                        goodsName: $("#goodsName").val()
	                    },
	                    url: URL_LOCAL+'/goods/list',//数据接口
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
	   //监听行工具事件
		table.on('tool(table)', function(obj){
			var data = obj.data;
			if(obj.event === 'del'){
			layer.confirm('确定要删除吗？', function(index){
				$.ajax({
					url:URL_LOCAL + "/goods/delGoods",
					contentType: "application/json;charset=UTF-8",
					type:'POST',
					dataType:'json',
					data:JSON.stringify(data),
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
			});
			} else if(obj.event === 'edit'){
				var url = './goodsAdd.html?id='+data.id+'&goodsName='+data.goodsName+'&goodsPrice='+data.goodsPrice+'&goodsDiscount='+data.goodsDiscount+'&goodsNum='+data.goodsNum+'&goodsIntro='+data.goodsIntro;
				url = encodeURI(encodeURI(url));
				xadmin.open('编辑',url,700,570);
			}
		});
	});
	


});
function shopImg(goodsUrl){
           //页面层
           layer.open({
               type: 1,
               skin: 'none', //加上边框
               area: ['45%', '65%'], //宽高
               shadeClose: true, //开启遮罩关闭
               end: function (index, layero) {
                   return false;
               },
               content: '<div style="text-align:center"><img src="' + goodsUrl + '" /></div>'
           });
}


