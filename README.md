# 电商管理系统

## 系统配置
```
const express =require('express')
//开启Gzip压缩
//const compression = require('compression')
const app = express()
//app.use(compression())
app.use(express.static('./dist'))
app.listen(80,()=>{
	console.log('server running at http://127.0.0.1:80')
})
```

# 系统界面

## 登录
![登录](https://www.yundaohang.net/tuoguan/vue-shop1.png "登录界面")

## 后台首页
![后台首页](https://www.yundaohang.net/tuoguan/vue-shop2.png "后台首页")

## 列表页
![列表页](https://www.yundaohang.net/tuoguan/vue-shop3.png "列表页")

## 添加商品页
![添加商品页](https://www.yundaohang.net/tuoguan/vue-shop4.png "列表页")

## 数据报表页
![数据报表页](https://www.yundaohang.net/tuoguan/vue-shop5.png "列表页")
**本系统为学习项目，由于后端没有写开发接口，所以前端有些功能只有UI界面，感兴趣的伙伴可以拿去二开哦！（本系统前端是基于Element框架进行开发）**
# 个人公众号
更多开源组件、项目请走传送门
![微信公众号](https://www.yundaohang.net/tuoguan/wx.png "个人公众号")
