var URL='http://127.0.0.1:8088';
$(function(){
	layui.use(['form', 'layer'],function() {
                $ = layui.jquery;
                var form = layui.form,
                layer = layui.layer;
                
                //查询字典表列表
	        $.ajax({
		        url:URL+'/dict/getDictParentCode',
		        success:function(data){
		            //请求成功后执行的代码
		            console.log(data);
		            var list = eval(data);//解析json  
		            if(list.code==200){//请求执行成功
		            	console.log('获取字典类型信息成功');
		            	console.log(list.data);
		            	$.each(list.data, function (index, item) {
							$("#parent_code").append(new Option(item.message,item.code));// 下拉菜单里添加元素
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

                //监听提交
                form.on('submit(add)',function(data) {
                    console.log(data);
                    //发异步，把数据提交给php
                    $.ajax({
				        url:URL+'/dict/inserDictInfo',
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