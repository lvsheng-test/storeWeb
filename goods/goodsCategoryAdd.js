
$(function(){
	layui.use(['form', 'layer'],function() {
		$ = layui.jquery;
        var form = layui.form,
        layer = layui.layer;
        
        //自定义验证规则
        form.verify({
            categoryName: function(value) {
                if (value.length == 0) {
                    return '请填写商品类型名';
                }
            },
            showTop: function(value){
            	if (value.length == 0) {
                    return '请选择是否展示首页';
               }
            }
        });
        
        //监听提交
        form.on('submit(add)',function(data) {//验证数据是否通过
        	console.log('进来');
            console.log(data.field);
            //发异步，把数据提交给php
            $.ajax({
		        url:URL_LOCAL+'/category/addCategory',
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

	layui.use('upload', function(){
    	var $ = layui.jquery
  		,upload = layui.upload;
  		//拖拽上传
		upload.render({
		    elem: '#test10',
		    url: URL_LOCAL + '/upload/uploadFile', //改成您自己的上传接口
		    multiple: true,
		    before: function(obj){
			  //预读本地文件示例，不支持ie8
			  obj.preview(function(index, file, result){
				//layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src',result);
			  });
			},
		    done: function(res){
		      layer.msg('上传成功');
		  	  console.log(res)
		      //layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', res.files.file);
		      $('#category_url').val(res.data);
		      layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src',res.data);
		    }
		});
  		
    });

});
