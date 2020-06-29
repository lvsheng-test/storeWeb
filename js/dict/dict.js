var API_URL='http://192.168.1.10:8088/';
$(function(){
    //字典管理js
    
    
    
    
    
});

function query(params){
	//alert(API_URL)
   $.ajax({
   	   url:API_URL+"dict/queryAll",
   	   async:true,//默认是true，即为异步方式
   	   data:{"parentCode":params,"currentPage":1},
   	   dataType:"json",// 服务器响应的数据类型
   	   type: "POST", // 请求方式
   	   success: function (data) {
          console.log(data);
       }
   });
}