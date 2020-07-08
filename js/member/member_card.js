
var memberType='';//会员卡类型
var dr ='';//标识

$(function(){
	//加载table列表数据
	layui.use(['table','form'],function(){
		searchParentCode('VIP_TYPE');
		//第一个实例
		var table = layui.table;
		var form = layui.form;
		table.render({
			elem: '#test',
			height: 500,
			toolbar:'#toolbarDemo',
			url: URL+'/memberCard/queryMemberCardAll',//数据接口
				method:'post',
				where:{memberType:memberType,dr:dr},
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
				  		{field: 'id', title: 'ID', width:'25%',unresize:true,sort:true},
				  		{field: 'memberType', title: '会员卡类型编码', width:'20%',unresize:true,sort:true},
				  		{field: 'memberName', title: '会员卡类型名称', width:'20%',unresize:true,sort:true},
				  		{field: 'cardNo', title: '会员卡卡号', width: '20%',sort:true},
				  		{field: 'dr', title: '会员卡状态',unresize:true,width: '16%',align:'center',sort:true,templet:function(d){
				  			if(d.dr=='0'){
				  				return '<span class="layui-btn">已启用</span>'
				  			}else{
				  				return '<span class="layui-btn">未启用</span>'
				  			}
				  		}}
			    ]]
		});
		//查询条件
		var $ = layui.$,active = {
	            reload: function () {
	                var memberType = $('#memberType').val();
	                var dr = $('#dr').val();
	                console.log("手机号:"+memberType)
	                table.reload('test', {
	                    page: {
	                        curr: 1//重新从第一页开始
	                    },
	                    where: {
	                        memberType: memberType,
	                        dr:dr
	                    },
	                    url: URL+'/memberCard/queryMemberCardAll',//数据接口
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

