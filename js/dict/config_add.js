
$(function(){
	layui.use(['form', 'layer','jquery'],
            function() {
                $ = layui.jquery;
                var form = layui.form,
                layer = layui.layer;
				searchConfigType();
                //自定义验证规则
                form.verify({
                	configType:function(value){
                		if (value.length == 0) {
                            return '请选择配置类型！';
                        }
                	},
                    proportion: function(value) {
                        if (value.length == 0) {
                            return '请填写返佣比例！';
                        }
                    }
                });

                //监听提交
                form.on('submit(add)',function(data) {
                    console.log(data.field);
                    $.ajax({
				        url:URL_LOCAL+'/dict/insertConfigProportion',
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

//根据父级编码查询字典信息
function searchConfigType(){
	console.log('进来')
	$.ajax({
        url:URL_LOCAL+'/dict/getConfigTYpe',
        success:function(data){
            //请求成功后执行的代码
            console.log(data);
            var list = eval(data);//解析json  
            if(list.code==200){//请求执行成功
            	$.each(list.data, function (index, item) {
						$("#config_type").append(new Option(item.message,item.code));// 下拉菜单里添加元素
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
