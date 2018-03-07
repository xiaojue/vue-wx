import assert from 'assert';
import vuewx from '../src/view/index';
import fs from 'fs';
import path from 'path';

describe('vue2wx-template', function() {
  describe('#标签', function() {
		var filepath = path.join(__dirname,'./template/tag.vue');
		var wxtpl = vuewx.vue2wx.template.convert(filepath);
		console.log(wxtpl);
  });
  describe('#指令', function() {
  });
  describe('#class,style', function() {
  });
  describe('#事件', function() {
  });
  describe('#mustache', function() {
  });
});
