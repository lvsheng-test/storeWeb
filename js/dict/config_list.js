

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

