# 每3天的23:50分清理一次日志
50 23 */1 * * rm -rf /scripts/logs/*.log

##############短期活动##############
#极速版红包
40 0,8 * * * node /scripts/jd_speed_redpocke.js >> /scripts/logs/jd_speed_redpocke.log 2>&1
#jd_jintie
10 0 * * * node /scripts/jd_jintie.js >> /scripts/logs/jd_jintie.log 2>&1
#京喜牧场
20 0-23/3 * * * node /scripts/jd_jxmc.js >> /scripts/logs/jd_jxmc.log 2>&1
#食力街跑酷达人
10 11 * * * node /scripts/jd_paoku.js >> /scripts/logs/jd_paoku.log 2>&1
#pk
33 10,14,18 * * * node /scripts/jd_ddopk.js >> /scripts/logs/jd_ddopk.log 2>&1
#汪汪乐园
30 */4 * * * node /scripts/jd_joy_park.js >> /scripts/logs/jd_joy_park.log 2>&1
#汪汪乐园
30 2,5,20 * * * node /scripts/jd_joy_park_task.js >> /scripts/logs/jd_joy_park_task.log 2>&1
#新签到
10 0,18 * * * node /scripts/jd_NewSign.js >> /scripts/logs/jd_NewSign.log 2>&1
# 翻翻乐(7.15-8.15)
20 * * * * node /scripts/jd_flipcards.js >> /scripts/logs/jd_flipcards.log 2>&1
# 摇钱树助力
0-59/30 * * * * node /scripts/jd_moneyTree_help.js >> /scripts/logs/jd_moneyTree_help.log 2>&1

##############长期活动##############
# 签到
0 0,18 * * * cd /scripts && node jd_bean_sign.js >> /scripts/logs/jd_bean_sign.log 2>&1
# 东东农场
5 6-23/4 * * * node /scripts/jd_fruit.js >> /scripts/logs/jd_fruit.log 2>&1
# 摇钱树
0 */3 * * * node /scripts/jd_moneyTree.js >> /scripts/logs/jd_moneyTree.log 2>&1
# 东东萌宠
5 6-23/4 * * * node /scripts/jd_pet.js >> /scripts/logs/jd_pet.log 2>&1
# 京东种豆得豆
0  */6 * * * node /scripts/jd_plantBean.js >> /scripts/logs/jd_plantBean.log 2>&1
# 进店领豆
10 0 * * * node /scripts/jd_shop.js >> /scripts/logs/jd_shop.log 2>&1
# 京东天天加速
8 */3 * * * node /scripts/jd_speed.js >> /scripts/logs/jd_speed.log 2>&1
# 取关京东店铺商品
55 23 * * * node /scripts/jd_unsubscribe.js >> /scripts/logs/jd_unsubscribe.log 2>&1
# 东东小窝
16 6,23 * * * node /scripts/jd_small_home.js >> /scripts/logs/jd_small_home.log 2>&1
# 微信小程序京东赚赚
30 0,1 * * * node /scripts/jd_jdzz.js >> /scripts/logs/jd_jdzz.log 2>&1
# 京喜财富岛
10 * * * *  node /scripts/jd_cfd.js >> /scripts/logs/jd_cfd.log 2>&1
# 京东极速版
48 0,12,18 * * *  node /scripts/jd_speed_sign.js >> /scripts/logs/jd_speed_sign.log 2>&1
# 保价
0 12 */3 * * node /scripts/jd_priceProtect.js >> /scripts/logs/jd_priceProtect.log 2>&1
# 宠汪汪
#45 */2 * * * node /scripts/jd_joy.js >> /scripts/logs/jd_joy.log 2>&1
# 宠汪汪偷狗粮
#10 0-21/3 * * * node /scripts/jd_joy_steal.js >> /scripts/logs/jd_joy_steal.log 2>&1
# 宠汪汪兑换
#0 0,8,12,16 * * * node /scripts/jd_joy_reward.js >> /scripts/logs/jd_joy_reward.log 2>&1
# 签到领现金
27 7,15,23 * * * node /scripts/jd_cash.js >> /scripts/logs/jd_cash.log 2>&1
