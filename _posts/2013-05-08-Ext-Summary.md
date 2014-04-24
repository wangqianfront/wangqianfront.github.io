---
layout: post
category : Front-End
title:  Ext Summary
header: 前端
tagline:
tags : [Ext,前端,learning]
---
{% include JB/setup %}


1. EXT JS 4的数据模型分为三类 
   * 实体模型 model 
   * 数据代理  proxy,用来处理数据的读取和保存，通过AJAX代理获得服务端的数据 
   * 数据读写器：Reader,Writer,用来读原始的数据到MODEL中。 
   * 数据集：store,保存MODEL对象的客户端缓存，提供了对数据的过滤，排序，查找功能。 

2. EXT.DATA.MODEL,前身为EXT 3中的ext.data.record类，进行了增强； 
模型分为  
	* fields:字段定义
	* proxy:数据代理
	* associations:模型管理  
	* Validations:数据校验。 


3. 基本数据模型


	    Ext.onReady(function(){ 
		//注册用户数据模型User 
		Ext.regModel('User', { 
	    fields: [//定义模型字段 
	        {name: 'name',  type: 'string'}, 
	        {name: 'age',   type: 'int'}, 
	        {name: 'phone', type: 'string'} 
		    ] 
		}); 
		//创建User模型的实体对象 
		var user = Ext.ModelMgr.create({ 
		    name : 'tom', 
		    age  : 24, 
		    phone: '555-555-5555' 
		}, 'User'); 
		//获取员工姓名 
		alert(user.get('name')); 
		}); 


4. ext.validations 


    	Ext.onReady(function(){ 
		//定义默认的验证提示信息 
		Ext.data.validations.presenceMessage = '必须是有效值。'; 
		Ext.data.validations.lengthMessage = '长度错误。'; 
		Ext.data.validations.formatMessage = '格式错误。'; 
		Ext.data.validations.inclusionMessage = '没有包括在可接受的数据中。'; 
		Ext.data.validations.exclusionMessage = '不是可接受的值。'; 
		
		//自定义数值范围验证 
		Ext.apply(Ext.data.validations,{ 
		number : function(config, value){ 
		if (value === undefined) { 
		            return false; 
		        } 
		            var min    = config.min, 
		                max    = config.max; 
		        
		        if ((min && value < min) || (max && value > max)) { 
		            return false; 
		        } else { 
		            return true; 
		        } 
		}, 
		numberMessage : '数值范围错误。' 
		}); 
		
		//注册用户数据模型User 
		Ext.regModel('User', { 
		    fields: [//定义模型字段 
		             {name: 'name',     type: 'string'}, 
		             {name: 'age',      type: 'int'}, 
		             {name: 'phone',    type: 'string'}, 
		             {name: 'gender',   type: 'string'}, 
		             {name: 'username', type: 'string'}, 
		             {name: 'alive',    type: 'boolean', defaultValue: true} 
		    ], 
		    validations: [ 
		        {type: 'presence',  field: 'age'}, 
		        {type: 'number',  field: 'age', min : 30}, 
		        {type: 'length',    field: 'name', min: 2}, 
		        {type: 'inclusion', field: 'gender',   list: ['男', '女']}, 
		        {type: 'exclusion', field: 'username', list: ['admin@xx.xx', 'user@xx.xx']}, 
		        {type: 'format',    field: 'username', 
		        //校验用户名是否为电子邮件格式 
		        matcher: /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/ 
		        } 
		    ] 
		}); 
		//创建User模型的实体对象 
		var user = Ext.ModelMgr.create({ 
		    name : 'tom', 
		    age  : 24, 
		    gender : 'man', 
		    username: 'abc' 
		}, 'User'); 
		//执行数据验证 
		var errors = user.validate(); 
		//获取验证信息 
		var message = []; 
		errors.each(function(v){ 
		message.push(v.field+' : '+v.message) 
		}); 
		alert(message.join('\n')); 
		}); 


5. 数据代理：在4。0前，数据代理是store一部分，读写数据必须通过store,新版本中数据代理可以在数据模型中配置。 

