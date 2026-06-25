const debugWebPage="https://script.google.com/a/macros/colpal.com/s/AKfycbzPkjt4dleuNMc6-GyhkxrK-KehT4rk37DvztwzaOBN/dev";    /**Web_Url_Dev**/
const afterDeployNewPage="https://script.google.com/a/macros/colpal.com/s/AKfycbw1MZrc24Kf40NsBHF3SggBD6sFKbFxalH_4dkXICgqnWJ5SQ2-5b5C2WNvPlLW_cQc6Q/exec";       /**Web_Url_Exec**/
const userID_id="1F7G3WOY5xM4fEYZ1s5RKulY4kJhqCZ9HefthmiVkraM";   /**用户信息表ID**/
const moldManagementRcord_id="1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U";   /**模具管理后台记录表ID**/
const saasId_moldInfo="1f3_JOdFtdTV7TbK_gw6b470DCNFj95VZjtiKmSd6H70";   /**模具信息主数据表ID**/
const sbnName_moldInfo="模具主数据";   /**模具信息主数据表Sheet名**/
const saasId_changeOver="1a51w3HvBx-DO3pLBxR2f2BuVvCvfb57YcgiDEzX-kKM";   /**转规格数据表Id**/
const sbnName_changeOver="Record";   /**转规格数据表Sheet名**/
const wsPlanId="1__w48CQA7rERW5VpxfNT12fxiKNSvTrDOr5Pt_f6aDs";   /**平板计划表ID**/
const sbnName_machine="Machine";   /**平板计划表Sheet名**/
const folder_id="";      /**文件夹ID(暂未用到)**/
const html_icon="https://images.ctfassets.net/m3056igwnpsm/5jKmJJGQs8hjOHGr6I5uV7/8554e0caa6c575f2dccb5315d34b2b59/Mold.png";   /**Web标签图标**/

const sbnMoldInfo=SpreadsheetApp.openById(saasId_moldInfo).getSheetByName(sbnName_moldInfo);     /**模具信息主数据表**/
const arrMoldInfo=sbnMoldInfo.getRange(1,1,sbnMoldInfo.getLastRow(),8).getDisplayValues();     /**模具信息主数据**/
const arrMoldNoStep=arrMoldInfo.map(v=>v[4]);   /**模具信息主数据-模具号**/

const sabi_plan=SpreadsheetApp.openById(wsPlanId);         /**平板计划表**/
const sbn_machine=sabi_plan.getSheetByName(sbnName_machine);     /**平板计划机台Sheet**/
const arrAemAll=sbn_machine.getRange(2,1,sbn_machine.getLastRow()-1,8).getDisplayValues();    /**平板计划机台数据**/

