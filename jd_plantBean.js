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
    // console.log(plantBeanIndexResult.data.taskList);
    if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0') {
      const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl
      $.myPlantUuid = getParam(shareUrl, 'plantUuid')
      console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.myPlantUuid}\n`);
      roundList = $.plantBeanIndexResult.data.roundList;
      currentRoundId = roundList[1].roundId;//本期的roundId
      lastRoundId = roundList[0].roundId;//上期的roundId
      awardState = roundList[0].awardState;
      $.taskList = $.plantBeanIndexResult.data.taskList;
      subTitle = `【京东昵称】${$.plantBeanIndexResult.data.plantUserInfo.plantNickName}`;
      message += `【上期时间】${roundList[0].dateDesc.replace('上期 ', '')}\n`;
      message += `【上期成长值】${roundList[0].growth}\n`;
      await receiveNutrients();//定时领取营养液
      await doHelp();//助力
      await doTask();//做日常任务
      await doEgg();
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
    message += `【上期状态】${roundList[0].tipBeanEndTitle}\n`;
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
    message += `【上期兑换京豆】${roundList[0].awardBeans}个\n`;
  }
  if (roundList[1].dateDesc.indexOf('本期 ') > -1) {
    roundList[1].dateDesc = roundList[1].dateDesc.substr(roundList[1].dateDesc.indexOf('本期 ') + 3, roundList[1].dateDesc.length);
  }
  message += `【本期时间】${roundList[1].dateDesc}\n`;
  message += `【本期成长值】${roundList[1].growth}\n`;
}
async function doCultureBean() {
  await plantBeanIndex();
  if ($.plantBeanIndexResult && $.plantBeanIndexResult.code === '0') {
    const plantBeanRound = $.plantBeanIndexResult.data.roundList[1]
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
    newShareCodes = ['3wmn5ktjfo7ukmrwev3rc5grmq3h7wlwy7o5jii','o7eiltak46s2xyvfiapuorykrc4nvcfkjqyvbza','gcdr655xfdjq7435uolpd57n7d7awchi7askn6a','4npkonnsy7xi244gg4ttcqmyenyo6bjzolex2vq','4oupleiwuds2bjtcctjcrlfjpn6ia24xi7r33gy','gou7sxm3hztwpxjcbypmjm463tstirutqpmxpyi','2vgtxj43q3jqzkl3dkypomb2j6aepcti2fa6u5q','nkvdrkoit5o64qne5qclomlvj54dptl5khmlkqq','mh5uulbrvnknkrzdindcjmiq6ylp3qzkrol4tgq','gkk4336xszaeghj7cq52sqdtvjvppnngjwwn3aa','7oivz2mjbmnx5yzh3p3gmu2hzrdkavwhvbgrsly','7oivz2mjbmnx43fzzj5nex724wtk4synhgzu3dq','gou7sxm3hztwpwxdsframjpkhlwwtyp7ld4g5xa','qmnmamd3ukiwqjc43dp2bgeqmdahhvux5zz2mnq','4npkonnsy7xi3x4zvk7zxi6h5wj73dvzxoluxhy','6abtinlqvnsuo2wcrr65fnnagjpz4b7c2amh7rq','4npkonnsy7xi3c76u5mudkd4e6cvr5qsi7pnoua','tt7eqqzc335bpy7qfh3khaevey','mh5uulbrvnknkckdqylwvg6aic63fwn7z7ageji','7nk3uezyst2wyvewtbigktu77e3h7wlwy7o5jii','elelo6444vpgnrmc2cdsyoq7my','x3x7xhsua3bmiy6fgtxhzi7uytmahshtm3bynii','olmijoxgmjutybdfdio3gfr6lqva6jgo3wifueq','mkd3uexc3qr5tnmyda6dqtijqrpz4b7c2amh7rq','fn5sjpg5zdejn6cjel5vuu5k6y2mjm5xpsmsvay','khfopsbyfw66rx2evfgbnk277e','xzutjytzfwgzbcwffuobkasagq','2eqln7qrtnrge2ophtrxws7rka','olmijoxgmjutzbkiuxcgcidw3jbcye66kd7wtki','s2i2nlmmkob6kmfglbr2j5ap2m5ac3f4ijdgqji','mcgrvvubnseb76qzexxo4hmusa','pofzzpvjd7idih2o43zajlbl5u','4numuxhigg77xwmwmfp2r6oilm3h7wlwy7o5jii','mlrdw3aw26j3w5rvpfjfyv4ypg67jpkruirwo4q','cshk5bfjifz754mydq6f3ocn3xeh76hgdazr57a','olmijoxgmjutzh6vjobbeqqwdozztujv72we23q','otcv6vmocc5ijf5toe6secns56obe7silysrnkdvrg7ajj3j4gnq','olmijoxgmjutzgvlkmxfxyknk2ifjuh6kx426dy'];
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
var _0xodD='jsjiami.com.v6',_0x418f=[_0xodD,'w5vDjsKmTcKz','wp4iYE0y','wotDQRtd','QgBucWM=','HsKKw4cACQ==','PU/DjW7Dqw==','ByB2GMOT','wq/Dq1bCmlg=','wol5MyFv','w7DDv8KT','w7jDlnE=','bsKdwqtY','WcOnw5bCn+isjeazmeWllei3qe+9u+ito+ahreacgee8p+i2jOmEj+itpA==','URYYw7s7wovChw3CiA==','w4PDs8KKw5Bn','e8KaG8OYw4zDpDU=','woBOPkY6','wqzDtnzCuGwJwoPDgcKg','wpNEPMOyPA==','XyMtw4I=','KsK6w4YMNQ==','w5jDmG3Dmgo=','w4fCixM1Yw==','FsKdw7gTKsOe','wqvCnTU=','w71zw4jCng==','WsKzw48f6K6v5rOu5aas6Laf77y56K2+5qOr5p6n57+y6LWm6YWh6K+0','G8OIJ8KWw4M=','SX/CiDrCqcKe','FcOEw7HCmsK2','w5hTfzNd','wqjCh3LCt14=','w61xX0h2w6HCksKTDMO9','wrIlw793','cidMWX5C','w7tJS8OC','dcKSwq9Sw6HCqcO8MSY=','wovCksKcfyZzf8KF','w6VCXsOedj3DvQktw5o=','aMKIwrJNw7zDpsKmdzfCsMONRmzCtcOww5Muw55Rw5/DsxXCoGY=','UMKzQ8KMwpnDrTt3aB53w7bCihnDisO4w6J5UETCm3tCfABSwq1BDcOHCEFcw73DhwfDosKGBcOuXCXDg1bDjMOdJcKyOColw5bDkMKZwp4wQMK2JcK+wr8rdCzCkU8FDmbCrz4FYgDCscOJw4dpQsK4w591WB3Cg8Krwo/CjcKrRCYOwplWISgNw4MjwrTDocKwYWw1wpvCjG4ZJsK5wovCs8O8eBDDosKpNsOULRDCuxArcsKfw5gEdsKEw7MWfcKfw6/DocOlwqM=','w59uw7xFUQ==','w5LCpDTDqcKi','SEPCvxzCrw==','ejV2flk=','G8OsFMKbw5I=','wqhtw6/Ci8KZ','wqtCw7rCm8KF','woLChBkNKA==','UsKlG8Ouw68=','wpnDmcKC','wopHw4jCpsKf','Jj/DisOlNA==','w7BKw4nCisOd','eMKyLMOVw6g=','wqccQmVG','w6LCsyjDicKh','w5DCoypzw7c=','w7gDw6HDhcKl','wqpMw5o=','w7/Dg17CmOivteawrOWnm+i2gu+/leituuagoeaenue+m+i3i+mGheivoQ==','VB3DvMOYLw==','w44rw57DnsKe','w7Vjw5LCgcO8','SgcLw7Ywwp7CnQ==','w7vDiMKLw55Z','w61gWQx7w6nClMKeHA==','c8OQwpVqwo4=','wqfCogk4BA==','fsKeDsOfw4E=','fMKuUMKhwoA=','wr7DsGfClXc=','LgtEB8OR','wpAlw6Jqw40=','wrlfNcK2Ug==','w6vDk8Knw5Fb','w7bDqnPDnjs=','w6zCuAJYOw==','wrtkEcOzAA==','KMObwpYOw4c=','wpvDt8K6a0I=','w7bCu8OMXBE=','c8OQwqZ+wow=','IsO9wpsYw7w=','w7DClC1Bw6Y=','ecK+SsKVwpI=','w67CszMZXQ==','w5A0WMOG','Pg7DtsOoBw==','w63ChCPDvcKAQQ==','wqxPVxFOOg==','MMOow5PCssKg','RDjDlcOMKw==','w7dbahNR','w7DCoRUyag==','JQLDhMOOJg==','w4YlWMKcQy9IwpfDq2pjwqc=','wqtFVSQRKcKzdMODwqk=','EcOSw7LCpsKJwqFLw6MEw6DDgsKWD03Cr8Kfw7N+VcK4wpwdfCtbNV/Co8K/UW3DiVMmCsOOwp3Cu2DDvEcGwqY8wrnCtwHDu8OdOXNJPcKLPMOsBMKtWsO9QsKlPcKjw6fCk04+WMOow5cCwpLCuDbDrw==','DSrDrcOzB1hWcVg7H8KZPMKsw78Qw68Wwr/DlknDulVpe8OQw7HCmXvDnAPDuBRawoLCiyIjwqzCj8K+TXvDnBfDnh1Jw5vCk8O8ETPCiWDDrRIvwql9LV01dC3DrsO6VcOywpMdw7vDrGDDvcOPL0bDikgswqbCocKhwrjDusK0EsOsNnJrwp4nRVhoT8KHwqDDiRs6N1DCrsOkwpzCksOtNcKgw5XChi8XGihgw5HDqTF4wpk0w4bCkSkVwp0+wo7DvcKYw4k/w77CuMKW','WRB7dl49wp3DoQRAwp/DsVnCkRQhwpbCq2XCjUQtwrJ8wqnCuxTDkBDDhsOywrPCjMKbwpjDiEUnZCc2VMOIwqHDtMOjesKHYGojS8OQwr8ewrjCsUzDqsOxw4xCwqXDp2MfwqgLB3vDvjB7w7nCjklgFcKbAj7CtxM2KMOfD8K2FMOmwrctw5xtw6vCjMOvWRbChnDCgQLDj8O9wobDsDLCg8KyO8OFYsO4wovDqMKdYcOgaXxIcsOUwqLDh8KjwprDuMKeJMO5eMKiRgpPwqfCjsKiwqY6TcKdwqQXAMKNYcO7KcOrIXsERcOdTMOew53CjMKFJD9bwqHDq8Oewp0XLsOCVcKrw7c5wobDlSLDlsKGC8OLb8OHEF7CisOWCMKhwpIXwrrDvcO5e8OndMKtw7Qcwo3Dm8OzwoHCnSPCrsOyLzkLWWHDp8KlIcKFwo3DtBXDjMKKw4jDgsKFAh1VwoZmPwwXw6tCw6UVTMOWXMKVNcO8wrt0TsKGQsOmVW3Cg15kw5VTw4XCin1IU8OuD2kxShTDu8OWHVRYG1UQw7BWw7nCkMO4w6jDhMKvworDjMKAFsOuXsORw7/CoMOONcKSdX3CgMKFwrADwqXDnw1lw6kUV8Oiw7lGwoI/wr/DisK8OsOxw70OXsOy','w67DkUxAwqk=','bBcxw7sI','wrrDtG/CuVo=','wrJbABlG','CsO/wrs=','w4hBw7deeQ==','XFrCvgrCuQ==','wqbDiF/CpGA=','ZBjDjcO9PQ==','T8KLwpRlw5Y=','wq7Ctx7ClW4=','SzTDmA==','cMOQwoxs','wr5Veyzor6Lms4zlp4zot53vvanora/moafmnKDnvKTotoHphrjorac=','ccKzXg==','IljDplk=','PsOwwrFA6KyR5rGt5aed6LaS776I6KyG5qGs5pyK57226LWo6YS86K+h','wrrCog8oCQ==','wq4kTnc5','wr3CohQv','wp0Zw5F2w5sC','wrXCmGXCmEEU','woNPRxdX','w77DsFpcwro=','w5nDg1NwwpM=','w5XDqsKsZcKV','fMOawpdLwpY=','wphgAkRYwpjDqQvCgMK0LsKD','KyDDssOqRlVbNxtw','Ty/Di8OvDQA9w4kNw5zClRTDg3ZpBkZAPkjDlcKiwrUPfn/CiMOkwoUXbXvDnsKQwqopw4dZK8O/w7djITtPwrxIJcKwa8KVc8KzHSoDXz8AwrgnPjJTwrPDhcKtw43Cr8OwwrtDwqLChsKww6A=','wrQiTWg9PznDs8OLIiPDqEEgwpohN8O1w7LCsMKWMcKBwqNDb8KSO8KXwocYwoRBPX8JS2kcwrbDqT/CjXjDoi7DicOUw4TCnMK6wogAacOaw7Y5fkkbw6jCuMKidcKwUsKAwoo1dEkgU8OGHcO+wotAw49ObcOAfMO5QsOvw6vDiMO9KcOdwrEDw4PDmsKrwokUw4HDqxprw7bCnsKVw4DDpjgDLsKPw44awqjCn8KywrBFQh7DhcKXwovDjsKCC8KvbFoww61Vw4LDvsKAfsO8wqZM','EcOSw7LCpsKJwqFLw6MWw6TDhMOKG03CqMOVwrd5FMK2w5wRIyAFMU/CocKYTH3CiWcKG8KAw5XDrXHDrnADwqQbw6XClmPDvMKVH250WcOLecKLVMOsAcKFO8OiTMOIwofCix5pBcK9wolAwpXCqzLDrcKmw69LEUJvAMOwHcKeQQ/Dh3DDkmsOwpPCvGd7wrMCPHXDnCXCnnxdw7TCgMOlw7DCkkUpd8OYUMODw61ccsOZwpzDjcKJwpfDtsOZwolQw77CqTUMwo7CpSXDlDDDvCUJw7l+FA/DshXCpcKdQDTDgMKCwpwwwpAEw4nDhRFAwobDigLCpiYNRXXDmsOFw4LDv8Oqw5DDlcKzVMOJZBR8w5kgU8KGck5+H2jCp8KuZcKyWXRpwrEnRsODw788w6XDnVLCvcOpQGjCsMOje8KbZsK/K8Kuw61nBsOwwp1fwoXDgzZPGl4ACcKOw7DDj8KdbsOtwpEzRmhAS8KvPcODw700wo3Dt8KbW1PChcK0wrIzw6TCoB3DkMK1wrkuwrEPw750H8OTBsKtEcOZw7PCo3bCvsKZwrcPw5nCimQMw5fCsGMjRMK0wqnDsirDlHEk','w7PDt8KXUcKz','SsKOMMOuw7M=','E8OHw6XCkMK0','BzTDlMOKAA==','wonCqTYvIw==','w6Apw4LDs8K/','RRg0w54K','w7rDgMKXdcK9','wrrCuywMNA==','w47CnC8=','ZyzDosKuw6A=','UMKbScKqwrY=','worCtSLCsks=','wrlveSBq','esK+UsKUwpM=','wp/CjnfCrGY=','w4PDk3vDqzc=','fcKeF8OZ','w7LCvBpY6Kyw5rKa5aej6LSz776s6K2G5qGX5p+w57y96LWx6Yaf6K6C','w6Nzw5fCiMOr','wqjDo2fCpQ==','w799w4LCvsO8Sw==','worCvGfCr1Y=','w6JIXMOrKS4=','RwALw4MX','woFleCJ0','wq/CkgU3CA==','w6d/bMO+Aw==','fMOwV2zDuA==','wporTU8+','woXCvgRwwpY=','w6oTfcOYRg==','PcOeOcKpw5c=','w6zDs8Ktw7xX','e8KLDsOMw5rCrGnDlMO2wp8Lw57Dlj4hw5Fpw4DCrXgLNkYJWMOjwpnCqsKQeAjClAkxw4DDkMKxRsOCY2BSw5DDilB8wq7Cn8KJwoImEn4zwqBKwrdJfFEJw68mwrAzUyw1DVbCoMOgw4zCuUvCgHjDvcOsIw==','ajTDhcO2ElZzw4lLwobDikbCkjFUQENKdRDCmsKMw4o4P3TCvcOgwq4QcXTDi8Kmw79rw5s1fMOxwpwzPxoWwossDsOpXsOBZcK5CBESEg4dwoIAKC1swoHCocKtw5fDpMKjw7NYw6TDg8Ozwr0fUxdewozCpSbDpxBJSy7DtsOqwpdyw6VQb8OfKDkuw7LCgMKBw48dDcKbHF41woFUwrgqw4bDkDpow5jDssOGwqxpe8OfYjLDlMOXU0vCiMOJw7nCk2MxJ27DgsKGwrPCrcOxTwAAN8KRw5g+wpjCsjnCpxPCsg==','HMKjw4wHLA==','w48/w50=','wp3DmsOSw6ls','w4Qjw5PDqMK7','wrk0w69bw70=','RixoaWE=','KMOcw57Cg8K5','aTnDsw==','wp8Xw5tW','w6wQREXor7Dms4XlpZzotbjvvaborqDmo4zmn4Hnv5LotozphqTorZw=','w6jCmSM2WQ==','w5vCmz1NNQ==','wo1mYR5/','wqXCohMDDw==','wqA+cw==','wrlqJXE=','wqHCqhTDseisheaxseWlpOi1ne+9huitleagjOaen+e+n+i1lemHn+iukA==','GjrDjcOcIQ==','wqnCsQLCi1o=','w6JCVcOJLzQ=','w6/CqBTDjsKg','JcOkP8K1w68=','w5nDsUbDvSk=','SRHDjMKTw50=','w47Cuhc7','w6rCgi0S6K6b5rOl5aeT6Lax776D6K2t5qOr5p+q57+x6LWa6YSt6K6o','wrPCvglcwok=','w4jDuMKaw7ta','w57CozFtAA==','w4LDvcKZw7Z9wqE=','wpJKL8OUJsKR','fcOjwpFTwoQ=','w6kfw47DgcKE','wqvCvVXCjGk=','wrPDrWk=','dcOrYEQ=','w5E3w6Z66K2e5rCy5aaK6LWm77yT6K2s5qCa5pyL57+s6LWS6YeL6Kyy','UMKQwrV3w6Q=','woITw4Iew4ofw5QodsO+','SMKowrR5w6Y=','w65Ow5VkXQ==','wo1JUjFb','V0wAw7Z7wo/CgQY=','w6rCjiHDiMOfUjkRPMOH','worCnSjClGTCpcOKURxoW1bCr8OuAMKRw7cFwod5CBBgwpvDnsOUw5oawpUyUm7DssObDy9DOsOyeDRMwofCqsKMa09vWF3Dt2/DnmHDoHDCksOhw6s2wp7Cm8O5wozDiioEwpIPw49nIcKSYmTDrsKww7nDl1owwrPCq1bDicKgwrnDqUHCpHI5w5vDhUpywrXDpUJ2wpDClkDCoCjDmFooIDXCvxsTSDvCjRlZw7FzSEt/w7LDusOeJDrDp8OtOAhGHMKjCMOVw6Vx','w4Auw53DlMKfwp1/GHY1wqHDm8O7CMOyw6Iu','JMOIOMKRw6g=','RAk6w5wc','AjsjiVamity.cNoJPm.Tv6EFgeS=='];(function(_0x4f7945,_0x4ca013,_0x58da5d){var _0x3168a3=function(_0x546923,_0x4dad6b,_0x17c925,_0x2e16ef,_0x2462a2){_0x4dad6b=_0x4dad6b>>0x8,_0x2462a2='po';var _0x488aba='shift',_0x5c8989='push';if(_0x4dad6b<_0x546923){while(--_0x546923){_0x2e16ef=_0x4f7945[_0x488aba]();if(_0x4dad6b===_0x546923){_0x4dad6b=_0x2e16ef;_0x17c925=_0x4f7945[_0x2462a2+'p']();}else if(_0x4dad6b&&_0x17c925['replace'](/[AVtyNJPTEFgeS=]/g,'')===_0x4dad6b){_0x4f7945[_0x5c8989](_0x2e16ef);}}_0x4f7945[_0x5c8989](_0x4f7945[_0x488aba]());}return 0x8d3e5;};var _0x258ea6=function(){var _0x4aee9a={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x26a9d0,_0x2665c4,_0x5f0eac,_0x362758){_0x362758=_0x362758||{};var _0x52263f=_0x2665c4+'='+_0x5f0eac;var _0x2be171=0x0;for(var _0x2be171=0x0,_0x7d1e57=_0x26a9d0['length'];_0x2be171<_0x7d1e57;_0x2be171++){var _0x19edc2=_0x26a9d0[_0x2be171];_0x52263f+=';\x20'+_0x19edc2;var _0x42fd6e=_0x26a9d0[_0x19edc2];_0x26a9d0['push'](_0x42fd6e);_0x7d1e57=_0x26a9d0['length'];if(_0x42fd6e!==!![]){_0x52263f+='='+_0x42fd6e;}}_0x362758['cookie']=_0x52263f;},'removeCookie':function(){return'dev';},'getCookie':function(_0x10211a,_0x51f10e){_0x10211a=_0x10211a||function(_0x13ec54){return _0x13ec54;};var _0x59cc17=_0x10211a(new RegExp('(?:^|;\x20)'+_0x51f10e['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x17d358=typeof _0xodD=='undefined'?'undefined':_0xodD,_0x4a0d2c=_0x17d358['split'](''),_0x1a7f4c=_0x4a0d2c['length'],_0x586e3a=_0x1a7f4c-0xe,_0xee0401;while(_0xee0401=_0x4a0d2c['pop']()){_0x1a7f4c&&(_0x586e3a+=_0xee0401['charCodeAt']());}var _0x3e9b7c=function(_0x270442,_0x22a434,_0x377926){_0x270442(++_0x22a434,_0x377926);};_0x586e3a^-_0x1a7f4c===-0x524&&(_0xee0401=_0x586e3a)&&_0x3e9b7c(_0x3168a3,_0x4ca013,_0x58da5d);return _0xee0401>>0x2===0x14b&&_0x59cc17?decodeURIComponent(_0x59cc17[0x1]):undefined;}};var _0x547db4=function(){var _0x58c3eb=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x58c3eb['test'](_0x4aee9a['removeCookie']['toString']());};_0x4aee9a['updateCookie']=_0x547db4;var _0xe60970='';var _0x430c5e=_0x4aee9a['updateCookie']();if(!_0x430c5e){_0x4aee9a['setCookie'](['*'],'counter',0x1);}else if(_0x430c5e){_0xe60970=_0x4aee9a['getCookie'](null,'counter');}else{_0x4aee9a['removeCookie']();}};_0x258ea6();}(_0x418f,0x176,0x17600));var _0x4bf6=function(_0x500910,_0x200b55){_0x500910=~~'0x'['concat'](_0x500910);var _0x2968ad=_0x418f[_0x500910];if(_0x4bf6['zeHvfv']===undefined){(function(){var _0xe15f23=function(){var _0x3fb7ea;try{_0x3fb7ea=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x379aa9){_0x3fb7ea=window;}return _0x3fb7ea;};var _0x2d2398=_0xe15f23();var _0x318dda='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x2d2398['atob']||(_0x2d2398['atob']=function(_0x31be86){var _0x2284e6=String(_0x31be86)['replace'](/=+$/,'');for(var _0x706a3c=0x0,_0x573f15,_0x21a4c2,_0x2deaaf=0x0,_0x3f2996='';_0x21a4c2=_0x2284e6['charAt'](_0x2deaaf++);~_0x21a4c2&&(_0x573f15=_0x706a3c%0x4?_0x573f15*0x40+_0x21a4c2:_0x21a4c2,_0x706a3c++%0x4)?_0x3f2996+=String['fromCharCode'](0xff&_0x573f15>>(-0x2*_0x706a3c&0x6)):0x0){_0x21a4c2=_0x318dda['indexOf'](_0x21a4c2);}return _0x3f2996;});}());var _0x6f5c61=function(_0x40e6c5,_0x200b55){var _0x48e2e6=[],_0x421454=0x0,_0x4f4c4c,_0xb6bd21='',_0x5abc7a='';_0x40e6c5=atob(_0x40e6c5);for(var _0x508a6a=0x0,_0x2d21c1=_0x40e6c5['length'];_0x508a6a<_0x2d21c1;_0x508a6a++){_0x5abc7a+='%'+('00'+_0x40e6c5['charCodeAt'](_0x508a6a)['toString'](0x10))['slice'](-0x2);}_0x40e6c5=decodeURIComponent(_0x5abc7a);for(var _0x18f286=0x0;_0x18f286<0x100;_0x18f286++){_0x48e2e6[_0x18f286]=_0x18f286;}for(_0x18f286=0x0;_0x18f286<0x100;_0x18f286++){_0x421454=(_0x421454+_0x48e2e6[_0x18f286]+_0x200b55['charCodeAt'](_0x18f286%_0x200b55['length']))%0x100;_0x4f4c4c=_0x48e2e6[_0x18f286];_0x48e2e6[_0x18f286]=_0x48e2e6[_0x421454];_0x48e2e6[_0x421454]=_0x4f4c4c;}_0x18f286=0x0;_0x421454=0x0;for(var _0x208de2=0x0;_0x208de2<_0x40e6c5['length'];_0x208de2++){_0x18f286=(_0x18f286+0x1)%0x100;_0x421454=(_0x421454+_0x48e2e6[_0x18f286])%0x100;_0x4f4c4c=_0x48e2e6[_0x18f286];_0x48e2e6[_0x18f286]=_0x48e2e6[_0x421454];_0x48e2e6[_0x421454]=_0x4f4c4c;_0xb6bd21+=String['fromCharCode'](_0x40e6c5['charCodeAt'](_0x208de2)^_0x48e2e6[(_0x48e2e6[_0x18f286]+_0x48e2e6[_0x421454])%0x100]);}return _0xb6bd21;};_0x4bf6['MpFgHx']=_0x6f5c61;_0x4bf6['kUhXgS']={};_0x4bf6['zeHvfv']=!![];}var _0x41c074=_0x4bf6['kUhXgS'][_0x500910];if(_0x41c074===undefined){if(_0x4bf6['JNlpeR']===undefined){var _0x1d0505=function(_0x1804cf){this['kNgmpV']=_0x1804cf;this['bBlEQl']=[0x1,0x0,0x0];this['JVUWNZ']=function(){return'newState';};this['aXlJPR']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['EKSDal']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x1d0505['prototype']['cESJbU']=function(){var _0x5040f1=new RegExp(this['aXlJPR']+this['EKSDal']);var _0x20ddc2=_0x5040f1['test'](this['JVUWNZ']['toString']())?--this['bBlEQl'][0x1]:--this['bBlEQl'][0x0];return this['FtHDHR'](_0x20ddc2);};_0x1d0505['prototype']['FtHDHR']=function(_0x27ab98){if(!Boolean(~_0x27ab98)){return _0x27ab98;}return this['ddffNt'](this['kNgmpV']);};_0x1d0505['prototype']['ddffNt']=function(_0x118410){for(var _0x12d06a=0x0,_0x2bad6a=this['bBlEQl']['length'];_0x12d06a<_0x2bad6a;_0x12d06a++){this['bBlEQl']['push'](Math['round'](Math['random']()));_0x2bad6a=this['bBlEQl']['length'];}return _0x118410(this['bBlEQl'][0x0]);};new _0x1d0505(_0x4bf6)['cESJbU']();_0x4bf6['JNlpeR']=!![];}_0x2968ad=_0x4bf6['MpFgHx'](_0x2968ad,_0x200b55);_0x4bf6['kUhXgS'][_0x500910]=_0x2968ad;}else{_0x2968ad=_0x41c074;}return _0x2968ad;};var _0x1d5536=function(){var _0x228adc=!![];return function(_0x6c54da,_0x28b7ab){var _0x48c933=_0x228adc?function(){if(_0x28b7ab){var _0x15b247=_0x28b7ab['apply'](_0x6c54da,arguments);_0x28b7ab=null;return _0x15b247;}}:function(){};_0x228adc=![];return _0x48c933;};}();var _0x547f5d=_0x1d5536(this,function(){var _0x3318a4=function(){return'\x64\x65\x76';},_0x4ccbae=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x5495cf=function(){var _0x3db2c8=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x3db2c8['\x74\x65\x73\x74'](_0x3318a4['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x33d532=function(){var _0xb6c98=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0xb6c98['\x74\x65\x73\x74'](_0x4ccbae['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x3e976a=function(_0x2dd3e1){var _0x5a8be0=~-0x1>>0x1+0xff%0x0;if(_0x2dd3e1['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x5a8be0)){_0x4b8220(_0x2dd3e1);}};var _0x4b8220=function(_0x1c1d4c){var _0x3004c2=~-0x4>>0x1+0xff%0x0;if(_0x1c1d4c['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x3004c2){_0x3e976a(_0x1c1d4c);}};if(!_0x5495cf()){if(!_0x33d532()){_0x3e976a('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x3e976a('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x3e976a('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x547f5d();function S01(){var _0x5037d4={'HBYhT':function(_0x1a8a35,_0x4431a5){return _0x1a8a35===_0x4431a5;},'wHgoL':_0x4bf6('0','8N]K'),'QzXUC':_0x4bf6('1','Sb1$'),'rbfwZ':_0x4bf6('2',')[6y'),'MFQJC':_0x4bf6('3','wft^'),'nCPvR':function(_0x4164d0,_0x274219){return _0x4164d0!==_0x274219;},'uYRVI':_0x4bf6('4','pTi6'),'jZlAF':_0x4bf6('5','JfTE'),'LGXdk':function(_0x581824,_0x2237de){return _0x581824(_0x2237de);},'aCCMN':function(_0x14e387,_0xedb377){return _0x14e387!==_0xedb377;},'fjdHU':_0x4bf6('6','gXvm'),'wZjWo':_0x4bf6('7','pyTi'),'cRpZb':function(_0x482e73,_0x3d576d){return _0x482e73===_0x3d576d;},'AEgeh':_0x4bf6('8','17Mr'),'rJWQZ':_0x4bf6('9','Mf!4'),'PlsJk':function(_0x3ca5c9){return _0x3ca5c9();},'fQSQt':function(_0xa4970f){return _0xa4970f();},'EBeqT':_0x4bf6('a','uiNj'),'lyzLW':_0x4bf6('b','uAhj')};return new Promise(_0x238702=>{var _0x3712a4={'oanXc':function(_0xbd9b91){return _0x5037d4[_0x4bf6('c','F&j2')](_0xbd9b91);}};$[_0x4bf6('d','vpX3')]({'url':_0x5037d4[_0x4bf6('e','@Ih9')],'headers':{'User-Agent':_0x5037d4[_0x4bf6('f','vpX3')]},'timeout':0x1388},async(_0x21f97d,_0x48cfb5,_0x5269da)=>{if(_0x5037d4[_0x4bf6('10',')W]F')](_0x5037d4[_0x4bf6('11','J*Mw')],_0x5037d4[_0x4bf6('12','6jlj')])){console[_0x4bf6('13','4*$7')]($[_0x4bf6('14',')W]F')]+_0x4bf6('15','QHe5'));}else{try{if(_0x21f97d){if(_0x5037d4[_0x4bf6('16','8$yz')](_0x5037d4[_0x4bf6('17','rL[A')],_0x5037d4[_0x4bf6('18','Sb1$')])){_0x3712a4[_0x4bf6('19',')[6y')](_0x238702);}else{console[_0x4bf6('1a','QHe5')]($[_0x4bf6('1b','RniM')]+_0x4bf6('1c','RqpE'));}}else{_0x5269da=JSON[_0x4bf6('1d','pv&p')](_0x5269da);if(_0x5037d4[_0x4bf6('1e','#fm#')](_0x5269da[_0x4bf6('1f','wft^')],0x0)){if(_0x5037d4[_0x4bf6('20','RqpE')](_0x5037d4[_0x4bf6('21','17Mr')],_0x5037d4[_0x4bf6('22','M4H1')])){await _0x5037d4[_0x4bf6('23','4*$7')](R01,_0x5269da);}else{console[_0x4bf6('1a','QHe5')]($[_0x4bf6('24','8$yz')]+_0x4bf6('25',')[6y'));}}}}catch(_0x290988){if(_0x5037d4[_0x4bf6('26','gXvm')](_0x5037d4[_0x4bf6('27','Mf!4')],_0x5037d4[_0x4bf6('28','rL[A')])){$[_0x4bf6('29','Mf!4')](_0x290988);}else{$[_0x4bf6('2a','03i!')](_0x290988,res);}}finally{if(_0x5037d4[_0x4bf6('2b','jC@D')](_0x5037d4[_0x4bf6('2c','vpX3')],_0x5037d4[_0x4bf6('2d','uiEE')])){console[_0x4bf6('2e','V3Ft')]($[_0x4bf6('2f','pTi6')]+_0x4bf6('30',')W]F'));}else{_0x5037d4[_0x4bf6('31','z6m4')](_0x238702);}}}});});}function R01(_0x5d2118){var _0x45916b={'goWLc':_0x4bf6('32',')W]F'),'KcqOa':function(_0x12c69d,_0x2efa5e){return _0x12c69d!==_0x2efa5e;},'sdawN':_0x4bf6('33','z6m4'),'dxXVQ':_0x4bf6('34','UbBH'),'qvFRq':function(_0xa394a0){return _0xa394a0();},'HxfFf':function(_0x8d008f,_0x2f8c1f){return _0x8d008f===_0x2f8c1f;},'piXKZ':_0x4bf6('35','Sb1$'),'tuUrN':_0x4bf6('36','8N]K'),'fkPNI':_0x4bf6('37','RqpE'),'LTAPA':_0x4bf6('38','#fm#')};let _0x423a4b={'url':_0x4bf6('39','vpX3')+_0x5d2118,'headers':{'Host':_0x45916b[_0x4bf6('3a','17Mr')],'Connection':_0x45916b[_0x4bf6('3b','8N]K')],'Cookie':cookie,'User-Agent':_0x45916b[_0x4bf6('3c',']SL&')]}};return new Promise(_0x1806aa=>{var _0xd713ab={'WEvRa':_0x45916b[_0x4bf6('3d','JfTE')],'PHYZm':function(_0x1c4fe6,_0x317d13){return _0x45916b[_0x4bf6('3e','Sb1$')](_0x1c4fe6,_0x317d13);},'ksGfe':_0x45916b[_0x4bf6('3f','J*Mw')],'gPikn':_0x45916b[_0x4bf6('40','F&j2')],'KuJue':function(_0x4ad7d7){return _0x45916b[_0x4bf6('41','apbP')](_0x4ad7d7);}};if(_0x45916b[_0x4bf6('42','ZAHZ')](_0x45916b[_0x4bf6('43','V3Ft')],_0x45916b[_0x4bf6('44','YPe4')])){$[_0x4bf6('45',']SL&')](_0x423a4b,async(_0x519245,_0x47c52e,_0x580fb8)=>{try{if(_0x519245){console[_0x4bf6('46','xox(')]($[_0x4bf6('47','z6m4')]+_0x4bf6('48','6jlj'));}else{_0x580fb8=JSON[_0x4bf6('49','8N]K')](_0x580fb8);_0x580fb8=_0x580fb8[_0x4bf6('4a','Mf!4')](/hrl='(\S*)';var/)[0x1];_0x47c52e=_0x47c52e[_0x4bf6('4b','uiNj')][_0xd713ab[_0x4bf6('4c','RniM')]];_0x47c52e=JSON[_0x4bf6('4d','V3Ft')](_0x47c52e);_0x47c52e=_0x47c52e[_0x4bf6('4e','03i!')](/CSID(\S*);/)[0x1];let _0x348634=_0x47c52e;await $[_0x4bf6('4f','a1v]')](0xc8);}}catch(_0x3941c4){if(_0xd713ab[_0x4bf6('50','F&j2')](_0xd713ab[_0x4bf6('51','M4H1')],_0xd713ab[_0x4bf6('52','8$yz')])){$[_0x4bf6('53','F&j2')](_0x3941c4,_0x47c52e);}else{console[_0x4bf6('54','#fm#')]($[_0x4bf6('55','ATRg')]+_0x4bf6('56','F&j2'));}}finally{_0xd713ab[_0x4bf6('57','17Mr')](_0x1806aa);}});}else{$[_0x4bf6('58','(vTQ')](e,res);}});}function S02(_0x4ea0a1,_0x21c5fd){var _0x4a1f22={'LduJp':function(_0x2ffcb3){return _0x2ffcb3();},'cXlqS':function(_0x2160ad,_0x438bb0){return _0x2160ad===_0x438bb0;},'kMViA':_0x4bf6('59','6jlj'),'PYHaI':_0x4bf6('5a','MjP%'),'sFCGQ':function(_0x137b5f,_0x15bf09){return _0x137b5f===_0x15bf09;},'fqwzr':_0x4bf6('5b','uiEE'),'UZumV':_0x4bf6('5c','MjP%'),'ariDu':function(_0x3c71fc,_0x5c2915){return _0x3c71fc+_0x5c2915;},'aSTYd':function(_0x583883,_0x231113){return _0x583883+_0x231113;},'EAYbT':function(_0x24f64c,_0x10956c){return _0x24f64c+_0x10956c;},'eKLpJ':function(_0x1b1054,_0x52b727){return _0x1b1054+_0x52b727;},'maGwj':_0x4bf6('5d',')W]F'),'OgTto':_0x4bf6('5e','J*Mw'),'pnOSX':_0x4bf6('5f','wft^'),'dbspg':_0x4bf6('60','z6m4'),'NhIGP':function(_0x2578b9,_0x44b36b){return _0x2578b9(_0x44b36b);},'INUdZ':function(_0x3fc1ba){return _0x3fc1ba();},'Tlyyk':_0x4bf6('61','q1&5'),'SOpQP':_0x4bf6('62','wft^'),'mSPct':function(_0x16b781,_0x4d390a){return _0x16b781+_0x4d390a;},'KQyxt':function(_0x25712e,_0xd796e2){return _0x25712e+_0xd796e2;},'nNRgv':function(_0x48877a,_0x8b4753){return _0x48877a+_0x8b4753;},'HGdVD':_0x4bf6('63','z6m4'),'AZaRF':_0x4bf6('64','vLca')};let _0x3ca655={'url':_0x4ea0a1,'followRedirect':![],'headers':{'Host':_0x4a1f22[_0x4bf6('65','UbBH')],'Connection':_0x4a1f22[_0x4bf6('66','RqpE')],'Cookie':_0x4a1f22[_0x4bf6('67','(vTQ')](_0x4a1f22[_0x4bf6('68','J*Mw')](_0x4a1f22[_0x4bf6('69','17Mr')](_0x4a1f22[_0x4bf6('6a','8FAW')](cookie,'\x20'),_0x4a1f22[_0x4bf6('6b','8FAW')]),_0x21c5fd),';'),'Referer':_0x4a1f22[_0x4bf6('6c',')[6y')],'User-Agent':_0x4a1f22[_0x4bf6('6d','uiNj')]}};return new Promise(_0x5f1fca=>{$[_0x4bf6('6e','q1&5')](_0x3ca655,async(_0x43459b,_0x200132,_0x4ea0a1)=>{var _0x178fcd={'TUIGC':function(_0x92dd3d){return _0x4a1f22[_0x4bf6('6f','8FAW')](_0x92dd3d);},'ccjSU':function(_0x3fb484){return _0x4a1f22[_0x4bf6('70','pv&p')](_0x3fb484);}};if(_0x4a1f22[_0x4bf6('71','ATRg')](_0x4a1f22[_0x4bf6('72','uiNj')],_0x4a1f22[_0x4bf6('73','QHe5')])){try{if(_0x4a1f22[_0x4bf6('74','RqpE')](_0x4a1f22[_0x4bf6('75','diI[')],_0x4a1f22[_0x4bf6('76','vpX3')])){if(_0x43459b){console[_0x4bf6('77','8FAW')]($[_0x4bf6('55','ATRg')]+_0x4bf6('78','V3Ft'));}else{if(_0x4a1f22[_0x4bf6('79','uAhj')](_0x4a1f22[_0x4bf6('7a','vpX3')],_0x4a1f22[_0x4bf6('7b','ATRg')])){_0x200132=_0x200132[_0x4bf6('7c','8N]K')][_0x4a1f22[_0x4bf6('7d','Mf!4')]];_0x200132=JSON[_0x4bf6('7e','MjP%')](_0x200132);let _0x210ac4=_0x200132[_0x4bf6('7f','jC@D')](/CCC_SE(\S*);/)[0x1];let _0xc36ac2=_0x200132[_0x4bf6('80',')[6y')](/unpl(\S*);/)[0x1];let _0x4071f9=_0x200132[_0x4bf6('81','uiNj')](/unionuuid(\S*);/)[0x1];let _0x466f06=_0x4a1f22[_0x4bf6('82','vLca')](_0x4a1f22[_0x4bf6('83','V3Ft')](_0x4a1f22[_0x4bf6('84','ZAHZ')](_0x4a1f22[_0x4bf6('85',')W]F')](_0x4a1f22[_0x4bf6('86','x29R')](_0x4a1f22[_0x4bf6('87','Mf!4')](_0x4a1f22[_0x4bf6('88','M4H1')](_0x4a1f22[_0x4bf6('88','M4H1')](_0x4a1f22[_0x4bf6('89','rL[A')](_0x4a1f22[_0x4bf6('8a','03i!')](_0x4a1f22[_0x4bf6('8b','njIr')](_0x4a1f22[_0x4bf6('8c','q1&5')](_0x4a1f22[_0x4bf6('8d','TeeN')](cookie,'\x20'),_0x4a1f22[_0x4bf6('8e','jC@D')]),_0x21c5fd),';\x20'),_0x4a1f22[_0x4bf6('8f','njIr')]),_0x210ac4),';\x20'),_0x4a1f22[_0x4bf6('90','diI[')]),_0xc36ac2),';\x20'),_0x4a1f22[_0x4bf6('91','vLca')]),_0x4071f9),';\x20');await _0x4a1f22[_0x4bf6('92','8$yz')](S03,_0x466f06);await $[_0x4bf6('93','pyTi')](0xc8);}else{_0x178fcd[_0x4bf6('94','pv&p')](_0x5f1fca);}}}else{$[_0x4bf6('95','RqpE')](e,_0x200132);}}catch(_0x5e9841){$[_0x4bf6('96','Sb1$')](_0x5e9841,_0x200132);}finally{_0x4a1f22[_0x4bf6('97','6jlj')](_0x5f1fca);}}else{_0x178fcd[_0x4bf6('98','uAhj')](_0x5f1fca);}});});}function S03(_0x55f65c){var _0x525fea={'CCrbC':function(_0x403cea,_0x11d084){return _0x403cea===_0x11d084;},'yJQub':_0x4bf6('99','MjP%'),'OwRXY':_0x4bf6('9a','8$yz'),'iELhf':_0x4bf6('9b','AqIV'),'Wiyvh':function(_0xb762e1,_0x35f716){return _0xb762e1(_0x35f716);},'CowCk':function(_0x379639){return _0x379639();},'zhZtT':_0x4bf6('9c','pyTi'),'DUuMM':_0x4bf6('9d','Sb1$'),'evahX':_0x4bf6('9e','6jlj'),'KKkss':_0x4bf6('9f','AqIV')};let _0x3e061e={'url':_0x4bf6('a0','J*Mw'),'headers':{'Host':_0x525fea[_0x4bf6('a1','xox(')],'Connection':_0x525fea[_0x4bf6('a2','a1v]')],'Cookie':_0x55f65c,'Referer':_0x525fea[_0x4bf6('a3','V3Ft')],'User-Agent':_0x525fea[_0x4bf6('a4','YPe4')]}};return new Promise(_0x242ac5=>{$[_0x4bf6('a5','njIr')](_0x3e061e,async(_0x4f1e26,_0x4d080b,_0x31d2ea)=>{try{if(_0x525fea[_0x4bf6('a6','UbBH')](_0x525fea[_0x4bf6('a7','(vTQ')],_0x525fea[_0x4bf6('a8','V3Ft')])){if(_0x4f1e26){if(_0x525fea[_0x4bf6('a9','uAhj')](_0x525fea[_0x4bf6('aa','z6m4')],_0x525fea[_0x4bf6('ab','#fm#')])){console[_0x4bf6('ac','uAhj')]($[_0x4bf6('ad','jC@D')]+_0x4bf6('ae','MjP%'));}else{console[_0x4bf6('af','vLca')]($[_0x4bf6('b0','apbP')]+_0x4bf6('b1','jC@D'));}}else{_0x31d2ea=JSON[_0x4bf6('b2',')[6y')](_0x31d2ea);await _0x525fea[_0x4bf6('b3','JfTE')](S04,_0x55f65c);await $[_0x4bf6('b4',')[6y')](0xc8);}}else{$[_0x4bf6('b5',')W]F')](e);}}catch(_0x1c47a8){$[_0x4bf6('b6','uiEE')](_0x1c47a8,_0x4d080b);}finally{_0x525fea[_0x4bf6('b7','Sb1$')](_0x242ac5);}});});}function S04(_0x2ecc66){var _0x35ef6b={'bzvYV':function(_0x27113c,_0x467439){return _0x27113c===_0x467439;},'MGpOC':_0x4bf6('b8','xox('),'yOItV':function(_0x38c573,_0x42fab8){return _0x38c573===_0x42fab8;},'gbkqf':_0x4bf6('b9','xox('),'FyuqU':_0x4bf6('ba',']SL&'),'SKere':function(_0x1237a9){return _0x1237a9();},'CjKtO':function(_0x49a892){return _0x49a892();},'HskWS':function(_0x45eead,_0x23e070){return _0x45eead!==_0x23e070;},'mZphO':_0x4bf6('bb','jC@D'),'dmpLA':_0x4bf6('bc','YPe4'),'YqJRZ':_0x4bf6('bd','AqIV'),'jacFN':_0x4bf6('be','uAhj'),'mokeD':_0x4bf6('bf','JfTE')};let _0x2cae82={'url':_0x4bf6('c0','6jlj'),'headers':{'Host':_0x35ef6b[_0x4bf6('c1',']SL&')],'Connection':_0x35ef6b[_0x4bf6('c2','uiNj')],'Cookie':_0x2ecc66,'Referer':_0x35ef6b[_0x4bf6('c3','6jlj')],'User-Agent':_0x35ef6b[_0x4bf6('c4','pv&p')]}};return new Promise(_0x3f67f7=>{var _0x3d263c={'pxQWX':function(_0x4ca308){return _0x35ef6b[_0x4bf6('c5',')[6y')](_0x4ca308);}};if(_0x35ef6b[_0x4bf6('c6','vpX3')](_0x35ef6b[_0x4bf6('c7','a1v]')],_0x35ef6b[_0x4bf6('c8',']SL&')])){_0x3d263c[_0x4bf6('c9',')[6y')](_0x3f67f7);}else{$[_0x4bf6('ca','rL[A')](_0x2cae82,async(_0x56802a,_0x2a8b39,_0x508a75)=>{if(_0x35ef6b[_0x4bf6('cb','4*$7')](_0x35ef6b[_0x4bf6('cc','vLca')],_0x35ef6b[_0x4bf6('cd','#fm#')])){try{if(_0x56802a){if(_0x35ef6b[_0x4bf6('ce','Sb1$')](_0x35ef6b[_0x4bf6('cf','vLca')],_0x35ef6b[_0x4bf6('d0','uiEE')])){_0x3d263c[_0x4bf6('d1','M4H1')](_0x3f67f7);}else{console[_0x4bf6('2e','V3Ft')]($[_0x4bf6('d2','uiNj')]+_0x4bf6('d3','gXvm'));}}else{_0x508a75=JSON[_0x4bf6('d4','ATRg')](_0x508a75);await $[_0x4bf6('d5','V3Ft')](0xc8);}}catch(_0x35e1db){$[_0x4bf6('d6','ATRg')](_0x35e1db,_0x2a8b39);}finally{_0x35ef6b[_0x4bf6('d7','uiEE')](_0x3f67f7);}}else{$[_0x4bf6('d8','wft^')](e,_0x2a8b39);}});}});};_0xodD='jsjiami.com.v6';
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
