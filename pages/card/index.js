import WeCropper from '../we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync()

const ratio = device.pixelRatio

var width = 0;

if (device.windowWidth < 500) {
  width = device.windowWidth;
} else {
  width = 500;
}


const layouts = {
  'normal': {
    title: "经典",
    name: 'normal',
    width: width - 20 * 2,
    height: width - 20 * 2,
    padding: 20,
    psize: 16,
    msize: 14,
    border: 0,
  },
  'horizon': {
    title: "地平线",
    name: 'horizon',
    width: width,
    height: width - (width / 4),
    padding: 0,
    psize: 16,
    msize: 12,
    border: 0
  },
  'exhibit': {
    title: "展览",
    name: 'exhibit',
    width: width / 2,
    height: width - (width / 3),
    padding: 50,
    psize: 14,
    msize: 12,
    border: 1,
  }
}

// var loName = 'horizon';

var defaultLayout = layouts['normal'];


var styles = [
  {
    bgc: '#393e46',
    pc: '#ffffff',
    mc: '#cccccc',
    bc: '#cccccc',
    NavigationBarColor: '#ffffff'
  },
  {
    bgc: '#ffe411',
    pc: '#404040',
    mc: '#cccccc',
    bc: '#cccccc',
    NavigationBarColor: '#000000'
  },
  {
    bgc: '#f4f7f7',
    pc: '#303841',
    mc: '#cccccc',
    bc: '#a5dee5',
    NavigationBarColor: '#000000'
  },
  {
    bgc: '#FFF7F1',
    pc: '#404040',
    mc: '#cccccc',
    bc: '#000000',
    NavigationBarColor: '#000000'
  },
  {
    bgc: '#ff8c94',
    pc: '#ffffff',
    mc: '#f3f3f4',
    bc: '#f3f3f4',
    NavigationBarColor: '#ffffff'
  },
  {
    bgc: '#ffb6b9',
    pc: '#defcf9',
    mc: '#f3f3f4',
    bc: '#f3f3f4',
    NavigationBarColor: '#ffffff'
  },
  {
    bgc: '#cabfab',
    pc: '#41444b',
    mc: '#52575d',
    bc: '#dfd8c8',
    NavigationBarColor: '#ffffff'
  }
]


Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
      pixelRatio: device.pixelRatio,
      width: defaultLayout.width,
      height: defaultLayout.height,
      scale: 2.5,
      zoom: 8,
      boundStyle: {
        'mask': '#fff'
      }
    },

    globalStyles: styles,
    style: styles[2],

    text: {
      p: {
        'text': '主要显示文本',
        'active': true
      },
      m: {
        'text': '次要显示文本',
        'active': true
      }
    },

    active: 1,

    createStatus: 'ing',

    layout: defaultLayout,

    ratio: ratio,

    layoutStatus: [],

    copy: {
      width: 0,
      height: 0
    },

    canvas: {
      card: {
        dataset: {},
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0
      },

      image: {
        dataset: {},
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0
      },

      pText: {
        dataset: {},
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0
      },

      mText: {
        dataset: {},
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0
      }
    },
    windowWidth: device.windowWidth * ratio
  },
  touchStart(e) {
    if (this.wecropper.src) {
      this.wecropper.touchStart(e)
    } else {
      this.uploadTap()
    }
    
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  

  onChangeStyle (e) {
    var style = styles[e.target.dataset.index]

    this.setData({
      'style.bgc': style.bgc,
      'style.pc': style.pc,
      'style.mc': style.mc,
      'style.bc': style.bc,
      'style.NavigationBarColor': style.NavigationBarColor,
    })

    wx.setNavigationBarColor({
      frontColor: style.NavigationBarColor,
      backgroundColor: style.bgc
    })
  },

  onTabChange (e) {
    this.setData({
      active: e.detail
    })
    if (e.detail === 0) {
      wx.navigateBack({
        delta: 1
      })
    }
    if (e.detail === 3) {
      this.getCropperImage()
    }
  },

  bindMTextInput (e) {
    this.setData({
      'text.m.text': e.detail
    })
  },

  bindPTextInput (e) {
    this.setData({
      'text.p.text': e.detail
    })
  },

  onTogglePtext (e) {
    this.setData({
      'text.p.active': !this.data.text.p.active
    })
  },

  onToggleMtext(e) {
    this.setData({
      'text.m.active': !this.data.text.m.active
    })
  },

  getCropperImage() {
    var vm = this

    this.layoutStatus = []
    this.buildLayout()

    this.wecropper.getCropperImage((src) => {
      if (src) {
        const ctx = wx.createCanvasContext('copyCanvas')

        var canvas = vm.data.canvas;

        ctx.setFillStyle(canvas.card.dataset.bgc)
    
        ctx.fillRect(
          canvas.card.left * ratio,
          canvas.card.top * ratio,
          canvas.card.width * ratio,
          canvas.card.bottom * ratio
        )

        // Border 
        var borderSize = canvas.image.dataset.bsize
        var borderColor = canvas.image.dataset.bcolor
        ctx.setFillStyle(borderColor)

        ctx.fillRect(
          canvas.image.left * ratio - borderSize * ratio,
          canvas.image.top * ratio - borderSize * ratio,
          canvas.image.width * ratio + (borderSize * 2) * ratio,
          canvas.image.height * ratio + (borderSize * 2) * ratio
        )

        ctx.drawImage(src,
          canvas.image.left * ratio,
          canvas.image.top * ratio,
          canvas.image.width * ratio,
          canvas.image.height * ratio
        )

        // ctx.drawImage(res.tempFilePaths[0],
        //   0,0
        // )
        
        // ctx.draw()
        
        if (vm.data.text.p.active) {
          ctx.setFillStyle(canvas.pText.dataset.color)
          ctx.setFontSize(canvas.pText.dataset.fontsize * ratio)
          ctx.setTextBaseline('top')
          ctx.fillText(
            canvas.pText.dataset.text,
            canvas.pText.left * ratio,
            canvas.pText.top * ratio
          )
        }

        if (vm.data.text.m.active) {
          ctx.setFillStyle(canvas.mText.dataset.color)
          ctx.setFontSize(canvas.mText.dataset.fontsize * ratio)
          ctx.setTextBaseline('top')
          ctx.fillText(
            canvas.mText.dataset.text,
            canvas.mText.left * ratio,
            canvas.mText.top * ratio
          )
        }

        ctx.draw(false,  vm.exportImage)
      } else {
        console.log("fail")
      }
 
    })

    
    // this.wecropper.getCropperImage((src) => {
    //   if (src) {
    //   } else {
    //     console.log('获取图片地址失败，请稍后重试')
    //   }
    // })
  },

  exportImage () {
    var vm = this;
    wx.canvasToTempFilePath({
      destWidth: this.data.canvas.card.width * ratio,
      destHeight: this.data.canvas.card.height * ratio,
      canvasId: 'copyCanvas',
      fileType: 'png',
      quality: 1,
      success: (res) => {
        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
        // })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            vm.setData({
              createStatus: 'done'
            })
          },
          fail: (res) => {
            vm.setData({
              createStatus: 'fail'
            })
          }
        });

      },
      fail: function (res) {
        console.log(res);
      },
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]

        console.log(src)

        self.wecropper.pushOrign(src)
      }
    })
  },

  buildElement (id, key) {
    var vm = this;
    wx.createSelectorQuery().select(id).boundingClientRect(function (rect) {
      var data = {}
      data['canvas.' + key + '.dataset'] = rect.dataset
      data['canvas.' + key + '.dataset'] = rect.dataset
      data['canvas.' + key + '.left'] = rect.left
      data['canvas.' + key + '.right'] = rect.right
      data['canvas.' + key + '.top'] = rect.top
      data['canvas.' + key + '.bottom'] = rect.bottom
      data['canvas.' + key + '.width'] = rect.width
      data['canvas.' + key + '.height'] = rect.height
      vm.setData(data)
      vm.layoutStatus.push('card')
    }).exec()
  },

  buildLayout () {
    var vm = this;
    this.buildElement('#card', 'card')
    this.buildElement('#card-image', 'image')
    this.buildElement('#pText', 'pText')
    this.buildElement('#mText', 'mText')
  },
  onLoad(option) {
    const { cropperOpt } = this.data

    var vm = this

    if ('layout' in option) {
      var layoutName = option.layout;

      var layout = layouts[layoutName]

      this.setData({
        'layout.': layout,
        'cropperOpt.width': layout.width,
        'cropperOpt.height': layout.height,
      })
    }


    wx.setNavigationBarTitle({
      title: this.data.layout.title
    })

    wx.setNavigationBarColor({
      frontColor: this.data.style.NavigationBarColor,
      backgroundColor: this.data.style.bgc,
    })

    this.cropper = new WeCropper(cropperOpt)
      .on('ready', function (ctx) {
        // vm.uploadTap()

        console.log(option.src)

        if ('src' in option) {
          ctx.pushOrign(option.src)
        }
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
  }
})