const regStrHalfWidth = /['+"]/;    /**半角字符正则**/
const regStrFullWidth = /[＇＋＂]/;   /**全角字符正则**/

const Route={};                              
Route.path=function(rou,callback){
  Route[rou]=callback;
}

/***根据网址返回的参数调用其它网页***/
function doGet(e) {
  Route.path("Login",Load_Login);
  Route.path("Repair",Load_Repair);
  Route.path("Maintenance",Load_Maintenance);
  Route.path("Test",Load_Test);
  Route.path("ChangeOver",Load_ChangeOver);

  /***从URL提取SSO参数（EDS直接跳转时传入）***/
  let sso = {
    loginId: e.parameters.loginId ? e.parameters.loginId[0] : "",
    loginName: e.parameters.loginName ? e.parameters.loginName[0] : "",
    loginWorkshop: e.parameters.loginWorkshop ? e.parameters.loginWorkshop[0] : "",
    loginProcess: e.parameters.loginProcess ? e.parameters.loginProcess[0] : "INJ"
  };

  if(Route[e.parameters.ALP]){
    return Route[e.parameters.ALP](e.parameters.paraTemp1,e.parameters.paraTemp2);
  }
  if(Route[e.parameters.v]){
    return Route[e.parameters.v](sso);
  }
  else{
    let tmp1=HtmlService.createTemplateFromFile("Login");
    tmp1.paraTemp1="";
    tmp1.paraTemp2="";
    return tmp1.evaluate().setTitle("注塑模具管理").setFaviconUrl(html_icon);
  }
}

function Load_Login(paraTemp1,paraTemp2) {
  return render("Login",{title:"注塑模具管理",paraTemp1:paraTemp1,paraTemp2:paraTemp2}).setFaviconUrl(html_icon);
}

function Load_Repair(sso) {
  let obj = {title:"注塑模具维修"};
  if (sso && sso.loginId) {
    obj.ssoLoginId = sso.loginId;
    obj.ssoLoginName = sso.loginName;
    obj.ssoLoginWorkshop = sso.loginWorkshop;
    obj.ssoLoginProcess = sso.loginProcess || "INJ";
  }
  return render("Repair",obj).setFaviconUrl(html_icon);
}

function Load_Maintenance(sso) {
  let obj = {title:"注塑模具保养"};
  if (sso && sso.loginId) {
    obj.ssoLoginId = sso.loginId;
    obj.ssoLoginName = sso.loginName;
    obj.ssoLoginWorkshop = sso.loginWorkshop;
    obj.ssoLoginProcess = sso.loginProcess || "INJ";
  }
  return render("Maintenance",obj).setFaviconUrl(html_icon);
}

function Load_Test(sso) {
  let obj = {title:"注塑模具测试"};
  if (sso && sso.loginId) {
    obj.ssoLoginId = sso.loginId;
    obj.ssoLoginName = sso.loginName;
    obj.ssoLoginWorkshop = sso.loginWorkshop;
    obj.ssoLoginProcess = sso.loginProcess || "INJ";
  }
  return render("Test",obj).setFaviconUrl(html_icon);
}

function Load_ChangeOver(sso) {
  let obj = {title:"注塑模具转规格"};
  if (sso && sso.loginId) {
    obj.ssoLoginId = sso.loginId;
    obj.ssoLoginName = sso.loginName;
    obj.ssoLoginWorkshop = sso.loginWorkshop;
    obj.ssoLoginProcess = sso.loginProcess || "INJ";
  }
  return render("ChangeOver",obj).setFaviconUrl(html_icon);
}

function render(file, obj){
  let tmp = HtmlService.createTemplateFromFile(file);
  if(obj){
    let keys = Object.keys(obj);
    keys.forEach(function(key){
      tmp[key] = obj[key];
    });
  }
  /*** 始终注入 SSO 字段默认值（空字符串），HTML 模板安全引用 <?!=ssoLoginId?> 等 ***/
  tmp.ssoLoginId = (obj && obj.ssoLoginId) ? obj.ssoLoginId : "";
  tmp.ssoLoginName = (obj && obj.ssoLoginName) ? obj.ssoLoginName : "";
  tmp.ssoLoginWorkshop = (obj && obj.ssoLoginWorkshop) ? obj.ssoLoginWorkshop : "";
  tmp.ssoLoginProcess = (obj && obj.ssoLoginProcess) ? obj.ssoLoginProcess : "";

  let titleMap = {
    "Repair": "注塑模具维修",
    "Maintenance": "注塑模具保养",
    "Test": "注塑模具测试",
    "ChangeOver": "注塑模具转规格"
  };
  let title = titleMap[file] || "注塑模具管理";
  return tmp.evaluate().setTitle(title);
}

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/***获取并返回URL***/
function getDeployWebUrl(){
  let deployWebUrl=ScriptApp.getService().getUrl();
  return deployWebUrl;
}

/***获取工号姓名主数据并返回Login网页存入localStorage***/
function getUserInfo(){
  let sabi_userInfo= SpreadsheetApp.openById(userID_id);
  let sbn_userID= sabi_userInfo.getSheetByName("userID");
  let arrUserId=sbn_userID.getRange(3,1,sbn_userID.getLastRow()-2,8).getValues(); 
  let arrUserInfo=arrUserId.map(function(x){return [x[0],x[1]+'【|】'+x[2]+'【|】'+x[5]+'【|】'+x[6]+'【|】'+x[7]];})
  return arrUserInfo;
}

/***获取机台列表***/
function getAem(loginWorkshop,loginProcess){
  try{
    loginProcess="INJ";
    let arrAem;
    if(loginWorkshop=="ALL"){
      /***ALL 车间返回全部 INJ 机台***/
      arrAem=arrAemAll.filter(v=>{return v[7].indexOf("-"+loginProcess)!=-1}).map(v=>{return v[0]});
    }else{
      let workshopProcess=loginWorkshop+"-"+loginProcess;
      arrAem=arrAemAll.filter(v=>{return v[7]==workshopProcess}).map(v=>{return v[0]});
    }
    return ["OK",arrAem];
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***获取转规格信息***/
function getCoInfo(loginWorkshop,loginProcess,proDate){
  try{
    let saas_CoInfo=SpreadsheetApp.openById("1rluhsoy_MbNIi8ZN5t2z9EGDvB7fbaaS_4lNY-ouKL8");
    let sbn_CoInfo=saas_CoInfo.getSheetByName("IM");
    let arrCoInfo=sbn_CoInfo.getRange(1,1,sbn_CoInfo.getLastRow(),20).getDisplayValues().filter(v=>{return v[1]==loginWorkshop&&formatVariableToYMD(v[4])==proDate&&v[14].toString().indexOf("转")!=-1});
    if(arrCoInfo.length>0){
      arrCoInfo=arrCoInfo.map(v=>{return [v[4],v[5],v[9],v[10],v[11],v[12],v[13],v[18],v[19]]});
      return ["OK",arrCoInfo]
    }
    else{
      return ["NO","未找到转规格信息"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***获取保养信息***/
function getPmInfo(loginWorkshop,loginProcess,proDate){
  try{
    let saas_PmInfo=SpreadsheetApp.openById("1J1imqvsveYnFHIWHNubCgM2jnRkip0gPlTdhIlXUVDQ");
    let sbn_PmInfo=saas_PmInfo.getSheetByName("database");
    let arrPmInfo=totalPmRecord(sbn_PmInfo);
    arrPmInfo=arrPmInfo.filter(v=>{return v[9].toString().substring(0,1)=="M"&&v[5]==loginWorkshop&&formatVariableToYMD(v[7])==proDate});
    if(arrPmInfo.length>0){
      arrPmInfo=arrPmInfo.map(v=>{return [v[7],v[8],v[9],v[20].toString().slice(-8),v[20]]});
      return ["OK",arrPmInfo]
    }
    else{
      return ["NO","未找到保养信息"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

function totalPmRecord(ss_am) {
  let arrOld=ss_am.getRange(2,4,ss_am.getLastRow()-1,ss_am.getLastColumn()-3).getDisplayValues();
  let arrSetup=[];
  let arrNew=[];
  let arrSplitTemp=[];
  let pmTimeDuration=0;
  for(let i=0;i<arrOld.length;i++){
    pmTimeDuration=arrOld[i][10];
    if(pmTimeDuration<=8){
      arrNew=arrNew.concat([arrOld[i]]);
    }
    else{
      arrSplitTemp=splitPmArr(arrOld[i],arrSetup);
      for(let j=0;j<arrSplitTemp.length;j++){
        arrNew=arrNew.concat([arrSplitTemp[j]]);
      }
    }
  }
  return arrNew;
}

function splitPmArr(arr,arrSetup){
  let startDate=arr[7];
  let startTime=arr[8];
  let startDateTime=new Date(startDate+" "+startTime).getTime();
  let pmTimeDuration=Number(arr[10]);
  let pmShifts=0;
  if(pmTimeDuration%8==0){
    pmShifts=Math.floor(pmTimeDuration/8);
  }
  else{
    pmShifts=Math.ceil(pmTimeDuration/8);
  }
  let arrTemp=[];
  let arrCopy=[];
  let newDateTime="";
  let newDate="";
  let newTime="";
  let leftPmTimeDuration=0;
  let n=0;
  for(let i=0;i<pmShifts;i++){
    leftPmTimeDuration=pmTimeDuration-i*8;
    arrCopy=copyOneDimensionalArr(arr);
    newDateTime=new Date(startDateTime+n*8*3600*1000);
    newDate=Utilities.formatDate(new Date(newDateTime),"Asia/Shanghai","yyyy-MM-dd");
    newTime=Utilities.formatDate(new Date(newDateTime),"Asia/Shanghai","HH:mm:ss");
    if(arrSetup.indexOf(newDate)==-1){
      arrCopy.splice(7,2,newDate,newTime);
      if(leftPmTimeDuration>=8){
        arrCopy.splice(10,1,8);
      }
      else{
        arrCopy.splice(10,1,leftPmTimeDuration);
      }
      arrTemp.push(arrCopy);
    }
    else{
      i=i-1;
    }
    n=n+1;
  }
  return arrTemp;
}

function copyOneDimensionalArr(arr){
  let arrTemp=[];
  for(let i=0;i<arr.length;i++){
    arrTemp.push(arr[i]);
  }
  return arrTemp;
}

/***获取历史下模信息***/
function getHistoryUninstall(loginWorkshop,loginProcess,moldNoHistoryUninstall,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues().filter(v=>(v[5]=="下模"||v[5]=="入库"||v[5]=="出库")&&v[6]=="维修");
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0])+v[3]);
    let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
    let arrDataFilter=[];
    console.log(arrMoldInfoScan);
    if(moldNoHistoryUninstall&&arrMoldInfoScan){
      arrDataFilter=arrData.filter(v=>{return v[3]==moldNoHistoryUninstall&&halfWidthToFullWidth(v[4])==halfWidthToFullWidth(arrMoldInfoScan[0])&&v[6]==arrMoldInfoScan[3]&&v[9]=="下模"&&v[11]=="维修"&&arrMoldStatusInfo.indexOf(moldNoHistoryUninstall+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3])!=-1}).reverse();
    }
    else{
      let arrAllUninstallINfo=arrData.filter(v=>v[9]=="下模"&&v[11]=="维修").map(v=>v[3]+halfWidthToFullWidth(v[4])+v[6]);
      console.log(arrAllUninstallINfo)
      arrDataFilter=arrData.filter(v=>arrAllUninstallINfo.indexOf(v[3]+halfWidthToFullWidth(v[4])+v[6])!=-1&&arrMoldStatusInfo.indexOf(v[3]+halfWidthToFullWidth(v[4])+v[6])!=-1);
    }
    if(arrDataFilter.length>0){
      arrDataFilter=arrDataFilter.map(v=>[v[1],v[2],v[3],v[8],v[12],v[13]]);
      return ["OK",arrDataFilter];
    }
    else{
      return ["NO","未找到记录"]
    }

  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存CO出库信息***/
function saveOutWarehouse(loginWorkshop,loginProcess,outDate,outShift,coMachine,coBeforeMoldNo,coBefereProduct,moldNoOutWarehouse,coAfterProduct,loginName,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.indexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),14).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+v[4]+v[6]+v[9]+v[11]==outDate+outShift+moldNoOutWarehouse+arrMoldInfoScan[0]+arrMoldInfoScan[3]+"出库"+"转规格"});
      if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoOutWarehouse,arrMoldInfoScan)
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),outDate,outShift,moldNoOutWarehouse,objMoldInfo["模具名称"],objMoldInfo["产品名称"],objMoldInfo["模具步骤"],coAfterProduct,"模具间","出库",loginName,"转规格"]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([["模具间","出库","转规格"]]);
        return ["OK","出库信息保存成功"];
      }
      else{
        return ["NO","当前模具有当前日期班次出库信息"]
      }
    }
    else{
      return ["NO","该模具不在模具状态清单"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存CO上模信息***/
function saveInstallMold(loginWorkshop,loginProcess,outDate,outShift,coMachine,coBeforeMoldNo,coBeforeProduct,coAfterMoldNo,coAfterProduct,installMachine,loginName,arrMoldInfoScan,installRemark){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.indexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3+halfWidthToFullWidth(v[4])+v[6]]+v[9]+v[11]==outDate+outShift+coAfterMoldNo+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"上模"+"转规格"});
      if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,coAfterMoldNo,arrMoldInfoScan)
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),outDate,outShift,coAfterMoldNo,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],coAfterProduct,installMachine,"上模",loginName,"转规格","",installRemark])
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([[installMachine,"上模","转规格"]]);
        return ["OK","上模信息保存成功"];
      }
      else{
        return ["NO","当前模具有当前日期班次上模信息"]
      }
    }
    else{
      return ["NO","该模具不在模具状态清单"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存CO下模信息***/
function saveUninstallMold(loginWorkshop,loginProcess,outDate,outShift,coMachine,coBeforeMoldNo,coBeforeProduct,coAfterMoldNo,coAfterProduct,uninstallMachine,loginName,arrMoldInfoScan,uninstallRemark){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.indexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let statusListLocation=arrMoldStatusList[position][4];
      if(statusListLocation==coMachine){
        let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
        let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==outDate+outShift+coBeforeMoldNo+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"下模"+"转规格"});
        if(arrDataFilter.length<1){
          let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,coBeforeMoldNo,arrMoldInfoScan)
          sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),outDate,outShift,coBeforeMoldNo,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],coBeforeProduct,uninstallMachine,"下模",loginName,"转规格","",uninstallRemark]);
          sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([[uninstallMachine,"下模","转规格"]]);
          return ["OK","下模信息保存成功"];
        }
        else{
          return ["NO","当前模具有当前日期班次下模信息"]
        }
      }
      else{
        return ["NO","模具计划在"+coMachine+"；状态在："+statusListLocation]
      }
    }
    else{
      return ["NO","该模具不在模具状态清单"]
    }

  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存CO入库信息***/
