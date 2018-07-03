/**
 * Created by Administrator on 2017/2/14.
 */
window.onload=function(){
	// 设计图宽度
    window['adaptive'].desinWidth = 640;
    	// body 字体大小 会将body字体大小设置为 baseFont / 100 + 'rem'  750的设计图一般设置为28,640的设计图一般设置为24
    window['adaptive'].baseFont = 24;
   		 /*
    	// 显示最大宽度 可选
    	window['adaptive'].maxWidth = 480;
    	// rem值改变后执行方法 可选
    	window['adaptive'].setRemCallback = function () {
       	 alert(1)
   		 }	
    	// scaleType 1:iphone andriod下viewport均无缩放 2:iphone下viewport有缩放,andriod没有 3:iphone andriod下viewport均有缩放; 默认值为1
    	window['adaptive'].scaleType = 1;
    	*/
    	/*// 将1rem转换为像素值
		window['adaptive'].remToPx(1);
		window['adaptive'].scaleType = 2  // iphone下缩放，retina显示屏下能精确还原1px
		window['adaptive'].scaleType = 1 // 没有缩放，能快速开发的版本
		window['adaptive'].scaleType = 3 // 无论iphone还是安卓手机，都能精确还原1px，做到高度还原视觉稿，如果只是在webview里使用，建议使用，否则请谨慎使用*/
    	// 初始化
   	window['adaptive'].init();
	window.adaptive.reflow();//防止部分chrome版本局部刷新时字体过大问题
	var viewH=document.documentElement.clientHeight;
    var viewW=document.documentElement.clientWidth;
    /*var oDiv=document.getElementsByTagName('div')[0];
    oDiv.style.width=viewW+'px';
    oDiv.style.height=viewH+'px';*/
    /*window.addEventListener('native.keyboardshow',eventHandler);
	function eventHandler(){
    	document.body.scrollTop=0;
    	document.documentElement.scrollTop = 0;//兼容不同版本的浏览器
    	window.pageYOffset = 0;
	};
	eventHandler();*/
}

