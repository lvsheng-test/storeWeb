
var categoryName = $("#categoryName").val();//商品名称

$(function(){
	//加载table列表数据
	layui.use(['table','form'],function(){
		//第一个实例
		var table = layui.table;
		var form = layui.form;
		table.render({
			elem: '#table',
			height: 500,
			url: URL_LOCAL+'/category/list',//数据接口
			method:'post',
			where:{categoryName:categoryName},
			contentType: 'application/json',
			page: true,//开启分页
			parseData: function(res){ //res 即为原始返回的数据
				    return {
				        "code": 0, //解析接口状态
				        "msg": "", //解析提示文本
				        "count": res.data.total, //解析数据长度
				        "data": res.data.list //解析数据列表
				    };
				},
				cols: [[ //表头
						{checkbox: true,width:'4%'},
				  		{field: 'id', title: 'ID', width:'19%',unresize:true},
				  		{field: 'categoryName', title: '分类名称', width:'10%',unresize:true},
				  		{field: 'categoryUrl', title: '图片LOGO', width:'30%',unresize:true,align:'center',templet:function(cate){
				  			var img='<img src="'+cate.categoryUrl+'" alt="上传成功后渲染" style="max-width: 50px;height:50px;">';
				  			return img;
				  		}},
                        {field: 'showTop', title: '是否展示到首页',unresize:true,width: '13%',align:'center',templet:function(cate){
                            if(cate.showTop==0){
                                return '<span>否</span>';
                            }else if(cate.showTop==1){
                                return '<span>是</span>';
                            }
						}},
						{fixed: 'right',title: '操作', width:'21%', align:'center', toolbar: '#barDemo'} //这里的toolbar值是模板元素的选择器

			    ]]
		});
		//查询条件
		var $ = layui.$,active = {
	            reload: function () {
					var categoryName = $('#categoryName').val();
	                table.reload('table', {
	                    page: {
	                        curr: 1//重新从第一页开始
	                    },
	                    where: {
	                        categoryName: categoryName
	                    },
	                    url: URL+'/category/list',//数据接口
	                    contentType: 'application/json',
	                    method: 'post'
	                });
	            }
		};
        $("#search").click(function(){//条件查询事情
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
	//图片上传
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
				layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src',result);
			  });
			},
		    done: function(res){
		      layer.msg('上传成功');
		  	  console.log(res)
		      //layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', res.files.file);
		      $('#category_url').val(res.data);
		    }
		});
  		
    });
	
	//编辑商品类型
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
		        url:URL_LOCAL+'/category/editCategory',
		        contentType: "application/json;charset=UTF-8",
		        type:'POST',
		        dataType:'json',
		        data:JSON.stringify(data.field),
		        success:function(data){
		            //请求成功后执行的代码
		            console.log(data);
		            var list = eval(data);//解析json  
		            if(list.code==200){//请求执行成功
		            	layer.alert("编辑成功", {icon: 6},
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
function editOpen(obj){

	var id = $(obj).parents("tr").find("td[data-field='id']").find("div").text();
	var categoryName = $(obj).parents("tr").find("td[data-field='categoryName']").find("div").text();
	var showTop = $(obj).parents("tr").find("td[data-field='showTop']").find("div").text();
	var categoryUrl = $(obj).parents("tr").find("td[data-field='categoryUrl']").find("div").text();
	
	$("#category_id").val(id);
    $("#category_url").val(categoryUrl);
    $("#category_name").val(categoryName);
    $("#showTop").val(showTop);
	
	layer.open({
    	title:'编辑商品类型',
    	type: 1,
        area: ['650px', '550px'],
        content:$("#exitGoods"),
        success:function(){
        	console.log('回调成功！')
        }
    });
	
	/*var url = './goodsCateGoryAdd.html?id='+id+'&categoryName='+categoryName+'&showTop='+showTop;
	url = encodeURI(encodeURI(url));
	xadmin.open('编辑',url,600,400);*/
}


function delCate(obj){
	var id = $(obj).parents("tr").find("td[data-field='id']").find("div").text();
	var url = URL_LOCAL + "/category/delCategory";
	var param = {}; 
	param.id=id;
	layer.confirm('确定要删除吗?',{
		btn : [ '确定', '取消' ], //按钮
		shade : false
		//不显示遮罩
	},
	function(index) {
		$.ajax({
			url:url,
			contentType: "application/json;charset=UTF-8",
			type:'POST',
			dataType:'json',
			data:JSON.stringify(param),
			success:function(data){
				//请求成功后执行的代码
				var list = eval(data);//解析json  
				if(list.code==200){//请求执行成功
					layer.alert("删除成功", {icon: 6},
					function() {
						location.reload();
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
		layer.close(index);
		return;
	}, function(index) {
		layer.close(index);
		return;

	});
}