function saveInWarehouse(loginWorkshop,loginProcess,inDate,inShift,coMachine,coBeforeMoldNo,coBeforeProduct,moldNoInWarehouse,coAfterProduct,loginName,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.indexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let statusListLocation=arrMoldStatusList[position][4];
      if(statusListLocation!="模具间"){
        let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
        let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==inDate+inShift+moldNoInWarehouse+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"入库"+"转规格"});
        if(arrDataFilter.length<1){
          let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoInWarehouse,arrMoldInfoScan)
          sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),inDate,inShift,moldNoInWarehouse,objMoldInfo["模具名称"],halfWidthToFullWidth(objMoldInfo["产品名称"]),objMoldInfo["模具步骤"],coBeforeProduct,"模具间","入库",loginName,"转规格"]);
          sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([["模具间","入库","转规格"]]);
          return ["OK","入库信息保存成功"];
        }
        else{
          return ["NO","当前模具有当前日期班次入库信息"]
        }
      }
      else{
        return ["NO","当前模具状态已经在模具间"]
      }
    }
    else{
      return ["NO","该模具不在模具状态清单"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存PM下模信息***/
function savePmUninstallMold(loginWorkshop,loginProcess,uninstallDate,uninstallShift,moldNoUninstall,machineUninstall,uninstallMoldNo,uninstallMachine,loginName,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.indexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==uninstallDate+getZhShiftFromVariable(uninstallShift)+moldNoUninstall+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"下模"+"保养"});
      if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoUninstall,arrMoldInfoScan)
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),uninstallDate,getZhShiftFromVariable(uninstallShift),moldNoUninstall,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"",machineUninstall,"下模",loginName,"保养"]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([[machineUninstall,"下模","保养"]]);
        return ["OK","下模信息保存成功"];
      }
      else{
        return ["NO","当前模具有当前日期班次下模信息"]
      }
    }
    else{
      return ["NO","该模具不在模具状态清单"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存PM入库信息***/
function savePmInWarehouse(loginWorkshop,loginProcess,inDate,inShift,moldNoInWarehouse,inMoldNo,inMachine,loginName,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.indexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==inDate+getZhShiftFromVariable(inShift)+moldNoInWarehouse+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"入库"+"保养"});
      if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoInWarehouse,arrMoldInfoScan);
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),inDate,getZhShiftFromVariable(inShift),moldNoInWarehouse,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"","模具间","入库",loginName,"保养"]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([["模具间","入库","保养"]]);
        return ["OK","入库信息保存成功"];
      }
      else{
        return ["NO","当前模具有当前日期班次入库信息"]
      }
    }
    else{
      return ["NO","该模具不在模具状态清单"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存PM出库信息***/
function savePmOutWarehouse(loginWorkshop,loginProcess,outDate,outShift,moldNoOutWarehouse,outMoldNo,outMachine,loginName,arrMoldInfoScan,outWarehouseRemark){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.indexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==outDate+outShift+moldNoOutWarehouse+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"出库"+"保养"});
      if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoOutWarehouse,arrMoldInfoScan);
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),outDate,getZhShiftFromVariable(outShift),moldNoOutWarehouse,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"","模具间","出库",loginName,"保养","",outWarehouseRemark]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([["模具间","出库","保养"]]);
        return ["OK","出库信息保存成功"];
      }
      else{
        return ["NO","当前模具有当前日期班次出库信息"]
      }
    }
    else{
      return ["NO","该模具不在模具状态清单"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存PM上模信息***/
function savePmInstallMold(loginWorkshop,loginProcess,installDate,installShift,moldNoInstall,machineInstall,installMoldNo,installMoldNo,loginName,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.indexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==installDate+getZhShiftFromVariable(installShift)+moldNoInstall+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"上模"+"保养"});
      if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoInstall,arrMoldInfoScan);
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),installDate,getZhShiftFromVariable(installShift),moldNoInstall,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"",machineInstall,"上模",loginName,"保养"]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([[machineInstall,"上模","保养"]]);
        return ["OK","上模信息保存成功"];
      }
      else{
        return ["NO","当前模具有当前日期班次上模信息"]
      }
    }
    else{
      return ["NO","该模具不在模具状态清单"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存Repair下模信息***/
function saveReUninstallMold(loginWorkshop,loginProcess,nowDate,shift,moldNoUninstall,machineUninstall,loginName,moldNoUninstallDes,uninstallRemark,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.lastIndexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let statusListLocation=arrMoldStatusList[position][4];
      if(statusListLocation==machineUninstall&&statusListLocation!="模具间"){
        let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
        let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==nowDate+shift+moldNoUninstall+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"下模"+"维修"});
        // if(arrDataFilter.length<1){
          let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoUninstall,arrMoldInfoScan)
          sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),nowDate,shift,moldNoUninstall,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"",machineUninstall,"下模",loginName,"维修",moldNoUninstallDes,uninstallRemark]);
          sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([[machineUninstall,"下模","维修"]]);
          return ["OK","下模信息保存成功"];
        // }
        // else{
        //   return ["NO","当前模具有当前日期班次下模信息"]
        // }
      }
      else{
        return ["NO","模具计划在"+machineUninstall+"；状态在："+statusListLocation]
      }
    }
    else{
      return ["NO","该模具不在模具清单中"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存Repair入库信息***/
function saveReInWarehouse(loginWorkshop,loginProcess,loginName,rowDate,rowShift,moldNoInWarehouse,rowMoldNo,rowMachine,rowDes,rowRemark,inWarehourseRemark,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.lastIndexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==rowDate+rowShift+moldNoInWarehouse+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"入库"+"维修"});
      // if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoInWarehouse,arrMoldInfoScan)
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),rowDate,rowShift,moldNoInWarehouse,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"","模具间","入库",loginName,"维修",rowDes,inWarehourseRemark]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([["模具间","入库","维修"]]);
        return ["OK","入库信息保存成功"];
      // }
      // else{
      //   return ["NO","当前模具有当前日期班次入库信息"]
      // }
    }
    else{
      return ["NO","该模具不在模具清单中"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存Repair出库信息***/
function saveReOutWarehouse(loginWorkshop,loginProcess,loginName,rowDate,rowShift,moldNoOutWarehouse,rowMoldNo,rowMachine,rowDes,rowRemark,outWarehourseRemark,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.lastIndexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==rowDate+rowShift+moldNoOutWarehouse+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"出库"+"维修"});
      // if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoOutWarehouse,arrMoldInfoScan)
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),rowDate,rowShift,moldNoOutWarehouse,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"","模具间","出库",loginName,"维修",rowDes,outWarehourseRemark]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([["模具间","出库","维修"]]);
        return ["OK","出库信息保存成功"];
      // }
      // else{
      //   return ["NO","当前模具有当前日期班次出库信息"]
      // }
    }
    else{
      return ["NO","该模具不在模具清单中"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存Repair上模信息***/
function saveReInstallMold(loginWorkshop,loginProcess,loginName,rowDate,rowShift,moldNoInstall,machineInstall,installRemark,rowMoldNo,rowMachine,rowDes,rowRemark,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.lastIndexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==rowDate+rowShift+moldNoInstall+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"上模"+"维修"});
      // if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoInstall,arrMoldInfoScan)
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),rowDate,rowShift,moldNoInstall,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"",machineInstall,"上模",loginName,"维修",rowDes,installRemark]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([[machineInstall,"上模","维修"]]);
        return ["OK","上模信息保存成功"];
      // }
      // else{
      //   return ["NO","当前模具有当前日期班次上模信息"]
      // }
    }
    else{
      return ["NO","该模具不在模具清单中"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存Test上模信息***/
function saveTestInstallMold(loginWorkshop,loginProcess,loginName,nowDate,nowShift,moldNoInstall,machineInstall,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.lastIndexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==nowDate+nowShift+moldNoInstall+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"上模"+"测试"});
      // if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoInstall,arrMoldInfoScan)
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),nowDate,nowShift,moldNoInstall,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"",machineInstall,"上模",loginName,"测试","",""]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([[machineInstall,"上模","测试"]]);
        return ["OK","上模信息保存成功"];
      // }
      // else{
      //   return ["NO","当前模具有当前日期班次上模信息"]
      // }
    }
    else{
      return ["NO","该模具不在模具清单中"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***保存Test下模信息***/
function saveTestUninstallMold(loginWorkshop,loginProcess,loginName,nowDate,nowShift,moldNoUninstall,machineUninstall,arrMoldInfoScan){
  try{
    let saas_MoldMainData=SpreadsheetApp.openById("1tnpYdn-B_rQGS5bjWtDBBVtPv9n8_f9MCx8j55j6q0U");
    let sbn_MoldMainData=saas_MoldMainData.getSheetByName("Database_format");
    let sbn_MoldStatusList=saas_MoldMainData.getSheetByName("模具状态清单");
    let arrMoldStatusList=sbn_MoldStatusList.getRange(1,1,sbn_MoldStatusList.getLastRow(),9).getDisplayValues();
    let arrMoldStatusInfo=arrMoldStatusList.map(v=>v[1]+halfWidthToFullWidth(v[0]+v[3]));
    let position=arrMoldStatusInfo.lastIndexOf(arrMoldInfoScan[1]+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]);
    if(position!=-1){
      let arrData=sbn_MoldMainData.getRange(1,1,sbn_MoldMainData.getLastRow(),15).getDisplayValues();
      let arrDataFilter=arrData.filter(v=>{return v[1]+v[2]+v[3]+halfWidthToFullWidth(v[4])+v[6]+v[9]+v[11]==nowDate+nowShift+moldNoUninstall+halfWidthToFullWidth(arrMoldInfoScan[0])+arrMoldInfoScan[3]+"下模"+"测试"});
      // if(arrDataFilter.length<1){
        let objMoldInfo=getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNoUninstall,arrMoldInfoScan)
        sbn_MoldMainData.appendRow([formatVariableToYMDHMS(new Date()),nowDate,nowShift,moldNoUninstall,halfWidthToFullWidth(objMoldInfo["模具名称"]),objMoldInfo["产品名称"],objMoldInfo["模具步骤"],"",machineUninstall,"下模",loginName,"测试","",""]);
        sbn_MoldStatusList.getRange(position+1,5,1,3).setValues([[machineUninstall,"下模","测试"]]);
        return ["OK","上模信息保存成功"];
      // }
      // else{
      //   return ["NO","当前模具有当前日期班次上模信息"]
      // }
    }
    else{
      return ["NO","该模具不在模具清单中"]
    }
  }
  catch(e){
    return ["NO",e.toString()]
  }
}

