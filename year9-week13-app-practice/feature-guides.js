"use strict";

const featureGuides = {
  cafe: [
    words("Open the café. Tap Start shift, then tap Table 1 to seat Aisha.", "开始营业。点 Start shift，再点 1 号桌让 Aisha 入座。"),
    words("Take the order. Tap Table 1 again and read its order ticket.", "点单。再点一次 1 号桌，读订单。"),
    words("Cook the matching dish. Tap Nasi lemak. The stove shows steam while it cooks.", "烹饪对应餐点。点 Nasi lemak（椰浆饭），烹饪时炉台冒蒸汽。"),
    words("Serve and clear. Tap Serve dish and look for +1. Wait for Clear table, then clear it for the next guest.", "上菜并清桌。点 Serve dish，观察 +1。出现 Clear table 后清桌。"),
  ],
  menu: [
    words("Build a basket. Add Nasi lemak, then open Dessert and add a Chocolate waffle.", "添加餐点。先加 Nasi lemak（椰浆饭），再打开 Dessert，加 Chocolate waffle（巧克力华夫饼）。"),
    words("Open View basket. Use + or − to change one quantity and watch the total update.", "打开 View basket。用 + 或 − 修改数量，观察总价更新。"),
    words("Compare Pickup and Delivery with the same items. Delivery adds RM 3.00.", "保持餐点相同，比较 Pickup（自取）和 Delivery（配送）。配送多收 RM 3.00。"),
    words("Tap Place practice order. Watch the tracker change as the sample order progresses.", "点 Place practice order。观察模拟订单的进度变化。"),
  ],
  merge: [
    words("Find the two 2s. Start with a fresh board and look for the matching tiles.", "找出两个 2。用新棋盘开始，找出相同的方块。"),
    words("Move left. Swipe or press ←. Both 2s become one 4 and the score increases by 4.", "向左移动。向左滑动或按 ←，两个 2 合成一个 4，得分增加 4。"),
    words("Tap New game. Check the score returns to zero. Try a new run to reach 256.", "点 New game，检查分数归零。再试一局，挑战 256。"),
  ],
  vault: [
    words("Tap Start run. In the Relay Room, try the top door before clearing the robots.", "点 Start run。在继电器房还没清除机器人时先试上方的门。"),
    words("Hold Pulse to aim. Use the arrows to move, crates for cover and Dodge to get past incoming shots.", "按住 Pulse 自动瞄准。用方向键移动、利用箱子掩护，并用 Dodge 闪避飞弹。"),
    words("Clear every robot. Walk through the glowing door and repeat until you reach the Core Keeper.", "清除所有机器人。走进发光的门，继续前进，直到遇到核心守卫。"),
    words("Finish the run. Defeat the Core Keeper and walk through the extraction gate to see Vault cleared.", "完成挑战。击败核心守卫，穿过撤离门，查看 Vault cleared。"),
  ],
  voxel: [
    words("Collect the teal keycard. Turn left, walk close and aim until the ring lights up. Tap Interact.", "收集蓝绿色钥匙卡。向左转并走近，对准直到圆环亮起，再点 Interact。"),
    words("Unlock the star door. Aim at the star door and tap Interact, then walk through it.", "解锁星星门。对准星星门再点 Interact，然后走进去。"),
    words("Use the gold switch. Aim at the switch in the exit chamber and tap Interact. Watch the winning animation.", "使用金色开关。对准出口房间的开关，点 Interact，观察胜利动画。"),
  ],
  library: [
    words("Find the controls. Spinner holds the choice, the button runs the check, and ResponseLabel shows the result.", "找到组件。Spinner 保存选项，按钮执行判断，ResponseLabel 显示结果。"),
    words("Test Read. Select Read, tap Show location and check for Fiction shelves.", "测试 Read。选 Read，点 Show location，检查是否显示 Fiction shelves。"),
    words("Test Study. Select Study and tap the same button. Check for Quiet study tables.", "测试 Study。选 Study 并点同一个按钮，检查是否显示 Quiet study tables。"),
  ],
  replay: [
    words("Finish Circuit Vault. Reach Vault cleared before trying your restart button.", "完成电路密室。在测试重启按钮前先到达 Vault cleared。"),
    words("Tap your MIT button. Its Click block calls VaultView.GoHome to reload the game. The demo shows the game’s own Play again button returning to the same starting screen.", "点击你在 MIT 添加的按钮。它的 Click 积木调用 VaultView.GoHome 重新加载游戏。演示中游戏自带的 Play again 会回到相同的起点。"),
  ],
};
