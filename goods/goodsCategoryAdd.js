var url = URL+'/category/addCategory';

$(function(){
	loadId();
	var id = $("#id").val();
	if("undefined" != id && undefined != id && "" != id && null != id){
		url = URL+'/category/editCategory';
	}
	layui.use(['form', 'layer'],function() {
                $ = layui.jquery;
                var form = layui.form,
                layer = layui.layer;
                //监听提交
                form.on('submit(add)',function(data) {
                    console.log(data);
                    //发异步，把数据提交给php
                    $.ajax({
				        url:url,
				        contentType: "application/json;charset=UTF-8",
				        type:'POST',
				        dataType:'json',
				        data:JSON.stringify(data.field),
				        success:function(data){
				            //请求成功后执行的代码
				            var list = eval(data);//解析json  
				            if(list.code==200){//请求执行成功
				            	layer.open({
								    type: 0,
								    title:'提示',
								    content: "保存成功"
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


function loadId(){
	var url = location.search; //获取url中"?"符后的字串  
	var theRequest = new Object();  
	if (url.indexOf("?") != -1) {  
		var str = url.substr(1);  
		strs = str.split("&");  
		for(var i = 0; i < strs.length; i ++) {  
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
		}  
	}  
	var id = decodeURI(theRequest.id);
	var categoryName = decodeURI(theRequest.categoryName);
	var showTop = decodeURI(theRequest.showTop);
	if("undefined" == id || undefined == id){$("#id").val(id);return;}
	$("#id").val(id);
	$("#categoryName").val(categoryName);
	return theRequest; 
}
