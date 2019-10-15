# 处理前端跨域方式
  - [为什么要设置跨域](#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E8%AE%BE%E7%BD%AE%E8%B7%A8%E5%9F%9F)
  - [同源的定义](#%E5%90%8C%E6%BA%90%E7%9A%84%E5%AE%9A%E4%B9%89)
  - [解决方案](#%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88)
    - [CORS<跨域资源共享>](#cors%E8%B7%A8%E5%9F%9F%E8%B5%84%E6%BA%90%E5%85%B1%E4%BA%AB)
      - [简单请求](#%E7%AE%80%E5%8D%95%E8%AF%B7%E6%B1%82)
      - [非简单请求](#%E9%9D%9E%E7%AE%80%E5%8D%95%E8%AF%B7%E6%B1%82)
      - [withCredentials cookie信息的传递](#withcredentials-cookie%E4%BF%A1%E6%81%AF%E7%9A%84%E4%BC%A0%E9%80%92)
    - [jsonP跨域](#jsonp%E8%B7%A8%E5%9F%9F)
    - [proxy代理跨域](#proxy%E4%BB%A3%E7%90%86%E8%B7%A8%E5%9F%9F)
    - [WebSocket](#websocket)
  - [changelog](#changelog)
  - [总结](#%E6%80%BB%E7%BB%93)
  - [参考](#%E5%8F%82%E8%80%83)



## 为什么要设置跨域
因为[**浏览器的同源策略**](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)导致了跨域。

同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。

## 同源的定义
| URL        | 结果   |  原因  |
| --------   | -----:  | :----:  |
| http://store.company.com/dir2/other.html          | 成功 |  只有路径不同                   |
| http://store.company.com/dir/inner/another.html   | 成功 |  只有路径不同                   |
| https://store.company.com/secure.html             | 失败 |  不同协议 ( https和http )       |
| http://store.company.com:81/dir/etc.html          | 失败 |  不同端口 ( http:// 80是默认的)  |
| http://news.company.com/dir/other.html            | 失败 |  不同域名 ( news和store )       |

## 解决方案

### CORS<跨域资源共享>
CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。

这里有详细的介绍[**跨域资源共享 CORS 详解**](http://www.ruanyifeng.com/blog/2016/04/cors.html)

简单点说：

浏览器将CORS请求分成两类：**简单请求**（simple request）和 **非简单请求**（not-so-simple request）。

#### 简单请求
只要同时满足以下两大条件
    
1. 请求方法是以下三种方法之一：
    * HEAD
    * GET
    * POST
2. HTTP的头信息不超出以下几种字段：
    * Accept
    * Accept-Language
    * Content-Language
    * Last-Event-ID
    * Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain
凡是不同时满足上面两个条件，就属于非简单请求。

浏览器对这两种请求的处理，是不一样的。

解决方法
```javascript
/**允许所有的地址访问， 取消跨域拦截 */
res.header("Access-Control-Allow-Origin", "*");
```
#### 非简单请求
非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json，或者增加了一个头信息字段token

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。

解决方法
```javascript
/**允许所有的地址访问， 取消跨域拦截 */
res.header("Access-Control-Allow-Origin", "*");
// #region 复杂请求必须设置 Access-Control-Allow-Methods 和 Access-Control-Allow-Headers
// 其中Access-Control-Allow-Headers中除了基础的Origin, X-Requested-With, Content-Type, Accept
//如果用户有自己新增的头信息则必须加入Access-Control-Allow-Headers
res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, ' + "token");
// #endregion
```
#### [withCredentials cookie信息的传递](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials)
CORS请求默认不发送Cookie和HTTP认证信息。如果要把Cookie发到服务器，一方面要服务器同意，指定Access-Control-Allow-Credentials字段。

解决方案：

前端
```html
xhr.withCredentials = true; // 设置允许传递cookies
```
服务器端
```javascript
res.header('Access-Control-Allow-Credentials','true');
```
### jsonP跨域
**实现原理**：利用 script 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP 请求一定需要对方的服务器做支持才可以。
**JSONP优缺点**:JSONP 优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。缺点是仅支持 get 方法具有局限性,不安全可能会遭受 XSS 攻击。
**JSONP的实现流程**: 
1. 定义一个全局方法window.<前台方法> = ()=>{} 例如：window.cb = ()=>{}
2. 生成一个script标签src为<请求地址>?<后台方法>=<前台方法>[例如：http://localhost:9977/a?callback=cb]
3. 服务端接受请求 将数据填充至指定格式为"<前台方法>('<数据>')"  前端接收的相应数据格式应该大致 `cb("欢迎来到9977端口，我已经放行所有的地址请求")`
4. 前端通过window.<前台方法>获取数据

换个方法说就好像 后端通过调用前端的方法将数据传递进去。

### proxy代理跨域
实现原理：**同源策略**是浏览器需要遵循的标准，而如果是**服务器向服务器请求就无需遵循同源策略**。

代理服务器，需要做以下几个步骤：
1. 接受**客户端**请求。
2. 将请求**转发**给目标服务器。
3. 获取目标服务其**响应**的数据
4. 将**响应**转发给客户端

要点

通过代理跨域的要点是**代理服务器**必须能**遵循同源策略**接受客户端的请求。

### WebSocket
实现原理：

WebSocket协议本身不要求同源策略（Same-origin Policy）,也就是某个地址为http://a.com的网页可以通过WebSocket连接到ws://b.com。

但是，浏览器会发送Origin的HTTP头给服务器，服务器可以根据Origin拒绝这个WebSocket请求。所以，是否要求同源要看服务器端如何检查


    Websocket 是 HTML5 的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。
    WebSocket 和 HTTP 都是应用层协议，都基于 TCP 协议。
    WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。
    WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。

## changelog
**@TODO**

## 总结

## 参考
[不要再问我跨域的问题了](https://segmentfault.com/a/1190000015597029#articleHeader4)
[九种跨域方式实现原理](https://www.cnblogs.com/kinwing/p/11130286.html)