/***格式化日期***/
function formatVariableToYMD(variable){
  let result="";
  if(variable){
    result=Utilities.formatDate(new Date(variable),"Asia/Shanghai","yyyy-MM-dd")
  }
  return result;
}

function formatVariableToYMDHMS(variable){
  let result="";
  if(variable){
    result=Utilities.formatDate(new Date(variable),"Asia/Shanghai","yyyy-MM-dd HH:mm:ss")
  }
  return result;
}

/***根据模具号及步骤索引其它模具信息***/
function getMoldInfoFromNoStep(arrMoldInfo,arrMoldNoStep,moldNo,arrMoldInfoScan){
  let objMoldInfo={};
  if(arrMoldInfoScan.length>0){
    objMoldInfo["模具名称"]=arrMoldInfoScan[0];
    objMoldInfo["模具号"]=moldNo;
    objMoldInfo["产品名称"]=arrMoldInfoScan[2];
    objMoldInfo["模具步骤"]=arrMoldInfoScan[3];
  }
  else{
    let position=arrMoldNoStep.indexOf(moldNo);
    if(position!=-1){
      objMoldInfo["模具名称"]=arrMoldInfo[position][1];
      objMoldInfo["模具号"]=moldNo;
      objMoldInfo["产品名称"]=arrMoldInfo[position][6];
      objMoldInfo["模具步骤"]=arrMoldInfo[position][7];
    }
    else{
      objMoldInfo["模具名称"]="";
      objMoldInfo["模具号"]=moldNo;
      objMoldInfo["产品名称"]="";
      objMoldInfo["模具步骤"]="";
    }
  }
  return objMoldInfo;
}

