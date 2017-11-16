<h1>漂亮实用的动画效果</h1>
<p>边框hover样式，灰常炫酷</p>
    <h1>rem单位，javascrip自动获取窗口大小代码</h1>
    <script>
        /*最好把响应式JS代码写成单独的JS文件*/
        (function(){
            var recalc=function(){
                var design=750;//设计稿尺寸
                var maxSize=414;//最宽screen(目前使用iPhone 6 Plus)
                var cent=design/100;//100px参照，方便计算rem值
                var docEle=document.documentElement;
                var pageWidth=docEle.clientWidth;
                var dpr=window.devicePixelRatio||2;//设备像素比，普遍是2
                if(pageWidth/dpr<design){pageWidth=design*dpr;}
                var scale=1/dpr;
                var fontSize=100*(pageWidth/design);//html节点的font-size
                //docEle.dataset.dpr=dpr;
                if(window.screen.width>maxSize){scale=1;fontSize=100;}//最宽screen处理，默认就显示这么宽，你还可处理跳转到对应的电脑版网页
                var viewportContent='initial-scale='+scale+',minimum-scale='+scale+',maximum-scale='+scale+',user-scalable=no';
                var viewport=document.querySelector('meta[name="viewport"]');
                if(viewport){
                    viewport.setAttribute('content',viewportContent);
                }else{
                    var eleMeta=document.createElement('meta');
                        eleMeta.name='viewport';
                        eleMeta.content=viewportContent;
                    docEle.firstElementChild.appendChild(eleMeta);
                }
                docEle.style.fontSize=fontSize+'px';
                if(document.readyState=='complete'){
                    document.body.style.maxWidth=cent+'rem';
                }else{
                    document.addEventListener('DOMContentLoaded',function(){document.body.style.maxWidth=cent+'rem';},false);
                };
            };
            //初始化
            recalc();
            //屏幕改变时
            resizeEvt='orientationchange' in window?'orientationchange':'resize';
            window.addEventListener(resizeEvt,recalc,false);
        }());
    </script>
