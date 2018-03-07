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
 *  :class,:style 不支持，小程序不支持绑定class，style，需要用表达式代替
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
 * 【mustache】：不支持 filter
 *
 */
import format from '../common/format';

const compiler = require('vue-template-compiler');
const fs = require('fs');

const eventConvertMap = {
  'click': 'tap',
  'touchstart': 'touchstart',
  'touchmove': 'touchmove',
  'touchcancel': 'touchcancel',
  'touchend': 'touchend',
  'submit': 'submit',
  'reset': 'reset',
  'input': 'input',
  'focus': 'focus',
  'blur': 'blur',
  'scroll': 'scroll',
  'error': 'error',
  'play': 'play',
  'pause': 'pause',
  'ended': 'ended',
  'timeupdate': 'timeupdate',
  'animationstart': 'animationstart',
  'animationend': 'animationend'
}

const tagConvertMap = {
  'view': 'aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,' +
    'div,dd,dl,dt,ol,ul,li,p,main,' +
    'i,' +
    'table,thead,tbody,td,th,tr,' +
    'fieldset,legend,' +
    'a',
  'block': 'template',
  'scroll-view': 'scroll-view',
  'swiper': 'swiper',
  'movable-view': 'movable-view',
  'cover-view': 'cover-view',
  'icon': 'icon',
  'text': 'span',
  'rich-text': 'iframe-indoc',
  'progress': 'progress',
  'button': 'button',
  'checkbox': 'checkbox',
  'checkbox-group': 'checkbox-group',
  'form': 'form',
  'input': 'input',
  'label': 'label',
  'picker': 'picker',
  'picker-view': 'picker-view',
  'radio': 'radio',
  'slider': 'slider',
  'switch': 'switch',
  'textarea': 'textarea',
  'navigator': 'navigator',
  'audio': 'audio',
  'image': 'img',
  'video': 'video',
  'camera': 'camera',
  'live-player': 'live-player',
  'live-pusher': 'live-pusher',
  'map': 'map',
  'canvas': 'canvas',
  'open-data': 'open-data',
  'web-view': 'iframe-src'
};

const attrsConvertMap = {
  'v-bind': function(key, val, obj) {
    //处理bind所有情况
    if (obj.modifier && obj.modifier) {
      throw new Error(`v-bind ${obj.modifier} modifier is not support`);
    }
    return {
      tpl: ` ${obj.bindKey}="{{${val}}}" `
    }
  },
  'v-on': function(key, val, obj) {
    //处理event,只支持阻止冒泡和捕获修饰符
    if (obj.modifier && (obj.modifier != 'stop' || obj.modifier != 'capture')) {
      throw new Error(`v-on ${obj.modifier} modifier is not support`);
    }
    let ckey = 'bind';
    if (obj.modifier === 'stop') ckey = 'catch';
    if (obj.modifier === 'capture') ckey = 'capture-bind';
    let cbindKey = eventConvertMap[obj.bindKey];
    if (!cbindKey) {
      throw new Error(`v-on ${obj.bindKey} event is not support`);
    }
    return {
      tpl: ` ${ckey}:${cbindKey}="${val}" `
    };
  },
  'v-text': function(key, val) {
    return {
      insertContent: `{{${val}}}`
    }
  },
  'v-html': function(key, val) {
    throw new Error(`${key}='${val}' is not support,please use rich-text commponent`);
  },
  /*
  'is':'is',
  'v-show':,
  'v-if':,
  'v-else':,
  'v-else-if':,
  'v-for':,
  'v-model':'',
  'v-pre':'',
  'v-cloak':'',
  'v-once':'',
  'v-animate':,
  'v-opentype':,
  'ref':,
  'key':'',
  'acm':''
  'scope':'',
  'slot':,
  'slot-scope':,
  */
};

function isCompTag(tagName) {
  return !isHtmlTag(tagName) && !isWXTag(tagName);
}

function isWhiteTag(tagName) {
  var whiteTags = [];
  for (var i in tagConvertMap) {
    var val = tagConvertMap[i];
    whiteTags = whiteTags.concat(val.split(','));
  }
  return whiteTags.indexOf(tagName) >= 0;
}

function isNotClosedTag(tagName) {
  return 'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr'.split(',').indexOf(tagName) >= 0;
}

function isHtmlTag(tagName) {
  return 'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template' +
    //svg tag
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view'.split(',').indexOf(tagName) >= 0;
}

function isWXTag(tagName) {
  return Object.keys(tagConvertMap).indexOf(tagName) >= 0;
}

function convertTag(tagName) {
  for (let ctag in tagConvertMap) {
    let rule = tagConvertMap[ctag];
    if (rule.split(',').indexOf(tagName) >= 0) {
      return ctag;
    }
  }
  return null;
}

//v-bind/on:key.modifier
//:key.modifier
//@key.modifier
function getRealAttr(key) {
  let ret = {};
  var dot = key.indexOf('.');
  dot = dot > -1 ? dot : key.length;
  if (key.match(/^[:|@]/)) {
    ret.type = key.charAt(0) === '@' ? 'v-on' : 'v-bind';
    ret.bindKey = key.slice(1, dot);
    ret.modifier = key.slice(dot + 1, key.length);
    return ret;
  }
  if (key.match(/^v-(bind|on)/)) {
    ret.type = key.charAt(2) === 'o' ? 'v-on' : 'v-bind';
    var keyIndex = ret.type === 'v-on' ? 5 : 7;
    ret.bindKey = key.slice(keyIndex, dot);
    ret.modifier = key.slice(dot + 1, key.length);
    return ret;
  }
  return {
    type: key
  };
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
            if (isWhiteTag(item.tag)) { //非自定义标签，可以标准转换的tag list
              item.tag = convertTag(item.tag);
            } else {
              throw new Error(`${item.tag} can\'t convert,wx is not support!`);
            }
            var insertContent = '';
            tpl += `<${item.tag}`;
            //处理attr
            for (var key in item.attrsMap) {
              var attrObjs = getRealAttr(key);
              var cAttr = attrsConvertMap[attrObjs.type];
              if (cAttr) {
                var resObj = cAttr(key, item.attrsMap[key], attrObjs);
                insertContent = resObj.insertContent || '';
                tpl += resObj.tpl || '';
              } else {
                tpl += ` ${key}="${item.attrsMap[key]}" `;
              }
            }
            if (isNotClosedTag(item.tag)) {
              tpl += ` />`;
            } else {
              tpl += `>`;
              //处理v-text,v-html,把插入标签的内容注入
              tpl += insertContent;
              stack.push({
                tag: item.tag
              });
            }
            break;
          }
        case 2:
          //表达式 {{expr}}
          //不支持 filter格式
          if (item.text.match(/\s\|\s/g)) {
            throw new Error(`${item.text}，wx is not support filter`);
          } else {
            tpl += item.text;
          }
          break;
        case 3:
          //文本和注释
          if (item.isComment) {
            tpl += `<!-- ${item.text} -->`;
          } else {
            tpl += item.text;
          }
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
