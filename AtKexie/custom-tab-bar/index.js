// custom-tab-bar/custom-ta.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    animation: '',
   selected:0,
   tabList:[
    {
      "pagePath":"pages/index/index",
      "text":"首页"
    },
    {
      "pagePath": "pages/newsTop/newsTop",
      "text": "新人"
    },
    {
      "pagePath":"pages/oldsTop/oldsTop",
      "text":"老人"
    },
    {
      "pagePath":"pages/about/about",
      "text":"关于"
    },
  ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
 
    switchTab(e){
      let key=Number(e.currentTarget.dataset.index);
      let tabList=this.data.tabList;
      let selected=this.data.selected;
      if(selected!==key)
      {
        this.setData({
          selected:key
        });
       
        wx.switchTab({
          url: `/${tabList[key].pagePath}`,
        })
      }
   }
  }
})
