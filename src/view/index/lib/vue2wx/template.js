/**
 * @author xiaojue
 * @fileoverview 转换vue的tpl部分到微信小程序
 *
 * tag转换规则：
 * view: aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section
 * div,dd,dl,dt,ol,ul,li,p,main,
 * i,
 * table,thead,tbody,td,th,tr,
 * fieldset,legend,
 * a
 *
 * block:template
 *
 * scroll-view:scroll-view
 *
 * swiper:swiper
 *
 * movable-view:movable-view,
 *
 * cover-view:cover-view
 *
 * icon:icon
 *
 * text:span
 *
 * rich-text:iframe-indoc
 *
 * progress:progress 
 *
 * button:button
 *
 * checkbox:checkbox
 *
 * checkbox-group:checkbox-group
 *
 * form:form
 *
 * input:input
 *
 * label:label
 *
 * picker:picker
 *
 * picker-view:picker-view
 *
 * radio:radio
 *
 * slider:slider
 *
 * switch:switch
 *
 * textarea:textarea
 *
 * navigator:navigator
 *
 * audio:audio
 *
 * image:image
 *
 * video:video
 *
 * camera:camera
 *
 * live-player:live-player
 *
 * live-pusher:live-pusher
 *
 * map:map
 *
 * canvas:canvas
 *
 * open-data:open-data
 *
 * web-view:iframe-src
 *
 * 【不支持】:vue中的自定义component的转换，以及slot等特性
 * 
 * 【指令】:
 *  is/:is > is
 *  wx:for > v-for
 *  wx:if > v-if
 *  wx:elif > v-else-if
 *  wx:else > v-else
 *  
 *  v-text,v-html > v-text.v-html v-html会按照rich-text转换
 *
 *  v-bind,简单类型 支持简写,不支持对象和数组的绑定
 *
 *  :class,:style 支持字符串，不支持对象，数组
 *  
 *  不支持的指令:
 *
 *  v-model,v-pre,v-cloak,v-once
 *
 *  【事件】:
 *  支持的事件：
 * 'click':'tap',
 * 'touchstart': 'touchstart'
 * 'touchmove': 'touchmove'
 * 'touchcancel': 'touchcancel'
 * 'touchend': 'touchend'
 * 'submit': 'submit'
 * 'reset': 'reset'
 * 'input': 'input'
 * 'focus': 'focus'
 * 'blur': 'blur'
 * 'scroll': 'scroll'
 * 其他事件均不支持，v-on:click='' > bindtap=''
 * 事件修饰符支持stop 转 catch
 *
 * 【mustache】： filter会被转换成wxs函数形式
 *
 * <div>{{ remaining | filtername }}</div> :
 * <wxs module='filters' src='/commons/filters.wxs'></wxs>
 * <div>{{ filters.filtername(remaining) }}</div>
 */
const compiler = require('vue-template-compiler');

const template = {
	/*解析 vue 文件*/
  parseComponent: (file, options) => {
    return compiler.parseComponent(file, options)
  },
	/*解析 template 部分*/
  compile: (tpl, options) => {
    options = Object.assign({
      comments: true,
      preserveWhitespace: false,
      shouldDecodeNewlines: true
    }, options);
    return compiler.compile(tpl, options);
  }
};
