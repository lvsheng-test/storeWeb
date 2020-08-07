/* layui.use('upload', function() {
	var upload = layui.upload;
	var uploadInst = upload.render({
		elem: '#upImg',
		url: URL_LOCAL + '/goods/uploadFile',
		auto: false,
		bindAction: "#goodsUrl",
		choose: function(obj) {
			var files = obj.pushFile();
			var index, file, indexArr = [];
			for(index in files) {
				indexArr.push(index);
			};
			var iaLen = indexArr.length;
			file = files[indexArr[iaLen - 1]];
			for(var i = 0; i < iaLen - 1; i++) {
				delete files[indexArr[i]];
			}
			try {
				if(file.size > 200 * 1024) {
					delete files[index];
					photoCompress(file, {
						quality: 0.5,
					}, function(base64Codes) {
						var bl = convertBase64UrlToBlob(base64Codes);
						obj.resetFile(index, bl, file.name);
						$("#goodsUrl").trigger("click");
					});
				} else {
					$("#goodsUrl").trigger("click");
				}
			} catch(e) {
				$("#goodsUrl").trigger("click");
			}
		},
		done: function(res) {
			//这里把后台返回的数据进行操作，展示上传完成的图片，具体数据格式参考layui的API
			$("#goodsUrl").val(res.data);
		},
		error: function() {

		}
	});
}); */

$(function(){
	loadId();
	saveGoods();
	searchGoodsType();
	
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
		      $('#ramark_url').val(res.data);
		      layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src',res.data);
		    }
		});
  		
    });
})

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
	var goodsName = decodeURI(theRequest.goodsName);
	var goodsPrice = decodeURI(theRequest.goodsPrice);
	var goodsDiscount = decodeURI(theRequest.goodsDiscount);
	var goodsNum = decodeURI(theRequest.goodsNum);
	var goodsIntro = decodeURI(theRequest.goodsIntro);
	if("undefined" == id || undefined == id){$("#id").val(id);return;}
	$("#id").val(id);
	$("#goodsName").val(regValue(goodsName));
	$("#goodsPrice").val(regValue(goodsPrice));
	$("#goodsDiscount").val(regValue(goodsDiscount));
	$("#goodsNum").val(regValue(goodsNum));
	$("#goodsIntro").val(regValue(goodsIntro));
	var json = {};
	json.id = id;
	$.ajax({
		url:URL_LOCAL + "/goods/queryGoodsPic",
		contentType: "application/json;charset=UTF-8",
		type:'POST',
		dataType:'json',
		data:JSON.stringify(json),
		success:function(data){
			//请求成功后执行的代码
			var list = eval(data.data);//解析json  
			for(var i =0;i<list.length;i++){
			$('#demo2').append('<img style="height:100px;width:80px;margin-left: 15px;cursor: pointer;" src="'+ list[i].goodsUrl +'" class="layui-upload-img" onclick="closeImg(this)">')
			}
		}
	});
	return theRequest; 
}

var array=[];
layui.use('upload', function(){
	var $ = layui.jquery
	,upload = layui.upload;
	upload.render({
		elem: '#goodsMoreUrl'
		,url: URL_LOCAL + '/upload/uploadFile' //改成您自己的上传接口
		,multiple: true
		,before: function(obj){
		  //预读本地文件示例，不支持ie8
		  obj.preview(function(index, file, result){
			$('#demo2').append('<img style="height:100px;width:80px;margin-left: 15px;" src="'+ result +'" alt="'+ file.name +'" class="layui-upload-img" onclick="closeImg(this)">')
		  });
		}
		,done: function(res){
		  //上传完毕
		  array.push(res.data);
		}
	  });
});

//删掉图片
function closeImg(obj){
	layer.confirm('确定要删除这张图片吗？', function(index){
		$(obj).remove();
		layer.close(layer.index);
	}, function () {
	});
}


function regValue(obj){
	if("undefined" == obj || undefined == obj){
		return "";
	}
	return obj;
}

function saveGoods(){
	var url = URL_LOCAL + '/goods/addGoods';
	var id = $("#id").val();
	if("undefined" != id && undefined != id && "" != id && null != id){
		url = URL_LOCAL+'/goods/editGoods';
	}
	layui.use(['form', 'layer'],function() {
                $ = layui.jquery;
                var form = layui.form,
                layer = layui.layer;
                
                
                //自定义验证规则
		        form.verify({
		        	categoryId:function(value){
		        		console.log('商品类型:'+value.length);
		            	if(value.length ==0){
		            		return '请选择商品类型！';
		            	}
		            },
		            goodsName: function(value) {
		            	console.log('商品:'+value)
		                if(value.length == 0){
		                	return '请填写商品名称信息！';
		                }
		            },
		            goodsPrice:function(value){
		            	if(value.length == 0){
		                	return '请填写商品单价信息！';
		                }
		            },
		            goodsNum:function(value){
		            	if(value.length == 0){
		                	return '请填写库存数量,必须是整数！';
		                }
		            },
		            netContent:function(value){
		            	if(value.length == 0){
		                	return '请填写净含量以克为单位计算！';
		                }
		            },
		            saveConditions:function(value){
		            	if(value.length == 0){
		                	return '请填写保存条件信息！';
		                }
		            },
		            shelfLife:function(value){
		            	if(value.length == 0){
		                	return '请填写保质期以天为单位计算！';
		                }
		            }
		        });
                
                //监听提交
                form.on('submit(add)',function(data) {
					let json = data.field;
					json.pictureList = array;
                    $.ajax({
				        url:url,
				        contentType: "application/json;charset=UTF-8",
				        type:'POST',
				        dataType:'json',
				        data:JSON.stringify(json),
				        success:function(data){
				            //请求成功后执行的代码
				            var list = eval(data);//解析json  
							if(list.code==200){//请求执行成功
								layer.alert("保存成功", {icon: 6},function() {
									// 获得frame索引
									// 获得frame索引
			                        var index = parent.layer.getFrameIndex(window.name);
			                        //关闭当前frame
			                        parent.layer.close(index);
			                        window.parent.location.reload();
									//xadmin.close();
								//layer.close(layer.index);
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
}

//查询商品类型列表
function searchGoodsType(){
	console.log('进来')
	$.ajax({
        url:URL_LOCAL+'/category/goodsTypeList',
        contentType: "application/json;charset=UTF-8",
        type:'POST',
        dataType:'json',
        success:function(data){
            //请求成功后执行的代码
            console.log(data);
            var list = eval(data);//解析json  
            if(list.code==200){//请求执行成功
            	$.each(list.data, function (index, item) {
						$("#goods_type").append(new Option(item.categoryName,item.id));// 下拉菜单里添加元素
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