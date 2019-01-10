// pages/index/index.js

// const device = wx.getSystemInfoSync()


Page({
  uploadTap(e) {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]

        wx.navigateTo({
          url: '/pages/card/index?layout=' + e.target.dataset.layout + '&src=' + src
         })
      }
    })
  }
})