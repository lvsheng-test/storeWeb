
var mobile='';//手机号
var memberType='';//会员卡类型
$(function(){
	//加载table数据
	layui.use(['table','form'], function(){
		searchParentCode('VIP_TYPE');
	    var table = layui.table;
	    var form = layui.form;
	    //第一个实例
	    table.render({
		    elem: '#test',
				height: 500,
				url: URL_LOCAL+'/memberCard/queryMembershipByPageList',//数据接口
				method:'post',
				where:{mobile:mobile},
				contentType: 'application/json',
				page: true,//开启分页
				toolbar:'#toolbarDemo',
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
						{checkbox: true,width:'4%'},
				  		{field: 'id', title: 'ID', width:'19%',unresize:true,sort:true},
				  		{field: 'mobile', title: '手机号', width:'9%',unresize:true,sort:true},
				  		{field: 'memberType', title: '会员卡类型', width:'10%',unresize:true,sort:true},
				  		{field: 'memberName', title: '会员卡名称', width:'10%',unresize:true,sort:true},
				  		{field: 'cardNo', title: '会员卡卡号', width: '14%',unresize:true,sort:true},
				  		{field: 'amount', title: '金额（元）', width: '10%',unresize:true,sort:true},
				  		{field: 'startTime', title: '开始日期', width: '8%',unresize:true,templet:function(d){
				  			return ''+getSmpFormatDateByLong(d.startTime,false)
				  		}},
				  		{field: 'endTime', title: '结束日期', width: '8%',unresize:true,templet:function(d){
				  			return ''+getSmpFormatDateByLong(d.endTime,false)
				  		}},
				  		{field: 'dr', title: '状态',unresize:true, width: '9%',templet:function(d){
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
	                var memberType = $('#memberType').val();
	                console.log("手机号:"+mobile)
	                table.reload('test', {
	                    page: {
	                        curr: 1//重新从第一页开始
	                    },
	                    where: {
	                        mobile: mobile,
	                        memberType:memberType,
	                    },
	                    url: URL_LOCAL+'/memberCard/queryMembershipByPageList',//数据接口
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
			$("#memberType").val("");
			mobile='';
			memberType='';
			form.render("select");
	   });
	   
	    //头工具栏事件 充值事件
	    table.on('toolbar(test)',function(obj){
	    	var checkStatus = table.checkStatus(obj.config.id);
	    	switch (obj.event) {
	    		case 'doRecharge':
                    var data = checkStatus.data;
                    console.log(data)
                    if(data.length==0){
                    	layer.msg('请选择要充值的会员卡！', {icon: 2,time: 2000});
                    	break;
                    }
                    if(data.length>1){
                    	layer.msg('请选择一张会员卡充值！', {icon: 2,time: 2000});
                    	break;
                    }
                    if(data[0].memberName !='会员卡'){
                    	layer.msg('请选择会员卡充值！', {icon: 2,time: 2000});
                    	break;
                    }
                    //给文本框赋值
                    $("#id").val(data[0].id);
                    $("#card_no").val(data[0].cardNo);
                    $("#member_mobile").val(data[0].mobile);
                    $("#amount").val(data[0].amount);
                    layer.open({
                    	title:'会员充值',
                    	type: 1,
		                area: ['600px', '400px'],
		                content:$("#rechargeId"),
		                success:function(){
		                	console.log('回调成功！')
		                }
                    });
                    //layer.alert(JSON.stringify(data));
                    break;
	    	};
	    });
	});
	
	/******************会员卡充值*****************/
	layui.use(['form', 'layer'],function() {
        $ = layui.jquery;
        var form = layui.form,
        layer = layui.layer;

        //自定义验证规则
        form.verify({
            rechargeAmount: function(value) {
            	var reg =/^([^0][0-9]+|0)$/;
                if (value.length == 0) {
                    return '请填写金额';
                }
                if(!reg.test(value)){
            		return '请填写10元以上整数';
            	}
            }
        });

        //监听提交
        form.on('submit(add)',function(data) {//验证数据是否通过
        	console.log('进来');
            console.log(data.field);
            //发异步，把数据提交给php
            $.ajax({
		        url:URL_LOCAL+'/memberCard/doRecharge',
		        contentType: "application/json;charset=UTF-8",
		        type:'POST',
		        dataType:'json',
		        data:JSON.stringify(data.field),
		        success:function(data){
		            //请求成功后执行的代码
		            console.log(data);
		            var list = eval(data);//解析json  
		            if(list.code==200){//请求执行成功
		            	layer.alert("增加成功", {icon: 6},
	                    function() {
	                        // 获得frame索引
	                        var index = parent.layer.getFrameIndex(window.name);
	                        //关闭当前frame
	                        parent.layer.close(index);
	                        window.location.reload();
            			});
		            }else{
		            	layer.msg(list.msg, {icon: 2,time: 2000});
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
            return false;
        });

    });

});


//获取会员卡下拉框
function searchParentCode(parentCode){
	$.ajax({
        url:URL_LOCAL+'/dict/searchParentCode',
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
