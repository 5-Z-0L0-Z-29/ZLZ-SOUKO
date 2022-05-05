// pages/index/index.js
const baseLine = require("../../utils/util.js")
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
      option: [
        { text: '5',value:5},
        { text: '10',value:10},
        { text: '15',value:15},
        { text: 'All',value:20},
      ], 
     value:0,
     select:0,
     previousSno:"",
     inputSno:"",
     In:"",
     user:[],
     pagesize:10,//每页展示的条数
     curpage: 0,//当前页数
	   count:10,//总页数
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
        name:"操作"
      }
     ],
     curList:[],  //当前页的人数数组
     Onlines:[],  //总数组
     shows:[],//当前展示的人数数组
  },
  getSno(e)
  {  
        this.setData({
          inputSno:e.detail.value
        })
       
  },
  // 展示选择人数的选择菜单
  showList()
  {
    if(!this.data.select)
    {
      this.setData({select:1})
    }
    else
    this.setData({select:0})
  },
  // 选择展示的人数
  mySelect(e)
  {
    
    // console.log(e)
    this.setData({
      In:"",
      value:this.data.option[e.currentTarget.dataset.id].value,      
      select:0,
      curpage:0,
      pagesize:this.data.option[e.currentTarget.dataset.id].value, 
      count:this.data.option[e.currentTarget.dataset.id].value, 
    })
      if(this.data.value==20)
      {
        this.setData({
          curList:this.data.Onlines,
          count:this.data.Onlines.length
        })
      }  
        else
        this.setData({
          curList:this.data.Onlines.slice(0,this.data.pagesize)
        })

          //  console.log("新的展示人数",this.data.curList)
      
    
  },
  // 搜索
  search(e)
  {
     console.log("culist",this.data.curList)
     if(e.detail.value)
     {
          this.setData({
            curList:this.data.Onlines.filter(v=>v.userName.includes(e.detail.value))
          })
     }
     else
     {
       this.setData({
         curList:this.data.Onlines.slice(this.data.curpage,this.data.count) 
       })
     }
  },
  // 举报
  handleReport(e)
  {
    let that=this
    let id=e.currentTarget.dataset.id
     console.log(this.data.curList[id].userId,that.data.user.userId)
     wx.showModal({
      title: '举报',
      content: '是否要举报该用户',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: baseLine.host+'/api/user/complaint',
            method:"POST",
            data:{
              targetUserId: that.data.curList[id].userId,
              operatorUserId:that.data.user.userId
          },
          success (res) {
            if(res.data.code===0)
            {
              console.log(res)
              wx.showModal({
                 content:"举报成功",
                 showCancel:false,
              })
              wx.setStorage({
                key:"userId",
                data:{
                  userId:that.data.curList[id].userId,
                  userName:that.data.curList[id].userName,
                  week:that.data.user.week,
                  isSignIn:"false"
                }
              })
            }
            
            
          }
        })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 下一页
forward()
{
  // console.log("forward")
  if(this.data.count<this.data.Onlines.length){
    if(this.data.count+this.data.pagesize>this.data.Onlines.length)
    {
      this.setData({
        count:this.data.Onlines.length
       })
    }
    else
    {
      this.setData({
        count:this.data.count+this.data.pagesize
       })
    }
    this.setData({
      curpage:this.data.curpage+this.data.pagesize,
    })
    this.setData({
      curList:this.data.Onlines.slice(this.data.curpage,this.data.count)
    })
  }
 
},
// 上一页
back()
{
  // console.log("backward")
  if(this.data.curpage>=this.data.pagesize)
 {
  this.setData({
    curpage:this.data.curpage-this.data.pagesize,
  })
   this.setData({
    count:this.data.count-this.data.curList.length
   })
  this.setData({
    curList:this.data.Onlines.slice(this.data.curpage,this.data.count)
  })
 } 
},
  // 登出
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
         success()
         {
          wx.redirectTo({
            url: '/pages/sign/sign',
          })
         }
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
  getTab()
  {
  if(typeof this.getTabBar==='function'&&this.getTabBar()){
    this.getTabBar().setData({
      selected:0
    })
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
 
      let tmp=wx.getStorageSync('userId')
      this.setData({
        user:tmp,
        previousSno:tmp.userId
      })
      
      let userId=tmp.userId
    if(userId)
    {
          wx.request({
            url: app.globalData.baseLine.host+'/api/record/online',
            success:res=>{
              that.setData({
                  Onlines:res.data.data
              })
              console.log(that.data.Onlines.length)
              that.setData({
                curList:that.data.Onlines.slice(that.data.curpage,that.data.pagesize) ,
               
              })
               
            }
          })
    }
  },
// computed:{
//    showarr(){
//      if(!this.data.In)
//      return this.data.curList;
//      return this.data.curList.filter(v=>v.userName.includes(this.data.In))
//    }
// },
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