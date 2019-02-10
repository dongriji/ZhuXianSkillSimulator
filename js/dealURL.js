
function DealURL(){}


URL = DealURL.prototype;
URL.encodeMap = {//映射表,用于压缩编码
  2:"j",3:"n",4:"v",5:"z",6:"l",7:"q",8:"g",9:"p",10:"t",
  11:"m",12:"k",13:"A",14:"B",15:"w","16":"r",17:"C",
  18:"h",19:"o",20:"i",21:"x",22:"y",23:"u",24:"s"
};
URL.decodeMap = {//反映射表，,用于解压缩编码
 g:8,h:18,i:20,j:2,k:12,l:6,m:11,n:3,o:19,
 p:9,q:7,r:16,s:24,t:10,u:23,v:4,w:15,x:21,
 y:22,z:5,A:13,B:14,C:17
};

URL.jiamiMap={ //加密映射表
    '0':'0','1':'4','2':'8','3':'c','4':'1','5':'5','6':'9',
    '7':'d','8':'2','9':'6','10':'a','11':'e','12':'3','13':'7',
    '14':'b','15':'f','16':'D','17':'E','18':'F','19':'G','20':'H'  
}

URL.jeimiMap={ //解密映射表
    '0':'0','1':'4','2':'8','3':'12','4':'1','5':'5','6':'9',
    '7':'13','8':'2','9':'6','a':'10','b':'14','c':'3','d':'7',
    'e':'11','f':'15','D':'16','E':'17','F':'18','G':'19','H':'20'     
}

URL.yasuo = {0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',
		10:'a',11:'b',12:'c',13:'d',14:'e',15:'f',16:'g',17:'h',18:'i',19:'j',
		20:'k',21:'l',22:'m',23:'n',24:'o',25:'p',26:'q',27:'r',28:'s',29:'t',
		30:'u',31:'v',32:'w',33:'x',34:'y',35:'z',36:'A',37:'B',38:'C',39:'D',
		40:'E',41:'F',42:'G',43:'H',44:'I',45:'J',46:'K',47:'L',48:'M',49:'N',
		50:'O',51:'P',52:'Q',53:'R',54:'S',55:'T',56:'U',57:'V',58:'W',59:'X'
		}
		
URL.jieya = {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
		'a':10,'b':11,'c':12,'d':13,'e':14,'f':15,'g':16,'h':17,'i':18,'j':19,
		'k':20,'l':21,'m':22,'n':23,'o':24,'p':25,'q':26,'r':27,'s':28,'t':29,
		'u':30,'v':31,'w':32,'x':33,'y':34,'z':35,'A':36,'B':37,'C':38,'D':39,
		'E':40,'F':41,'G':42,'H':43,'I':44,'J':45,'K':46,'L':47,'M':48,'N':49,
		'O':50,'P':51,'Q':52,'R':53,'S':54,'T':55,'U':56,'V':57,'W':58,'X':59
		}

 //将文本复制到剪贴板 
 //返回1成功，2浏览器不支持 ,3处理过程出错
URL.copyURL = function(text) {
    if(window.clipboardData) {//处理IE浏览器
        window.clipboardData.clearData();
        window.clipboardData.setData("Text", text);
        //alert("成功复制!");
        return 1;
    } else if(navigator.userAgent.indexOf("Opera") != -1) {//不支持Opera浏览器
        window.location = txt;
        alert("此功能不支持Opera");
        return 2;
    } else if(window.netscape) {//处理火狐浏览器
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
            alert("您的firefox安全限制限制您进行剪贴板操作,请打开'about:config'将 signed.applets.codebase_principal_support'设置为true'之后重试");
            return 2;
        }
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if(!clip) {
            return 3;
        }
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if(!trans) {
            return 3;
        }
        trans.addDataFlavor('text/unicode');
        var str = new Object();
        var len = new Object();
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = text;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if(!clip) {
            return 3;
        }
        clip.setData(trans, null, clipid.kGlobalClipboard);
        //alert("成功复制！");
        return 1;
    }
}

//压缩编码
URL.encode = function(text){
	var charMap = new Array();   
    var len = text.length;  
    var subchar="";
    var sameNum=1;
    var index=0;
    for(var i=0;i<len;i++){//按顺序记录字符连续个数，以{字符：字符个数}的形式记录
    	subchar = text.charAt(i);    	
    	sameNum=1;
    	while((i<len-1)&&(subchar==text.charAt(i+1))){
    		sameNum++;   
    		i++;		
    	} 
    	charMap[index++]={"char":subchar,"count":sameNum};    	
    }
    
    if(index>0){//有记录
    	if(charMap[index-1]['char']==0){ //去除末尾的0
    		charMap.length--;    		
    	}    	
    }
    
    var result =""
    for(var j=0;j<charMap.length;j++){
    	var count = charMap[j]['count'];
    	if(count!=1){
    		result+=URL.encodeMap[count]; 
    		//result+=count;    		
    	}
    	result+=charMap[j]['char'];       	
    }
    // document.write(result);
    return result;   
}

