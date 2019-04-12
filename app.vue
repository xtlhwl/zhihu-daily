<template>
    <div class="daily">
    <div class="daily-menu">
        <div class="daily-menu-item"
            :class="{ on:type === 'recommend'}"
            @click="handleToRecommend"    
                >
            每日推荐
        </div>
        <div class="daily-menu-item"
            :class="{ on:type === 'daily'}"
            @click="showThemes = !showThemes">
            主题日报
        </div>
        <ul v-show="showThemes">
            <li v-for="(item,index) in themes" :key="index">
                <a :class="{ on:item === themeId && type === 'daily'}"
                @click="handleToTheme(item)">
                    第{{item}}天
                </a>
            </li>
        </ul>
    </div>
    <div class="daily-list" ref="list" @scroll="handleScroll">
        <template v-if="type === 'recommend'">
            <div v-for="(list,index) in recommendList" :key="index">
                <div class="daily-date">{{formatDay(list.date)}}</div>
                <item
                v-for="item in list.stories" :key="item.id"
                :data='item'
                @click.native="handleClick(item.id)"
                ></item>
            </div>
        </template>
        <template v-if="type === 'daily'">
            <div v-for="(list,index) in recommendList" :key="index">
                <div class="daily-date">{{list.date.substr(5,1)+"月"+" "+list.date.substr(6,2)+"日"}}</div>
                <item
                v-for="item in list.stories" :key="item.id"
                :data='item'
                @click.native="handleClick(item.id)"
                ></item>
            </div>
        </template>
    </div>
    <daily-article :id="articleId"></daily-article>
    </div>
    
</template>
<script>
    import $ from   './libs/util';
    export default{
        data(){
            return{
                themes:[],
                showThemes:false,
                type:'recommend',
                list:[],
                themeId:0,
                dailyTime:$.getTodayTime(),
                recommendList:[],
                isLoading:false,
                articleId:null,

            }
        },
        
        methods:{
            //主题日报
            //获取主题日报分类
            getThemes(){
                for(let i=1;i<10;i++){
                    console.log(i)
                    this.themes.push(i);
                    
                };
            },

            //每日推荐
            //点击每日推荐事件
            handleToRecommend(){
                this.type = 'recommend';
                this.recommendList = [];
                this.dailyTime = $.getTodayTime();
                this.showThemes = false;
                this.getRecommendList();
                
            },

            //获取每日推荐
            getRecommendList(){
                this.list = [];
                this.isLoading = true;  //加载时设置为true，加载完成后设置为false
                const prevDay = $.prevDay(this.dailyTime+86400000);
                const beforeDay = prevDay-1;
                //今天
                $.ajax.get('4/news/before/'+prevDay)
                .then(res =>{
                    this.recommendList.push(res)
                    this.isLoading = false;
                    console.log('这是recommendList',beforeDay,prevDay)
                });
                // 前一天
                // $.ajax.get('4/news/before/'+beforeDay)
                // .then(res =>{
                //     this.recommendList.push(res)
                //     this.isLoading = false;
                //     console.log('这是recommendList',beforeDay,prevDay)
                // })
                // console.log("这是长度"+this.recommendList.length)                
            },

 
            //点击分类事件
            handleToTheme(id){
                this.type = 'daily';  //颜色bar到了被点击的位置
                this.themeId = id; //设置当前点击子类的主题日报id  
                this.list = [];
                this.recommendList = [];
                var  prevDay = $.prevDay(this.dailyTime+86400000)-id
                $.ajax.get('4/news/before/'+prevDay)
                .then(res => {
                    this.list = res;
                    this.recommendList.push(res);
                    this.isLoading = false;
                    console.log(this.recommendList);
                })

            },
            //列表中日期转换为中文
            formatDay(date){
                var date = date.substr(5,1)+"月"+" "+date.substr(6,2)+"日";
                return date;
            },


            //滚动事件
            handleScroll(){
                const $list = this.$refs.list;
                if(this.type === 'daily' || this.isLoading) return;
                if(
                    $list.scrollTop + document.body.clientHeight >= $list.scrollHeight
                ){
                    this.dailyTime -= 86400000;
                    this.getRecommendList();
                }
            },

            //点击新闻列表 详细新闻
            handleClick(id){
                this.articleId = id;
                console.log(this.articleId);
            }
            
        },
        mounted(){
            this.getThemes()
            
            //自动加载
            this.getRecommendList();

            const $list = this.$refs.list;
            if(this.recommendList.length === 0){
                    this.dailyTime -= 86400000;
                    this.getRecommendList();
            };
            //滑动加载事件
            $list.addEventListener('scroll',() => {
                if(this.type === 'daily' || this.isLoading) return;
                
                if(
                    $list.scrollTop
                    +document.body.clientHeight 
                    >= $list.scrollHeight
                ){
                    this.dailyTime -= 86400000;
                    this.getRecommendList();
                }
            }); 
        },
        watch:{
            //点击分类bar变色事件
            showThemes:function(){
                if(this.showThemes === true){
                    this.type = 'daily'
                }
            }
        },
        
    }
</script>