6. EXT 4中，支持一对多和多对一两种关系。 

  * 一对多例子：
  
			Ext.onReady(function(){ 
			//注册用户数据模型User 
			Ext.regModel('User', { 
			    fields: [//定义模型字段 
			             {name: 'name', type: 'string'},//用户名称 
			             {name: 'id', type: 'int'}//用户id 
			    ], 
			    //User与Product是一对多关系 
			    hasMany: {model: 'Product', name:'getProducts',autoLoad : false}, 
			//其中autoload为FALSE，表示延迟加载 
			    proxy: { 
			    type : 'ajax', 
			        url : 'userServer.jsp' 
			    } 
			}); 
			//注册产品数据模型Product 
			Ext.regModel('Product', { 
			    fields: [//定义模型字段 
			             {name: 'id', type: 'int'},//产品id 
			             {name: 'title', type: 'string'},//产品名称 
			             {name: 'user_id', type: 'int'}//用户id 
			    ], 
			    proxy: { 
			    type : 'ajax', 
			        url : 'ProductServer.jsp', 
			    reader: { 
			            type: 'json', 
			            root: 'products' 
			        } 
			    } 
			}); 
			//创建User实例 
			var user = Ext.ModelManager.getModel('User'); 
			//读取id为1的User实例 
			user.load(1, { 
			    success: function(rec) { 
			    //获取user_id为1的产品Store 
			    var products = rec.getProducts(); 
			    //加载user_id为1的产品数据 
			    products.load({ 
			    callback : function(records, operation, success){ 
			    var msg = []; 
			    for(var i = 0; i < records.length; i++){ 
			    var rec = records[i]; 
			    msg.push('产品名称：'+rec.get('title')+' 用户id：'+rec.get('user_id')); 
			    } 
			    alert(msg.join('\n')); 
			    } 
			    }); 
			    } 
			}); 
			});
			
  * 多对一关系： 

			Ext.onReady(function(){ 
			//注册分类数据模型Category 
			Ext.regModel('Category', { 
			fields: [//定义模型字段 
					 {name: 'type', type: 'string'},//产品类型名称 
					 {name: 'id', type: 'int'}//产品类型id 
			], 
			proxy: { 
			type : 'ajax', 
				url : 'CategoryServer.jsp' 
			} 
			}); 
			//注册产品数据模型Product 
			Ext.regModel('Product', { 
				fields: [//定义模型字段 
						 {name: 'id', type: 'int'},//产品id 
						 {name: 'title', type: 'string'},//产品名称 
						 {name: 'category_id', type: 'int'}//用户id 
				], 
				belongsTo : 'Category' 
			}); 
			//创建product实例 
			var product = new Product({ 
				id: 100, 
				category_id: 1, 
				title: '产品1' 
			}); 
			product.getCategory(function(category, operation){ 
			//获取类型名称 
			alert(category.get('type')); 
			}); 
			}); 