//解压缩编码
URL.decode = function(text){
	var len = text.length;  
    var subchar="";
    var result="";
    for(var i=0;i<len;i++){
    	subchar = text.charAt(i);
    	if(URL.decodeMap[subchar]){//表示个数的字符
    		var same = text.charAt(++i); //未对错误编码进行处理    		
    		for(var j=0;j<URL.decodeMap[subchar];j++){
    			result+=same;    			
    		}    		
    	}else{
    		result+=subchar;
    	}
    }    
    return result;   
}

//数值压缩编码
URL.encodeNum = function(text){
	var num = parseInt(text);
	var tmp_array=[];
	var result="";
	mod(num);   
	function mod(num){
		if(num >= 60){
        	var tmp_mod = num % 60;
        	tmp_array[tmp_array.length] = URL.yasuo[tmp_mod];
        	mod((num - tmp_mod)/60);
        }else{
        	tmp_array[tmp_array.length] = URL.yasuo[num];
        }
    }    
    for(var i=0;i<tmp_array.length;i++){
    	result+=tmp_array[i];    	
    }
    return result;
}

//数值解压编码
URL.decodeNum = function(text){
	var result = 0;
	for(var j = 0; j < text.length; j++){	        			
	    result += URL.jieya[text.charAt(j)]*Math.pow(60,j);
    }
    return result;	
}


//构建URL
URL.createURL = function() {
    //待分析的数据有:skill[][],tianshu[][],fengshen[][],zaohua[][],zaohuaTY[][],zaohuaMP[][]
        
    var skill_str = "";
    var tianshu_str = "";
    var fengshen_str = "";
    var zaohua_str = "";
    var zaohuaTY_str = "";
    var zaohuaMP_str = "";
    var other_str="";       
    //-------------------------------------------------------------------
    //获取加点信息和相关参数
    
    //获取技能加点信息   
    skill_str = getInf_S(skill); 
    
    //获取天书加点信息     
    tianshu_str = getInf_TZF(tianshu); 
        
    //造化加点信息     
    zaohua_str = getInf_TZF(zhaohua); 
    zaohuaMP_str = getInf_TZF(zhaohuaMP); 
    zaohuaTY_str = getInf_TZF(zhaohuaTY); 
           
    //封神加点信息    
    fengshen_str = getInf_TZF(fengshen); 
 
  
    //相关参数信息
    other_str = getOtherInf();   

    //--------------------------------------------------------------------
    //内置获取信息的函数    
    function getInf_S(entity) {//获取技能加点的信息
        var flag = -1;
        var temp = "";
        var index = "";
        var result = "";
        for(var i in entity) {
            flag++;
            temp = "";
            for(var j in entity[i]){
                index = entity[i][j]['add'];
                temp += URL.jiamiMap[index];//进行置换加密                
            }
            if(temp == 0) {//该重加点都为零，则退出循环
                break;
            }
            if(flag != 0) {
                result += '.';
            }
            temp = URL.encode(temp);//temp字符串进行压缩编码            
            result += temp;
        }        
        return result;
    }
     
    function getInf_TZF(entity) {//获取天书,造化和封神的加点信息
        var flag = -1;
        var temp = "";
        var index = "";
        var result = "";
        for(var i in entity) {
            flag++;
            temp = "";
            for(var j in entity[i]) {
                index = entity[i][j]['add'];
                temp += URL.jiamiMap[index];//进行置换加密                
            }
            if(temp == 0) {//该重加点都为零
               temp="";
            }else{
               temp = URL.encode(temp);//temp字符串进行压缩编码 
            }
            if(flag != 0) {
                result += '.';
            }                       
            result += temp;
        }        
        return result;
    }
 
    function getOtherInf(){ //其他相关信息，有些信息可能不用保存
        var result="";
        var cur_pesonlevel = URL.encodeNum($("#personLevel").val()); //人物等级         
        var cur_fengshenlevel = URL.encodeNum($("#fengshenLevel").val());//封神等级   
        var cur_skill = URL.encodeNum($("#curSkill").text()); //剩余技能
        var cur_tianshu = URL.encodeNum($("#curTianshu").text()); //剩余天书
        var cur_yuanshen = URL.encodeNum($("#curYuanshen").text()); //剩余元神修为 
        var cur_zaohua = URL.encodeNum($("#curZaohua").text()); //造化值        
        
        result=cur_pesonlevel+"."+cur_fengshenlevel+"."+cur_skill
                +"."+cur_tianshu+"."+cur_yuanshen+"."+cur_zaohua;
               
        return  result;         
    } 
    
    //-------------------------------------------------------------------
    //加点信息整合
    
    var urlhost = window.location.host + window.location.pathname;//获取当前路径，不带参数
    var urlparam ="";
    
    //相关参数信息
    urlparam = "O="+other_str;
    
    if(skill_str){//技能加点信息非空
       	urlparam+="&S="+skill_str;
    }
    
    if(tianshu_str!=".."){//天书加点信息非空    
    	urlparam+="&T="+tianshu_str;
    }
    
    if(zaohua_str!=".."){//造化非空
       	urlparam+="&Z="+zaohua_str;    	
    }
    
    if(zaohuaMP_str!=".."){//造化门派非空
       	urlparam+="&P="+zaohuaMP_str;    	
    }
    
    if(zaohuaTY_str!=".."){//造化天书非空
       	urlparam+="&Y="+zaohuaTY_str;    	
    }
    
    if(fengshen_str!=".."){//天书加点信息非空
       	urlparam+="&F="+fengshen_str;
    }
    
    var md5 = new MD5();
    var zaiyao = md5.getFlag(urlparam); //获取摘要信息
    urlparam+= "&M="+zaiyao;
    var url = urlhost+"?"+urlparam;
    return url; //返回构建好的url
}

