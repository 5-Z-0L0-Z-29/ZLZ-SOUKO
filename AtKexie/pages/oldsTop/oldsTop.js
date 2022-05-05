var app=getApp()
import * as echarts from '../../ec-canvas/echarts';
let chartBar=null;
Page({
   data: {
    tags:[
      {
        name:"学号"
      },
      {
       name:"姓名"
     },
     {
       name:"部门"
     },
     {
       name:"地点"
     },
     {
       name:"总时长"
     },
     {
      name:"排名"
    }
    ],
    objUser:[],
    objUserName:[],
    objTotalTime:[],
    echartBar:{
    }
  },
  getPixelRatio(){
   let pixelRatio=0
   wx.getSystemInfo({
     success: (result) => {
       pixelRatio=result.pixelRatio
     },
     fail()
     {
       pixelRatio=0
     }
   })
   return pixelRatio;
  },
  loadBar(dataA,dataB){
    let line = this.selectComponent('#mychart-dom-bar')
    let dpr=this.getPixelRatio();
    line.init((canvas,width,height)=>{
      chartBar=echarts.init(canvas,null,{
        width:width,
        height:height,
        devicePixelRatio:dpr
      });
      canvas.setChart(chartBar);
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
         
        },
    
        grid: {
          top:'15%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: dataA,
            axisLabel:{
                interval: 0,
                rotate: 25,
                margin:15
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '周签到时长',
            type: 'bar',
            barWidth: '60%',
            data:dataB ,
            itemStyle:{
               normal: {
                 color: function(params) {
                  var colorList= ['#ed7c2f','#28bf7e','#dfcb56','#b6c2ff','#e33e33'];
                  if(params.dataIndex>=5)
                  return colorList[0];
                  return colorList[params.dataIndex];
                }    
                
              }
            }
          }
        ]
      };
      chartBar.setOption(option);
      return chartBar;
    })
      
  },
get_data(){
  console.log('执行图表渲染')
  var _this = this;
  wx.request({
    url: app.globalData.baseLine.host+'/api/record/topFive?old-man=true',
    success:res=>{
      // console.log(res.data)
        if(res.data.code == 0){// 获取数据成功状态值
        // 将数据处理成图表需要的格式
        _this.setData({
          objUser:res.data.data
        })
        // console.log("obj",  _this.data.objUser)
         for(var i=0;i<res.data.data.length;i++)
        {
          _this.data.objUserName[i]=res.data.data[i].userName
          _this.data.objTotalTime[i]=parseFloat(res.data.data[i].totalTime)
        }
         
        // 执行初始化图表函数
          _this.loadBar(   _this.data.objUserName, _this.data.objTotalTime)
        }else{
          _this.loadBar(_this.data.echartData)// 这是我的初始化数据，获取失败就显示这个数据
        }
      }
  })

},
init_one(data) {           // 初始化第一个图表
  this.oneComponent.init((canvas, width, height,dpr) => {
      const chartBar = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // 设备像素比
      });
      setOption(chart, data)
      this.chart = chart;
      return chart;
  });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.oneComponent = this.selectComponent('#mychart-dom-bar'); 
    // <ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas> ec值为对象{lazyLoad: true}
    this.get_data()
    // wx.request({
    //   url: app.globalData.baseLine.host+'/api/record/topFive?old-man=true',
    //   success:res=>{
    //       console.log("resData",  res.data)
    //     }
    // })
  },
  getTab()
  {
  if(typeof this.getTabBar==='function'&&this.getTabBar()){
    this.getTabBar().setData({
      selected:2
    })
  }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
this.getTab()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})