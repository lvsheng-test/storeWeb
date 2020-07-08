

$(function(){
	layui.use(['form', 'layer'],function() {
        $ = layui.jquery;
        var form = layui.form,
        layer = layui.layer;

        //自定义验证规则
        form.verify({
            cardNo: function(value) {
                if (value.length == 0) {
                    return '请填写会员卡号';
                }
            },
            mobile: function(value){
            	var reg=/^1(3|4|5|6|7|8|9)\d{9}$/;
            	if (value.length == 0) {
                    return '请填写手机号';
                }
            	if(!reg.test(value)){
            		return '请填写正确手机号';
            	}
            },
            amount: function(value) {
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
		        url:URL+'/memberCard/queryCardNoAndMoblie',
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
	                        window.parent.location.reload();
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

//手机失去下标触发事件
/*function mobileBlur(){
	var cardNo = $("#card_no").val();
	var mobile = $("#mobile").val();
	console.log(cardNo+"--"+mobile);
	$.ajax({
	        url:URL+'/memberCard/queryCardNoAndMoblie',
	        contentType: "application/json;charset=UTF-8",
	        type:'POST',
	        dataType:'json',
	        data:JSON.stringify({cardNo:cardNo,mobile:mobile}),
	        success:function(data){
	            //请求成功后执行的代码
	            var list = eval(data);//解析json  
	            console.log(data);
				if(list.code==200){//请求执行成功
					console.log('验证通过')
					return true;
	            }else{
	            	console.log(list.msg)
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
	
	
}*/