//解析URL
URL.analyseURL = function() {
	var urlparam = window.location.search;//获取url中的相关参数
	
	if(urlparam.indexOf("?")==-1){//不带请求参数
		return 1; //路径正确，未带请求参数
	}
	
	var str = urlparam.substr(1);//获取全部参数	
	var md5Index = str.lastIndexOf("&M=");
	if(md5Index==-1){//没有摘要信息
		return 0;//请求信息被修改		
	}
	var leftStr = str.slice(0,md5Index);
	var rightStr = str.substr(md5Index+3);
	if(!leftStr){ //如有请求，O及M参数名是必须存在的
		return 0;//请求信息被修改
	}	
	
	var md5 = new MD5();
	if(md5.getFlag(leftStr)!=rightStr){ //摘要信息不匹配
		return 0;//请求信息被修改
	}
	
	//---------自此请求信息已经通过验证-------------------
	
	var strs =leftStr.split("&");
	var request ={};
	for(var i=0;i<strs.length;i++){
		//request[i]={"name":strs[i].split("=")[0],"value":strs[i].split("=")[1]};
		request[strs[i].split("=")[0]] = strs[i].split("=")[1];	
	}
	
	//--------------------------------------------------------------
	//将加点信息及相关参数写到JSON或页面
	
	if(request["O"]){ //人物等级等参数信息
		var params = request["O"].split(".");
		$("#personLevel").val(URL.decodeNum(params[0])); //人物等级		
		$("#fengshenLevel").val(URL.decodeNum(params[1]));//封神等级		
		$("#curPersonLevel").text(URL.decodeNum(params[0])+"级"); //人物等级         
        $("#curFengshenLevel").text(URL.decodeNum(params[1])+"级");//封神等级         
        $("#curSkill").text(URL.decodeNum(params[2])); //剩余技能
        $("#curTianshu").text(URL.decodeNum(params[3])); //剩余天书
        $("#curYuanshen").text(URL.decodeNum(params[4])); //剩余元神修为 
        $("#curZaohua").text(URL.decodeNum(params[5])); //造化值   				
	}else{
		return 0; //请求信息被修改，可以不用
	}
	
	if(request["S"]){//设置技能信息		
		setInf_S(request["S"],skill);	
	}
	
	if(request["T"]){//设置技能信息			
		setInf_TZF(request["T"],tianshu);	
	}
	
	if(request["Z"]){//设置造化信息	
		setInf_TZF(request["Z"],zhaohua);	
	}
	
	if(request["P"]){//设置造化信息	
		setInf_TZF(request["P"],zhaohuaMP);	
	}
	
	if(request["Y"]){//设置造化信息	
		setInf_TZF(request["Y"],zhaohuaTY);	
	}
	
    if(request["F"]){//设置封神信息		
    	setInf_TZF(request["F"],fengshen);
	}	
	
	function setInf_S(param,data){ //技能和天书赋值函数
        var params = param.split(".");       
        for(var chong in params){  
        	var dis = URL.decode(params[chong]); //解压缩          
            var len = dis.length;
            for(var g=0;g<len;g++){
                var add = URL.jeimiMap[dis.charAt(g)]; //解密
                data[chong][g+1]['add']= add; //赋值  
            }                    
        }                 
    }
    
    function setInf_TZF(param,data){ //造化和封神赋值函数
        var params = param.split(".");       
        for(var chong in params){  
        	if(params[chong]==""){
        		continue;
        	}
        	var dis = URL.decode(params[chong]); //解压缩          
            var len = dis.length;
            for(var g=0;g<len;g++){
                var add = URL.jeimiMap[dis.charAt(g)]; //解密
                data[chong][g+1]['add']= add; //赋值  
            }                    
        }                 
    }
    	
	return 2; //路径正确，带请求参数;
}

