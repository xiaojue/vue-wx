import vue2wx from './lib/vue2wx';
import wx2vue from './lib/wx2vue';

process.on('uncaughtException', (err) => {
	console.log(err.message);
});

export default {
  vue2wx,
  wx2vue
}
