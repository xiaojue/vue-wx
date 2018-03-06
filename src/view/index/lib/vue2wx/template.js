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
 * image:img
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
import format from '../common/format';

const compiler = require('vue-template-compiler');
const fs = require('fs');

function isNotClosedTag(tagName) {
  return 'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr'.split(',').indexOf(tagName) >= 0;
}

const tagConvertMap = [
  ['view',
    'aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,' +
    'div,dd,dl,dt,ol,ul,li,p,main,' +
    'i,' +
    'table,thead,tbody,td,th,tr,' +
    'fieldset,legend,' +
    'a'.split(',')
  ]
];

function convertTag(tagName) {
  for (let i = 0; i < tagConvertMap.length; i++) {
    let rule = tagConvertMap[i];
    if (rule[1].indexOf(tagName) >= 0) {
      return rule[0];
    }
  }
  return null;
}

const template = {
  /*解析 vue 文件*/
  sfc: (file, options) => {
    return compiler.parseComponent(file, options)
  },
  /*解析 template 部分*/
  compile: (tpl, options) => {
    options = Object.assign({
      comments: true,
      preserveWhitespace: false,
      shouldDecodeNewlines: true
    }, options || {});
    return compiler.compile(tpl, options);
  },
  compileAST: (ast) => {
    let tpl = '';
    let stack = [];
    process(ast, true);
    /**
     * help 便利ast
     */
    function process(item, isRoot) {
      let children = item.children;
      createTag(item, isRoot);
      if (children && children.length) {
        processChild(children);
      }
      if (item.type === 1) {
        closeTag(item);
      }
    }

    function processChild(children) {
      children.map((item) => {
        process(item);
      });
    }

    function createTag(item, isRoot) {
      switch (item.type) {
        case 1:
          {
            var newTag = convertTag(item.tag);
            if (newTag) item.tag = newTag;
            tpl += `<${item.tag}`;
            //TODO 处理attr
            if (isNotClosedTag(item.tag)) {
              tpl += ` />`;
            } else {
              tpl += `>`;
              stack.push({
                tag: item.tag
              });
            }
            break;
          }
        case 2:
          //表达式 {{expr}}
          tpl += item.text;
          break;
        case 3:
          //文本和注释
          tpl += item.text;
          break;
      }
    }

    function closeTag(item) {
      let tagName = item.tag;
      var pos;
      if (tagName) {
        //从栈内找到闭合标签
        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].tag === tagName) {
            tpl += `</${tagName}>`;
            break;
          }
        }
      } else {
        pos = 0;
      }
      if (pos >= 0) {
        //说明有标签没有闭合,丢弃	
        stack.length = pos;
      }
    }
    return format(tpl);
  },
  convert: (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    let tpl = template.sfc(content).template.content;
    let compiled = template.compile(tpl);
    if (compiled.errors.length) {
      throw new Error(compiled.errors[0]);
    }
    let ast = compiled.ast;
    return template.compileAST(ast);
  }
};


export default {
  convert: template.convert
}
