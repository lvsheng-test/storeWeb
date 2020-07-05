
var goodsName='';//商品名称

$(function(){
	//加载table列表数据
	layui.use(['table','form'],function(){
		//第一个实例
		var table = layui.table;
		var form = layui.form;
		table.render({
			elem: '#test',
			height: 500,
			url: URL+'/goods/list',//数据接口
				method:'post',
				where:{goodsName:goodsName},
				contentType: 'application/json',
				page: true,//开启分页
				response: {
				    "code": 0,
				    "msg": "",
				    "count": 1000,
				    "data": []
				}
				,parseData: function(res){ //res 即为原始返回的数据
				    console.log(res);
				    return {
				        "code": 0, //解析接口状态
				        "msg": "", //解析提示文本
				        "count": res.count, //解析数据长度
				        "data": res.data //解析数据列表
				    };
				},
				cols: [[ //表头
						/*{checkbox: true},*/
				  		{field: 'id', title: 'ID', width:'25%',unresize:true},
				  		{field: 'goodsUrl', title: '商品主图', width:'20%',unresize:true},
				  		{field: 'goodsName', title: '商品名称', width:'20%',unresize:true},
				  		{field: 'goodsNum', title: '商品库存', width:'20%',unresize:true},
                        {field: 'goodsPrice', title: '商品单价', width: '20%'},
                        {field: 'goodsDiscount', title: '商品优惠价', width: '20%'},
                        {field: 'dr', title: '优惠类型',unresize:true,width: '16%',align:'center',templet:function(goods){
                            if(goods.discountType==0){
                                return '<span class="layui-btn layui-btn-normal layui-btn-mini">会员价</span>'
                            }else if(goods.discountType==1){
                                return '<span class="layui-btn layui-btn-normal layui-btn-mini">拼单价</span>'
                            }
                        }},
				  		{field: 'goodsStatus', title: '商品状态',unresize:true,width: '16%',align:'center',templet:function(goods){
				  			if(goods.goodsStatus==0){
				  				return '<span class="layui-btn layui-btn-normal layui-btn-mini">下架</span>'
				  			}else if(goods.goodsStatus==1){
				  				return '<span class="layui-btn layui-btn-normal layui-btn-mini">上架</span>'
				  			}else if(goods.goodsStatus==2){
                                return '<span class="layui-btn layui-btn-normal layui-btn-mini">售罄</span>'
                            }
                          }},
                          {field: 'goodsPrice', title: '商品单价', width: '20%'}

			    ]]
		});
		//查询条件
		var $ = layui.$,active = {
	            reload: function () {
	                var goodsName = $('#goodsName').val();
	                var goodsStatus = $('#goodsStatus').val();
	                table.reload('test', {
	                    page: {
	                        curr: 1//重新从第一页开始
	                    },
	                    where: {
	                        goodsName: goodsName,
	                        goodsStatus:goodsStatus
	                    },
	                    url: URL+'/goods/list',//数据接口
	                    contentType: 'application/json',
	                    method: 'post'
	                });
	            }
	    };
        $("#sreach").click(function(){//条件查询事情
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



//根据父级编码查询字典信息
function searchParentCode(parentCode){
	$.ajax({
        url:URL+'/dict/searchParentCode',
        contentType: "application/json;charset=UTF-8",
        type:'POST',
        dataType:'json',
        data:JSON.stringify({parentCode:parentCode}),
        success:function(data){
            //请求成功后执行的代码
            console.log(data);
            var list = eval(data);//解析json  
            if(list.code==200){//请求执行成功
            	$.each(list.data.dictList, function (index, item) {
						$("#memberType").append(new Option(item.name,item.code));// 下拉菜单里添加元素
					});
					layui.form.render("select");
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
}

