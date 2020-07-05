<<<<<<< HEAD
var URL='http://127.0.0.1:8088';
=======
var URL='http://localhost:8088';
>>>>>>> 883d70bea9b8486ed50b0336ac5ee080afa2a9d5

$(function(){
	layui.use(['form', 'layer','jquery'],function() {
        $ = layui.jquery;
        var form = layui.form,
        layer = layui.layer;
        
        //查询会员卡类型
        searchParentCode('VIP_TYPE');

        //自定义验证规则
        form.verify({
        	memberType:function(value){
        		console.log('会员卡:'+value.length);
            	if(value.length ==0){
            		return '请选择会员卡类型';
            	}
            },
            number: function(value) {
            	console.log('卡数:'+value)
            	var reg = /^[0-9]*$/;
                if (value > 10) {
                    return '一次性最多开10张';
                }
                if(value.length == 0){
                	return '开卡张数必填';
                }
                if(!reg.test(value)){
                	return '必须是数字';
                }
            }
        });
        //监听提交
        form.on('submit(add)',
        function(data) {
			var index = layer.getFrameIndex(window.name);
            $.ajax({
		        url:URL+'/memberCard/insertMemberCardAll',
		        contentType: "application/json;charset=UTF-8",
		        type:'POST',
		        dataType:'json',
		        data:JSON.stringify(data.field),
		        success:function(data){
		            //请求成功后执行的代码
		            console.log(data);
		            var list = eval(data);//解析json  
					if(list.code==200){//请求执行成功
						layer.close(index);
		            	layer.alert("增加成功", {icon: 6},
	                    function() {
	                        alert(1);
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
            return false;
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
						$("#member_type").append(new Option(item.name,item.code));// 下拉菜单里添加元素
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

