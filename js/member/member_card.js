var URL='http://10.224.194.73:8088';
var memberType='';//会员卡类型
var dr ='';//标识
var nowPage=1;//当前页

$(function(){
	layui.use(['form', 'layer','jquery'],function() {
        var laydate = layui.laydate;
        var  form = layui.form;
		//查询会员卡类型
        searchParentCode('VIP_TYPE');
        //加载Table列表信息
		sreachMemberCardList('','',1);
        // 监听全选
        form.on('checkbox(checkall)', function(data){

          if(data.elem.checked){
            $('tbody input').prop('checked',true);
          }else{
            $('tbody input').prop('checked',false);
          }
          form.render('checkbox');
        }); 
        
        //获取会员卡类型下拉框值
        form.on('select(memberType)',function(data){
        	console.log("获取会员卡类型下拉框值");
        	console.log(data.value)
        	memberType =data.value;
        });
        //获取标识下拉框值
        form.on('select(dr)',function(data){
        	console.log("获取标识下拉框值");
        	console.log(data.value)
        	dr =data.value;
        });
        
        // 重置事件
		$("#reset").click(function(){
			console.log("重置操作")
			$("#memberType").val("");
			$("#dr").val("");
			memberType='';
			dr ='';
			form.render("select");
	   });
    });
    
    
    $("#sreach").click(function(){
    	var memberType = $("#memberType").val();
    	var dr = $("#dr").val();
    	console.log(memberType+'--'+dr)
    	sreachMemberCardList(memberType,dr,1);
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

//查询会员卡信息列表
function sreachMemberCardList(memberType,dr,currentPage){
	console.log("当前页数:"+currentPage);
	nowPage =currentPage;
	$.ajax({
	        url:URL+'/memberCard/queryMemberCardAll',
	        contentType: "application/json;charset=UTF-8",
	        type:'POST',
	        dataType:'json',
	        data:JSON.stringify({memberType:memberType,dr:dr,currentPage:currentPage}),
	        success:function(data){
	            //请求成功后执行的代码
	            console.log(data);
	            var list = eval(data);//解析json  
	            if(list.code==200){//请求执行成功
	            	console.log('请求执行成功');
	            	console.log(list.data.memberCardList);
	            	setTbodyHtml(list.data.memberCardList,currentPage,list.data.pageTotal);    
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

//拼接会员卡列表信息
function setTbodyHtml(data,currentPage,pageTotal){
	console.log('总页数:'+pageTotal);
	var tbody=document.getElementById("tbody-result");
	var page =document.getElementById("pageinfo");
	var pageStr="";
	var str = "";
	for(var i = 0;i < data.length;i++){//循环遍历数据  
		var memberinfo = data[i];
		str +="<tr>";    
		str +="<td><input type=\"checkbox\" name=\"id\" value=\""+memberinfo.id+"\" lay-skin=\"primary\"/>";
        str +="<div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\">";
        str +="<i class=\"layui-icon layui-icon-ok\"></i></div>";
        str +="</td>";
		str +="<td>"+(i+1)+"</td>";
		str +="<td>"+memberinfo.memberType+"</td>";
		str +="<td>"+memberinfo.memberName+"</td>";
		str +="<td>"+memberinfo.cardNo+"</td>";
		str +="<td class=\"td-status\">";
		if(memberinfo.dr=="0"){
			str +="<span class=\"layui-btn layui-btn-normal layui-btn-mini\">已启用</span>";
		}else{
			str +="<span class=\"layui-btn layui-btn-normal layui-btn-mini\">未启用</span>";
		}
		str +="</td>";
		str +="</tr>";
	}
	pageStr +="<div>";
	if(pageTotal==1){
		pageStr +="<a class=\"prev\" href=\"javascript:;\">&lt;&lt;</a>";
		pageStr +="<span class=\"current\">1</span>";
		pageStr +="<a class=\"next\" href=\"javascript:;\">&gt;&gt;</a>";
	}
	if(pageTotal >1){
		if(currentPage==pageTotal){//当前页数等于最后一页
			pageStr +="<a class=\"prev\" href=\"javascript:;\" onclick=\"sreachMemberCardList('"+memberType+"','"+dr+"',"+(nowPage-1)+")\">&lt;&lt;</a>";//可以点击上一页
			for(var i =0;i<pageTotal;i++){
				if(i==(pageTotal-1)){
					pageStr +="<span class=\"current\">"+currentPage+"</span>";
				}else{
					pageStr +="<a class=\"num\" href=\"javascript:;\" onclick=\"sreachMemberCardList('"+memberType+"','"+dr+"',"+(i+1)+")\">"+(i+1)+"</a>";
				}
			}
			pageStr +="<a class=\"next\" href=\"javascript:;\">&gt;&gt;</a>";//不能点击下一页
		}
		if(currentPage==1){//当前页数等于第一页
			pageStr +="<a class=\"prev\" href=\"javascript:;\">&lt;&lt;</a>";//不能点击上一页
			for(var i =0;i<pageTotal;i++){
				if(i==(currentPage-1)){
					pageStr +="<span class=\"current\">"+currentPage+"</span>";
				}else{
					pageStr +="<a class=\"num\" href=\"javascript:;\" onclick=\"sreachMemberCardList('"+memberType+"','"+dr+"',"+(i+1)+")\">"+(i+1)+"</a>";
				}
			}
			pageStr +="<a class=\"next\" href=\"javascript:;\" onclick=\"sreachMemberCardList('"+memberType+"','"+dr+"',"+(nowPage+1)+")\">&gt;&gt;</a>";//可以点击下一页
		}
		if(currentPage>1){//当前也大于第一页 小于最后一页
			if(currentPage<pageTotal){
				pageStr +="<a class=\"prev\" href=\"javascript:;\" onclick=\"sreachMemberCardList('"+memberType+"','"+dr+"',"+(nowPage-1)+")\">&lt;&lt;</a>";//可以点击上一页
			for(var i =0;i<pageTotal;i++){
				if(i==(currentPage-1)){
					pageStr +="<span class=\"current\">"+currentPage+"</span>";
				}else{
					pageStr +="<a class=\"num\" href=\"javascript:;\" onclick=\"sreachMemberCardList('"+memberType+"','"+dr+"',"+(i+1)+")\">"+(i+1)+"</a>";
				}
			}
			pageStr +="<a class=\"next\" href=\"javascript:;\" onclick=\"sreachMemberCardList('"+memberType+"','"+dr+"',"+(nowPage+1)+")\">&gt;&gt;</a>";//可以点击下一页
			}
		}
	}
	
	pageStr +="</div>";
	tbody.innerHTML = str;
	page.innerHTML = pageStr;
}



/*用户-删除*/
function member_del(obj,id){
    layer.confirm('确认要删除吗？',function(index){
      //发异步删除数据
      $(obj).parents("tr").remove();
      layer.msg('已删除!',{icon:1,time:1000});
    });
}



function delAll (argument) {
    var ids = [];

    // 获取选中的id 
    $('tbody input').each(function(index, el) {
        if($(this).prop('checked')){
            ids.push($(this).val())
        }
    });
  
    layer.confirm('确认要删除吗？'+ids.toString(),function(index){
        //捉到所有被选中的，发异步进行删除
        layer.msg('删除成功', {icon: 1});
        $(".layui-form-checked").not('.header').parents('tr').remove();
    });
}