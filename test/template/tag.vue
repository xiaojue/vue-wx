<!-- comment -->
<template>
  <div>
		<!-- 注释 -->
		<!--
		<p class="pcls" id='myp'>{{message}}</p>
		-->
		<p v-text="message"></p>
		<p v-bind:id="myid"></p>
		<aside v-bind:class="isActive"> aside </aside>
		<p :id="shortId"></p>
		<p v-on:click="clickFunc1"></p>
		<p @click="clickFunc2"></p>
		<!--
		<p v-html="message"></p>
		<p class="pcls" id='myp'>{{message}}</p>
    <footer v-if="ok1"> footer </footer>
    <footer v-else-if="ok2"> footer </footer>
    <footer v-else> footer </footer>
    <header v-show="ok"> header </header>
    <h1 :class="h1"> h1 </h1>
		<h2 :style="mystyle"> h2 </h2>
    <h3> h3 </h3>
    <h4> h4 </h4>
    <h5> h5 </h5>
    <h6> h6 </h6>
    <nav> nav </nav>
    <section> section </section>
    <div> div </div>
    <dl>
      <dt> dt </dt>
      <dd> dd </dd>
    </dl>
    <ol>
      <li>
        <ul>
					<li v-for="item in items"> ol,li,ul,li {{item.message}} </li>
					<li v-for="(item,index) in items"> ol,li,ul,li {{item.message}} {{index}} </li>
					<li v-for="value in object"> {{value}} </li>
					<li v-for="(value,key) in object"> {{key}} : {{value}} </li>
        </ul>
      </li>
    </ol>
    <p> p </p>
    <main> main </main>
    <i> i </i>
    <table>
      <thead>
        <td>
          <th>thead,td,th </th>
        </td>
      </thead>
      <tbody>
        <td>
          <tr>tbody,td,tr </tr>
        </td>
      </tbody>
    </table>
    <fieldset>
      <legend>fieldset,legend</legend>
    </fieldset>
    <a href="https://sina.cn"> a </a>
    <template> template </template>
    <scroll-view> scroll-view </scroll-view>
    <swiper> swiper</swiper>
    <movable-view> movable-view </movable-view>
    <cover-view> cover-view </cover-view>
    <icon> icon </icon>
    <span> span </span>
    <iframe-indoc src="about:blank;"></iframe-indoc>
    <progress> progress </progress>
    <button> button </button>
    <checkbox checked></checkbox>
    <checkbox-group></checkbox-group>
    <form action="someaction">
      <label>
		 <input value="input" type="text">	
		 <input value="input" type="number">	
		</label>
    </form>
    <picker> picker </picker>
    <picker-view></picker-view>
    <radio value="radio" checked></radio>
    <slider>slider</slider>
    <switch>switch</switch>
    <textarea> textarea </textarea>
    <navigator> navigator </navigator>
    <audio> audio </audio>
    <img src="test.jpg">
    <video> video </video>
    <camera></camera>
    <live-player> live-player </live-player>
    <live-pusher> live-pusher </live-pusher>
    <map> map </map>
    <canvas> canvas </canvas>
    <open-data></open-data>
    <iframe-src src="https://sina.cn"></iframe-src>
		-->
  </div>
</template>