7. PROXY介绍 

    分为客户端和服务端代理 
  
    ext.data.proxy.proxy为所有代理类的父类，有四个执行操作CRUD封装了。 
  
    * ext.data.proxy.memory为ext.data.proxy.client的子类 
  
			Ext.onReady(function(){ 
			//创建数据模型 
			Ext.regModel('User', { 
			    fields: ['id','name','age'] 
			}); 
			
			//定义内存数据变量 
			var userData = { 
			    users : [ 
			            { id: 1, name: '张三', age: 20 }, 
			            { id: 2, name: '李四', age: 30 }, 
			            { id: 3, name: '王五', age: 40 } 
			        ] 
			}; 
			
			//创建memory代理 
			var memoryProxy = new Ext.data.proxy.Memory({ 
			model : 'User', 
			reader: { 
			            root: 'users' 
			        }, 
			data : userData 
			}); 
			
			//读取数据 
			memoryProxy.read(new Ext.data.Operation(), callBack) 
			//数据读取之后的回调函数 
			function callBack(result){ //load方法的回调函数 
			var totalRecords = result.resultSet.total; 
			alert('读取内存数据，记录总是：'+totalRecords); 
			} 
			}); 
		
		
 	* ext.data.proxy.webstorage分为ext.data.proxy.localstorage和ext.data.proxy.sessionstorage 都是支持HTML5的DOMSTORAGE才有用的 

			
			
		    Ext.onReady(function(){ 
			//创建数据模型 
			Ext.regModel('User', { 
			    fields: ['id','name','age'], 
			    proxy: { 
			        type: 'localstorage',//使用Ext.data.proxy.LocalStorage代理 
			        id  : 'User-Searches'//代理数据的唯一标志 
			    } 
			}); 
			
			var store = new Ext.data.Store({ 
			    model: "User" 
			}); 
			
			//添加数据 
			store.add({name: '张三', age: 20}); 
			store.add({name: '李四', age: 30}); 
			
			//保存数据 
			store.sync(); 
			//读取数据 
			store.load(); 
			
			var msg = []; 
			store.each(function(rec){ 
			msg.push(rec.get('id')+' '+rec.get('name')+' '+rec.get('age')); 
			}); 
			
			alert(msg.join('\n')); 
			}); 


 * ext.data.proxy.server服务端类，其中分为三个子类 
     * ext.data.proxy.ajax
     
				Ext.onReady(function(){ 
				//创建数据模型 
				Ext.regModel('Person', { 
				    fields: ['name','age'] 
				}); 
				//创建Ajax代理 
				var ajaxProxy = new Ext.data.proxy.Ajax({ 
				url : 'personServer.jsp', 
				model: 'Person', 
				    reader: 'json' 
				}); 
				//创建请求参数对象 
				var operation = new Ext.data.Operation({ 
				    action: 'read'//设置请求动作为read 
				}); 
				//读取数据 
				ajaxProxy.doRequest(operation,callBack); 
				//doRequest方法的回调函数 
				function callBack(operation){ 
				//获取原始响应数据 
				var responseText = operation.response.responseText; 
				//获得记录总数 
				var totalRecords = operation.resultSet.totalRecords; 
				//获得记录数组 
				var records = operation.resultSet.records; 
				
				alert('使用Ajax代理读取远程数据，记录总是：'+totalRecords); 
				} 
				}); 
	 
	 
	 * EXT JS 4中支持REST,EXT.DATA.PROXY.REST 
  
			    Ext.onReady(function(){ 
				//创建数据模型 
				Ext.regModel('Person', { 
			    fields: ['id','name','age'], 
			    proxy: { 
			        type: 'rest',//使用Ext.data.proxy.Rest代理 
			        url : '/persons' 
			    } 
				}); 
				
				var person1 = Ext.ModelManager.create({name: '张三', age: 20}, 'Person'); 
				person1.save();//由于是新建数据未指定id，因此执行create方法。 
				
				var person2 = Ext.ModelManager.create({id:200,name: '李四', age: 20}, 'Person'); 
				person2.save();//由于指定id为200，因此执行update方法。 
				
				var person3 = Ext.ModelManager.getModel('Person'); 
				person3.load(300)//调用read方法,读取id为300的数据。 
				
				var person4 = Ext.ModelManager.create({id:400,name: '王五', age: 20}, 'Person'); 
				person4.destroy();//由于指定id为400，因此执行destroy方法。 
				}); 

      * EXT.DATA.PROXY.JSONP
	     
				Ext.onReady(function(){ 
				//创建数据模型 
				Ext.regModel('Person', { 
				    fields: ['id','name','age'], 
				    proxy: { 
				        type: 'jsonp',//使用Ext.data.proxy.JsonP代理 
				        url : 'http://192.168.1.150:8080/JsonPProxyServer.jsp' 
				    } 
				}); 
				var person = Ext.ModelManager.getModel('Person'); 
				//跨域读取数据 
				person.load(1,{ 
				success: function(rec) { 
				    alert('姓名：'+rec.get('name')+'\n年龄：'+rec.get('age')); 
				    } 
				}); 
				}); 


  			服务端: 
  
  
			     <% 
			    String id = request.getParameter("id"); 
				String personName = "{id:"+id+",name:'张三',age:30}"; 
				boolean jsonP  = false; 
				//获取回调函数名称 
				String cb = request.getParameter("callback"); 
				if (cb != null) { 
				jsonP  = true; 
				response.setContentType("text/javascript;charset=UTF-8"); 
				} else { 
				response.setContentType("application/x-json;charset=UTF-8"); 
				} 
				String msg = ""; 
				if (jsonP ) { 
				msg = cb + "("; 
				} 
				
				msg += personName; 
				
				if (jsonP ) { 
				msg += ");"; 
				} 
				response.getWriter().write(msg); 
				%> 
  
   
