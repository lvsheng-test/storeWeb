

$(function(){
	layui.use('table', function(){
        var table = layui.table;
        table.render({
        	elem: '#test',
        	height: 500,
			url: URL+'/dict/queryConfigAll',//数据接口
			method:'post',
			//where:{mobile:mobile},
			contentType: 'application/json',
			page: true,//开启分页
        	response: {
			    "code": 0,
			    "msg": "",
			    "count": 1000,
			    "data": []
			},parseData: function(res){ //res 即为原始返回的数据
			    console.log(res);
			    return {
			        "code": 0, //解析接口状态
			        "msg": "", //解析提示文本
			        "count": res.count, //解析数据长度
			        "data": res.data //解析数据列表
			    };
			},
			cols: [[ //表头
		  		{field: 'id', title: 'ID', width:'26%',unresize:true},
		  		{field: 'type', title: '类型编码', width:'15%',unresize:true},
		  		{field: 'name', title: '类型名称', width:'15%',unresize:true},
		  		{field: 'proportion', title: '返现比例', width:'15%',unresize:true},
		  		{field: 'ts', title: '更新时间', width:'15%',unresize:true,templet:function(d){
		  			console.log('时间格式:'+d.ts);
		  			return ''+getSmpFormatDateByLong(d.ts,false);
		  		}},
		  		{title: '操作', width:'15%',unresize:true,templet:function(d){
		  			return '<button type="button" class="layui-btn ">编辑</button>'
		  		}}	
			]]
       });
    });
});

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
