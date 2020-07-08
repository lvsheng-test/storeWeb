
var mobile='';//手机号
$(function(){
	//加载table数据
	layui.use('table', function(){
	    var table = layui.table;
	    //第一个实例
	    table.render({
		    elem: '#test',
				height: 500,
				url: URL+'/memberCard/queryMembershipByPageList',//数据接口
				method:'post',
				where:{mobile:mobile},
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
				  		{field: 'id', title: 'ID', width:'19%',unresize:true,sort:true},
				  		{field: 'mobile', title: '手机号', width:'9%',unresize:true,sort:true},
				  		{field: 'memberType', title: '会员卡类型', width:'10%',unresize:true,sort:true},
				  		{field: 'memberName', title: '会员卡名称', width:'10%',unresize:true,sort:true},
				  		{field: 'cardNo', title: '会员卡卡号', width: '15%',unresize:true,sort:true},
				  		{field: 'amount', title: '金额（元）', width: '10%',unresize:true,sort:true},
				  		{field: 'startTime', title: '开始日期', width: '10%',unresize:true,sort:true,templet:function(d){
				  			return ''+getSmpFormatDateByLong(d.startTime,false)
				  		}},
				  		{field: 'endTime', title: '结束日期', width: '10%',unresize:true,sort:true,templet:function(d){
				  			return ''+getSmpFormatDateByLong(d.endTime,false)
				  		}},
				  		{field: 'dr', title: '会员卡状态',unresize:true, width: '8%',templet:function(d){
				  			if(d.dr=='0'){
				  				return '<span class="layui-btn">有效</span>'
				  			}else{
				  				return '<span class="layui-btn">无效</span>'
				  			}
				  		}}
			    ]]
	    });
	    
	    //查询条件
		var $ = layui.$,active = {
	            reload: function () {
	                var mobile = $('#mobile').val();
	                console.log("手机号:"+mobile)
	                table.reload('test', {
	                    page: {
	                        curr: 1//重新从第一页开始
	                    },
	                    where: {
	                        mobile: mobile
	                    },
	                    url: URL+'/memberCard/queryMembershipByPageList',//数据接口
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
			$("#mobile").val("");
			mobile='';
	   });
			  
	});

});

  