8. Reader读取器 

  	相当于在原始数据格式与EXT JS标准格式之间进行转换. 
   
  	A EXT.DATA.READER.JSON 
   

		Ext.onReady(function(){ 
		//JSON格式的用户及订单信息 
		var userData = { 
		"total" : 2000, 
		"users": [{ 
		"id": 123, 
		"name": "张三", 
		"orders": [{ 
		"id": 50, 
		"total" : 100 
		}] 
		}] 
		} 
		//定义用户User模型 
		Ext.regModel("User", { 
		    fields: [ 'id', 'name' ], 
		    hasMany: 'Order'//定义User与Order之间的一对多关系 
		}); 
		//定义订单Order模型 
		Ext.regModel("Order", { 
		    fields: [ 'id', 'total' ], 
		    belongsTo: 'User'//定义Order与User之间的多对一关系 
		}); 
		
		//创建memory代理 
		var memoryProxy = new Ext.data.proxy.Memory({ 
		model : 'User', 
		reader: { 
		            type: 'json',//Ext.data.reader.Json读取器 
		            root: 'users' 
		        }, 
		data : userData 
		}); 
		//读取数据 
		memoryProxy.read(new Ext.data.Operation(), callBack) 
		//数据读取之后的回调函数 
		function callBack(result){ 
		//获取总记录数 
		var count = result.resultSet.total; 
		//获取第一个用户信息 
		var user = result.resultSet.records[0]; 
		//获取该用户的第一个账单信息 
		var order = user.orders().getAt(0); 
		alert('总记录数：'+count+ 
		  '\n姓名：'+user.get('name')+ 
		  '\n账单金额：'+order.get('total')); 
		} 
		}); 


  	B 读复杂的JSON数据 
  
     
		 Ext.onReady(function(){ 
		//JSON格式的用户及订单信息 
		var userData = { 
		"users": [{ 
		"searchDate" : "2011-04-24",//查询时间 
		"role" : "admin",//查询人角色 
		"info" : { 
		"id": 123, 
		"name": "张三" 
		} 
		}] 
		} 
		//定义用户User模型 
		Ext.regModel("User", { 
		    fields: [ 'id', 'name' ] 
		}); 
		
		//创建memory代理 
		var memoryProxy = new Ext.data.proxy.Memory({ 
		model : 'User', 
		reader: { 
		            type: 'json',//Ext.data.reader.Json读取器 
		            root: 'users', 
		            record : 'info'//定位有效数据的位置 
		        }, 
		data : userData 
		}); 
		//读取数据 
		memoryProxy.read(new Ext.data.Operation(), callBack) 
		//数据读取之后的回调函数 
		function callBack(result){ 
		//获取第一个用户信息 
		var user = result.resultSet.records[0]; 
		alert('姓名：'+user.get('name')); 
		} 
		}); 
		</code></pre> 
		
		   C 读取XML 
			
		<pre><code>
		       Ext.onReady(function(){ 
		//定义用户User模型 
		Ext.regModel("User", { 
		    fields: [ 'id', 'name' ], 
		    proxy: { 
		        type: 'ajax', 
		        url : 'xmlServer.jsp', 
		        reader: { 
		            type: 'xml',//Ext.data.reader.Xml解析器 
		            record: 'user' 
		        } 
		    } 
		}); 
		
		var user = Ext.ModelManager.getModel('User'); 
		//通过代理读取数据 
		user.load(1, { 
		    success: function(rec) { 
		    alert("XML读取器示例：\n" + 
		      "用户姓名："+rec.get('name')); 
		    } 
		}); 
		}); 


9. writer写入器 

    * ext.data.writer.json:将实体模型MODEL中的数据转为JSON格式发到服务端 
	
	
		    Ext.onReady(function(){ 
			//定义用户User模型 
			Ext.regModel("User", { 
			    fields: ['id', 'name', 'age' ], 
			    proxy: { 
			        type: 'ajax', 
			        url : 'writerServer.jsp', 
			        writer : { 
			            type: 'json'//Ext.data.writer.Json读取器 
			        } 
			    } 
			}); 
			
			//创建User模型的实体对象 
			var user = Ext.ModelMgr.create({ 
			id : 1, 
			    name : 'tom', 
			    age  : 24 
			}, 'User'); 
			
			//保存数据，格式化后的数据将被发往服务端 
			user.save({ 
			success : function(){alert("数据保存成功")}, 
			failure : function(){alert("数据保存失败")} 
			}); 
			}); 


10. STORE数据集 
   为客户端MODEL的缓存,通过数据代理加载数据,也可以LOADATE的手工方法加载数据.ext.data.store提供了排序, 
过滤,查找等功能 

    * 简单的 

		     Ext.onReady(function(){ 
			//定义用户User模型 
			Ext.regModel("User", { 
			    fields: ['name', 'age' ], 
			    proxy: { 
			        type: 'memory' 
			    } 
			}); 
			//创建数据集对象 
			var myStore = new Ext.data.Store({ 
			autoLoad: true, 
			data : [{name: '张三', age : 20}, 
			                {name: '李四', age : 30}], 
			    model: 'User' 
			}); 
			//遍历Store中的记录 
			var msg = ['遍历Store中的记录：']; 
			myStore.each(function(rec){ 
			msg.push('姓名:'+rec.get('name')+' 年龄:'+rec.get('age')); 
			}); 
			alert(msg.join('\n')); 
			}); 


    * ARRAYSTORE 
    
			Ext.onReady(function(){ 
			//定义用户User模型 
			Ext.regModel("User", { 
			    fields: ['name', 'age' ], 
			    proxy: 'memory' 
			}); 
			//创建ArrayStore数据集对象 
			var myStore = new Ext.data.ArrayStore({ 
			autoLoad: true, 
			data : [['张三',20],['李四',30]],//数组数据 
			    model: 'User' 
			}); 
			//遍历Store中的记录 
			var msg = ['遍历ArrayStore中的记录：']; 
			myStore.each(function(rec){ 
			msg.push('姓名:'+rec.get('name')+' 年龄:'+rec.get('age')); 
			}); 
			alert(msg.join('\n')); 
			}); 
