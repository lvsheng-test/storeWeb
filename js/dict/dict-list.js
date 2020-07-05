
var paranCode='';
var nowPage=1;//当前页
$(function(){
	layui.use(['form', 'layer','jquery'],function() {
        $ = layui.jquery;
        var form = layui.form;
        
        //页面加载执行数据字典列表请求
        sreachDictList('',1);
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
        //获取下拉框值
        form.on('select(parent_code)',function(data){
        	
        	console.log(data.value)
        	paranCode =data.value;
        });
        
        /*form.on('submit(sreach)',function(data){
        	console.log("点击搜索:");
        	console.log(data.field.parent_code);
        	
        });*/
        
        // 监听全选
        form.on('checkbox(checkall)', function(data){

          if(data.elem.checked){
            $('tbody input').prop('checked',true);
          }else{
            $('tbody input').prop('checked',false);
          }
          form.render('checkbox');
        }); 
        // 重置事件
		$("#reset").click(function(){
			console.log("重置操作")
			$("#parent_code").val("");
			paranCode='';
			form.render("select");
	    });
    });
    //查询操作
    $("#sreach").click(function(){
    	var parent_code = $("#parent_code").val();
    	sreachDictList(parent_code,1);
    	//alert(parent_code)
    });
    
    

});
/*用户-删除*/
function member_del(obj, id) {
    layer.confirm('确认要删除吗？',
    function(index) {
        //发异步删除数据
        console.log("删除的ID:"+id)
        delDictInfo(id);
        $(obj).parents("tr").remove();
    });
}

