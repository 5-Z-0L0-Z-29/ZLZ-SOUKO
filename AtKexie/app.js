// app.js
const baseLine = require("/utils/util.js")
App({
  globalData:{
   baseLine:baseLine,
   userId:""
  },
    onLaunch(){
      
      var tmp=wx.getStorageSync('userId')
      console.log(tmp)
      if(tmp.isSignIn=="false")
      {
        console.log("false")
        setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/sign/sign',
        })
      },500)
    }
      if(tmp.isSignIn=="true")
      {
        console.log("true")
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/index/index',
          })
        },500)
       
      }
     
      // 获取系统信息 自定义导航栏
      wx.getSystemInfo({
        success: e => {
          this.globalData.navHeight = e.windowHeight; 
          this.globalData.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          this.globalData.Custom = custom;  
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      })
    },
    onShow()
    {
     
      var tmp=wx.getStorageSync('userId')
      // if(tmp.isSignIn=="true")
      // {
      //  wx.navigateTo({
      //    url: '/pages/index/index',
      //  })
      //  console.log("onshow启动")
      // }
    }
    
    
})
