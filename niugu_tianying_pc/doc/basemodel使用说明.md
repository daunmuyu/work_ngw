# BaseModel使用说明

## Model

`Model`的扩展并没有改变backbone的使用方式，而是扩展和增加了很多便捷操作请求的方法。默认是关闭localStorage缓存的，原则的设计是使用内存缓存，本地缓存需要支持LocalStorage特性（HTML5 API）



开启`localStorage`缓存的使用方式：

```
//JavaScript
var WowerModel = BaseModel.extend({
    url:'{{url_prefix}}/mock/index.json',//填写请求地址
    beforeEmit:function(options){
        // 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
        this.storageCache = true; //开启本地缓存
        this.expiration = 1; //设置缓存过期时间（1表示60*60*1000 一小时）
    }
});
```

> storageCache 设置为true
>
> expiration 设置过期时间（以小时为单位，如果设置为1表示设置为一个小时1000x60x60x1毫秒）

不开启localStorage缓存的使用方式：


```   
//JavaScript
var WowerModel = BaseModel.extend({
    url:'{{url_prefix}}/mock/mock.json'
});
```

**execute系列的方法都将返回一个promise对象（jQuery实现的Promise A）：**

```
//JavaScript
var model = new WowerModel();
var promise = model.execute();
promise.done(function(res){
	// to do with res
});
promise.fail(function(){

});
```

*Hook*

- beforeEmit：在初始化之后调用
- formatter：在请求成功之后，可以对数据进行格式化，需要返回一个新的数据

```
//JavaScript
var Model = BaseModel.extend({
    url:'{{url_prefix}}/examples/todomvc/mock/default.json?id={{id}}',//填写请求地址
    beforeEmit:function(options){
        // 如果需要开启对请求数据的本地缓存，可将下列两行注释去掉
        // this.storageCache = true; //开启本地缓存
        // this.expiration = 2; //设置缓存过期时间（1表示60*60*1000 一小时）
    },
    formatter:function(response){
          //formatter方法可以格式化数据
        return response;
    }
});
var shared = null;
Model.sharedInstanceModel = function () {
    if (!shared) {
        shared = new Model();
    }
    return shared;
};
module.exports = Model;
```


*实例属性*

- storageCache：设置为true，可开启本地缓存
- expiration：设置缓存过期时间（1表示60*60*1000 一小时）
- headers：设置请求头key/value普通对象

本地缓存`建议`在`beforeEmit`钩子方法中设置，比较好维护。或者，你也可以在外部进行设置（必须在调用execute系列方法之前）

```JavaScript
var model = new ListModel();
model.storageCache = true;
model.expiration = 1;
```

#### 实例方法

*execute to Restful*

```
//JavaScript
var model = new ListModel();
```

- execute：execute延伸方法的根方法

使用方式一：

第一个参数要求传入一个对象，可以自定义配置请求（包括URL，参数），如果是`GET`方法，要求你自己拼接参数

```
//JavaScript
var promise = model.execute({
    type:'POST',
    url:'http://127.0.0.1.com/aip',
    HTTPBody:{}
});
promise.done(function(){

});
promise.fail(function(){

});
```

使用方式二：

双回调，默认使用`GET`

```
//JavaScript
var promise = model.execute();
promise.done(function(){

});
promise.fail(function(){

});
```


- executeGET：发起一个GET请求，传入success，error的callback，两个参数
- executePOST：发起一个POST请求，传入提交（body JSON格式) ，success，error的callback，三个参数
- executePUT：发起一个PUT请求，传入提交（body JSON格式) ，success，error的 callback，三个参数
- executeDELETE：发起一个DELETE请求，无参数
- executeJSONP：发起一个JSONP跨域请求，传入提交的参数（JSON格式），success，error的callback

**其他方法**

- setChangeURL：辅助拼接URL，传入一个key/value普通对象
- setHeaders：辅助设置XHR头，传入一个key/value普通对象或者传入两个字符串key value（JSONP时不可用）
- setUpdateStore：将实体数据更新到本地缓存

### storage

本地缓存处理对象（localStorage和sessionStorage）

*propetry*

- enabled 判断浏览器是否支持本地缓存

*methods*

- has 根据Key判断是否存在
- transact 有存储是否成功的回调函数
- serialize 对象转字符串
- deserialize 字符串格式化对象
- set  本地缓存的set方法，用于更新或者插入
- get 获取本地缓存
- remove 根据key名删除一个本地缓存
- clear 清除所有的本地缓存
- getAll 获取所有的本地缓存

*object*

- expiration
	- set 存储可以设置过期时间的本地缓存
	- get 获取有过期时间的本地缓存
	- getAll 获取所有的
	- resetSave 重置所有的本地缓存
- session
	- set 存储一个会话
	- get 获取一个会话


### ManagedObject

初始化对象管理器

```
//JavaScript
var manager = new ManagedObject({
    entity:{
        "items": [{
            "id": 1,
            "name": "icepy"
        }, {
            "id": 0,
            "name": "wen"
        }, {
            "id": 2,
            "name": "xiang"
        }],
        "debug": "test version",
        "trace": {
            "warn": {
                "msg": "wenwen.xiang"
            }
        },
        "items2": [
            "icepy",
            "icepy",
            "wen"
        ]
    }
});
```

- $get：从实体中获取数据，无参将返回所有数据，参数使用.结构化表达式（'items.0.id'）

```
//JavaScript
console.log('$get items',manager.$get('items'))
console.log('$get debug',manager.$get('debug'))
console.log('$get trace.warn',manager.$get('trace.warn'))
console.log('$get 全部的数据',manager.$get())
```

- $set：向实体内部更新数据，以key/value的方式，第一个参数使用结构化表达式，第二个参数可以是任意类型的数据

```
//JavaScript
manager.$set('trace.warn',{'msg':'msg'})
```

- $filter：向实体内部的某项数据进行筛选，第一个参数是要筛选数据的.结构化表达式，第二个参数是筛选根据

```
//JavaScript
var id1 = manager.$filter('items',{"id":1})
console.log('$filter id=1',id1)
var id2 = manager.$filter('items',function(v,i){
    if(v.id == 2){
        return true
    }
})
console.log('$filter id=2',id2)
var icepy = manager.$filter('items2','icepy')
console.log('$filter icepy',icepy)
```

- $sort：对实体内部的某项数据进行排序，第二个参数是要排序数据的.结构化表达式，第二个参数是排序的根据

```
//JavaScript
var sort1 = this.$sort('items','id.<')
console.log('降序',sort1)
var sort2 = this.$sort('items','id.>')
console.log('升序',sort2)
var sort3 = this.$sort('items',function(){
    return true
});
```