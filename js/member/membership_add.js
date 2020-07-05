

$(function(){
	layui.use(['form', 'layer','jquery'],function() {
        $ = layui.jquery;
        var form = layui.form,
        layer = layui.layer;

        //自定义验证规则
        form.verify({
            cardNo: function(value) {
                if (value.length == 0) {
                    return '请填写会员卡号';
                }
            },
            mobile: function(value){
            	var reg=/^1(3|4|5|6|7|8|9)\d{9}$/;
            	if (value.length == 0) {
                    return '请填写手机号';
                }
            	if(!reg.test(value)){
            		return '请填写正确手机号';
            	}
            },
            amount: function(value) {
            	var reg =/^([^0][0-9]+|0)$/;
                if (value.length == 0) {
                    return '请填写金额';
                }
                if(!reg.test(value)){
            		return '请填写10元以上整数';
            	}
            }
        });

        //监听提交
        form.on('submit(add)',
        function(data) {
            console.log(data.field);
            alert(data);
            //发异步，把数据提交给php
            layer.alert("增加成功", {
                icon: 6
            },
            function() {
                //关闭当前frame
                xadmin.close();

                // 可以对父窗口进行刷新 
                xadmin.father_reload();
            });
            return false;
        });

    });
});