/***Time转换班次***/
function getZhShiftFromVariable(variable){
  let result="";
  if(variable.toString().length>1){
    if(variable.toString().indexOf(":")!=-1){
      let timeHour=Number(variable.split(":")[0]);
      if(timeHour>=8&&timeHour<16){result="早班"}else if(timeHour>=16&&timeHour<24){result="中班"}else if(timeHour>=0&&timeHour<8){result="夜班"}
    }
    else{
      result=strTime
    }
  }
  return result;
}

/***半角字符转换全角字符***/
function halfWidthToFullWidth(variable) { 
    let result = ""; 
    if(variable){
      if(regStrHalfWidth.test(variable)){
        for(let i=0;i<variable.length;i++){ 
          if(regStrHalfWidth.test(variable.charAt(i))){
            if(variable.charCodeAt(i)==32){ 
                result= result+ String.fromCharCode(12288); 
            } 
            if(variable.charCodeAt(i)<127){ 
                result=result+String.fromCharCode(variable.charCodeAt(i)+65248); 
            } 
          }
          else{
            result=result+variable.charAt(i);
          }
        } 
      }
      else{
        result=variable;
      }
    }
    return result; 
}

/***全角字符转换半角字符***/
function fullWidthToHalfWidth(variable) { 
    let result = "";
    if(variable){
      if(regStrFullWidth.test(variable)){ 
        for(let i=0;i<variable.length;i++){ 
          if(regStrFullWidth.test(variable.charAt(i))){
            if (variable.charCodeAt(i) == 12288){
                result += String.fromCharCode(variable.charCodeAt(i)-12256);
                continue;
            }
            if(variable.charCodeAt(i) > 65280 && variable.charCodeAt(i) < 65375){ 
                result += String.fromCharCode(variable.charCodeAt(i)-65248); 
            } 
            else{ 
                result += String.fromCharCode(variable.charCodeAt(i)); 
            } 
          }
          else{
            result += variable.charAt(i);
          }
        } 
      }
      else{
        result=variable;
      }
    }
    return result 
}

/***上传图片，并以日期命名(暂未用到)***/
function uploadpicFileToGoogleDrive(data, file) {
  try {
    let today_date=Utilities.formatDate(new Date(),'Asia/Shanghai', 'yyyy年M月d日 HH:mm:ss');
    let filename=today_date;
    let folder=DriveApp.getFolderById(folder_id);
    let files=folder.getFilesByName(filename);
    while(files.hasNext()){
      let file_next=files.next();
      file_next.setTrashed(true);
    }
    let contentType = data.substring(5,data.indexOf(';'));
    if(!contentType.match('image')){
      return ["NO",'你选择的不是图片文件'];
    }
    let bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7));
    let blob = Utilities.newBlob(bytes, contentType, file).setName(filename);    
    let fileid=folder.createFile(blob).getId();
    return ["OK",fileid];
  }
  catch (e) {
    return ["NO",e.toString()];
  }
}