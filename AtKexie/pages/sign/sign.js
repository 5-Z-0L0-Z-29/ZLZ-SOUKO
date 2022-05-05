// index.js
const baseLine = require("../../utils/util.js")
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputSno:"",
    userId:"",
    previousSno:""
  },
   getSno(e)
   {
         this.setData({
           inputSno:e.detail.value
         })
       
       
   },
   showTime()
   {
      var nowdate=new Date();
      var year=nowdate.getFullYear(),
      month=nowdate.getMonth()+1,
      date = nowdate.getDate(),
      h=nowdate.getHours(),
      m=nowdate.getMinutes(),
      s=nowdate.getSeconds(),
      h = this.checkTime(h),
      m = this.checkTime(m),
      s = this.checkTime(s);
      return year+"-"+month+"-"+date+" "+h+":"+m+":"+s;
   },
   checkTime(e)
   {
    if (e < 10) {
      e = "0" + e;
  }
  return e;
   },
   signIn()
   {
     var that=this
          wx.request({
            url: baseLine.host+'/api/user/signIn',
            method:"POST",
            data:{
              userId:(that.data.inputSno||this.data.previousSno)
          },
        
          success (res) {
            console.log(res)
            if(res.data.code==0)
            {
              wx.setStorage({
                key:"userId",
                data:{
                  userId:res.data.data.userId,
                  userName:res.data.data.userName,
                  week:res.data.data.week,
                  isSignIn:"true"
                }
              })
              // app.globalData.userId=res.data.data.userId
              // that.setData({
              //   userId:res.data.data.userId
              // })
              console.log(that.data)
              wx.showModal({
                title: '签到成功',
                content:
                  "学号:"+res.data.data.userId+"\r\n"+
                  "姓名:"+res.data.data.userName+"\r\n"+
                  "签到开始时间:"+that.showTime()+"\r\n"+
                  "本周签到总时长:"+res.data.data.totalTime,
                showCancel:false,
              })
             wx.switchTab({
               url: '../index/index',
             })
            }
            else
            {
              wx.showModal({
                title: '签到失败',
                content: res.data.msg,
                showCancel:false,
               
              })
            }
          
          }
        })
   },
   signOut()
   {
     var that=this
    wx.request({
      url: baseLine.host+'/api/user/signOut',
      method:"POST",
      data:{
        userId:(that.data.inputSno||this.data.previousSno)
    },
  
    success (res) {
      console.log(res)
      if(res.data.code==0)
      {
        wx.setStorage({
          key:"userId",
          data:{
            userId:res.data.data.userId,
            userName:res.data.data.userName,
            week:res.data.data.week,
            isSignIn:"false"
          }
        })
        wx.showModal({
          title: '签退成功',
          content:
          "学号:"+res.data.data.userId+"\r\n"+
          "姓名:"+res.data.data.userName+"\r\n"+
          "本次签到时长:"+res.data.data.accumulatedTime+"\r\n"+
          "本周签到总时长:"+res.data.data.totalTime,
          showCancel:false,
         
        })
      }
      else
      {
        wx.showModal({
          title: '签退失败',
          content: res.data.msg,
          showCancel:false,
         
        })
      }
     
    }
  })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var tmp=wx.getStorageSync('userId')
       this.setData({
        previousSno:tmp.userId
       })
      
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})