function delDictInfo(dicId){
	$.ajax({
        url:URL+'/dict/deleteDictInfo',
        contentType: "application/json;charset=UTF-8",
        type:'POST',
        dataType:'json',
        data:JSON.stringify({id:dicId}),
        success:function(data){
            //请求成功后执行的代码
            console.log(data);
            var list = eval(data);//解析json  
            if(list.code==200){//请求执行成功
            	layer.msg('已删除!', {icon: 1,time: 1000});
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


function delAll (argument) {
var ids = [];
// 获取选中的id 
$('tbody input').each(function(index, el) {
    if($(this).prop('checked')){
               ids.push($(this).val())
            }
        });
  	if(ids.length==0){
  		layer.msg('请选择要删除的数据!', {icon: 7,time: 1000});
  	}else{
  		layer.confirm('确认要删除吗？',function(index){
  			delDictInfo(ids.toString());
	    	//捉到所有被选中的，发异步进行删除
	    	$(".layui-form-checked").not('.header').parents('tr').remove();
    	});
  	}
  }

//查询字典表列表
function sreachDictList(parentCode,currentPage){
	console.log("当前页数:"+currentPage);
	nowPage =currentPage;
	$.ajax({
	        url:URL+'/dict/queryAll',
	        contentType: "application/json;charset=UTF-8",
	        type:'POST',
	        dataType:'json',
	        data:JSON.stringify({parentCode:parentCode,currentPage:currentPage}),
	        success:function(data){
	            //请求成功后执行的代码
	            console.log(data);
	            var list = eval(data);//解析json  
	            if(list.code==200){//请求执行成功
	            	console.log('请求执行成功');
	            	console.log(list.data.dictList);
	            	setTbodyHtml(list.data.dictList,currentPage,list.data.pageTotal);
	            	    
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

//拼接字典列表信息
function setTbodyHtml(data,currentPage,pageTotal){
	console.log('总页数:'+pageTotal);
	var tbody=document.getElementById("tbody-result");
	var page =document.getElementById("pageinfo");
	var pageStr="";
	var str = "";  
	for(var i = 0;i < data.length;i++){//循环遍历数据  
        var dictinfo = data[i];  
        str +="<tr>";               
        str +="<td><input type=\"checkbox\" name=\"id\" value=\""+dictinfo.id+"\" lay-skin=\"primary\"/>";
        str +="<div class=\"layui-unselect layui-form-checkbox\" lay-skin=\"primary\">";
        str +="<i class=\"layui-icon layui-icon-ok\"></i></div>";
        str +="</td>";
        str +="<td>"+(i+1)+"</td>";
        str +="<td>"+dictinfo.code+"</td>";
        str +="<td>"+dictinfo.name+"</td>";
        str +="<td>"+dictinfo.parentName+"</td>";
        str +="<td>"+dictinfo.parentCode+"</td>";
        str +="<td>"+getSmpFormatDateByLong(dictinfo.ts,false)+"</td>";
        str +="<td class=\"td-manage\">";
        str +="<span class=\"layui-btn layui-btn-danger layui-btn-mini\" onclick=\"member_del(this,'"+dictinfo.id+"')\">删除</span>";
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
			pageStr +="<a class=\"prev\" href=\"javascript:;\" onclick=\"sreachDictList('"+paranCode+"',"+(nowPage-1)+")\">&lt;&lt;</a>";//可以点击上一页
			for(var i =0;i<pageTotal;i++){
				if(i==(pageTotal-1)){
					pageStr +="<span class=\"current\">"+currentPage+"</span>";
				}else{
					pageStr +="<a class=\"num\" href=\"javascript:;\" onclick=\"sreachDictList('"+paranCode+"',"+(i+1)+")\">"+(i+1)+"</a>";
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
					pageStr +="<a class=\"num\" href=\"javascript:;\" onclick=\"sreachDictList('"+paranCode+"',"+(i+1)+")\">"+(i+1)+"</a>";
				}
			}
			pageStr +="<a class=\"next\" href=\"javascript:;\" onclick=\"sreachDictList('"+paranCode+"',"+(nowPage+1)+")\">&gt;&gt;</a>";//可以点击下一页
		}
		if(currentPage>1){//当前也大于第一页 小于最后一页
			if(currentPage<pageTotal){
				pageStr +="<a class=\"prev\" href=\"javascript:;\" onclick=\"sreachDictList('"+paranCode+"',"+(nowPage-1)+")\">&lt;&lt;</a>";//可以点击上一页
			for(var i =0;i<pageTotal;i++){
				if(i==(currentPage-1)){
					pageStr +="<span class=\"current\">"+currentPage+"</span>";
				}else{
					pageStr +="<a class=\"num\" href=\"javascript:;\" onclick=\"sreachDictList('"+paranCode+"',"+(i+1)+")\">"+(i+1)+"</a>";
				}
			}
			pageStr +="<a class=\"next\" href=\"javascript:;\" onclick=\"sreachDictList('"+paranCode+"',"+(nowPage+1)+")\">&gt;&gt;</a>";//可以点击下一页
			}
		}
	}
	
	pageStr +="</div>";
	tbody.innerHTML = str;
	page.innerHTML = pageStr;
}



//扩展Date的format方法   
Date.prototype.format = function (format) {  
    var o = {  
        "M+": this.getMonth() + 1,  
        "d+": this.getDate(),  
        "h+": this.getHours(),  
        "m+": this.getMinutes(),  
        "s+": this.getSeconds(),  
        "q+": Math.floor((this.getMonth() + 3) / 3),  
        "S": this.getMilliseconds()  
    }  
    if (/(y+)/.test(format)) {  
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    }  
    for (var k in o) {  
        if (new RegExp("(" + k + ")").test(format)) {  
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));  
        }  
    }  
    return format;  
}  
/**   
*转换日期对象为日期字符串   
* @param date 日期对象   
* @param isFull 是否为完整的日期数据,   
*               为true时, 格式如"2000-03-05 01:05:04"   
*               为false时, 格式如 "2000-03-05"   
* @return 符合要求的日期字符串   
*/    
function getSmpFormatDate(date, isFull) {  
    var pattern = "";  
    if (isFull == true || isFull == undefined) {  
        pattern = "yyyy-MM-dd hh:mm:ss";  
    } else {  
        pattern = "yyyy-MM-dd";  
    }  
    return getFormatDate(date, pattern);  
}  
/**   
*转换当前日期对象为日期字符串   
* @param date 日期对象   
* @param isFull 是否为完整的日期数据,   
*               为true时, 格式如"2000-03-05 01:05:04"   
*               为false时, 格式如 "2000-03-05"   
* @return 符合要求的日期字符串   
*/    
  
function getSmpFormatNowDate(isFull) {  
    return getSmpFormatDate(new Date(), isFull);  
}  
/**   
*转换long值为日期字符串   
* @param l long值   
* @param isFull 是否为完整的日期数据,   
*               为true时, 格式如"2000-03-05 01:05:04"   
*               为false时, 格式如 "2000-03-05"   
* @return 符合要求的日期字符串   
*/    
  
function getSmpFormatDateByLong(l, isFull) {  
    return getSmpFormatDate(new Date(l), isFull);  
}  
/**   
*转换long值为日期字符串   
* @param l long值   
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss   
* @return 符合要求的日期字符串   
*/    
  
function getFormatDateByLong(l, pattern) {  
    return getFormatDate(new Date(l), pattern);  
}  
/**   
*转换日期对象为日期字符串   
* @param l long值   
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss   
* @return 符合要求的日期字符串   
*/    
function getFormatDate(date, pattern) {  
    if (date == undefined) {  
        date = new Date();  
    }  
    if (pattern == undefined) {  
        pattern = "yyyy-MM-dd hh:mm:ss";  
    }  
    return date.format(pattern);  
}  
