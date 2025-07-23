/*  toggle-embed 事件的作用：（toggle:切换 embed:嵌入）
 - 当传递 `true` 时，表示切换到嵌入式模式，显示简化的编辑界面。
 - 当传递 `false` 时，表示切换到完整编辑模式，显示完整的编辑界面。
 该事件用于控制界面是否以嵌入式方式显示，通常在页面切换至全屏或退出全屏时触发。 */



//该文件以弃用 留着它做个念想
import { AddonChild } from "@cqupt-hub/addon";

let addon = new AddonChild({ timeout: 10000, super_course_id: route.params.id })
function InitMessage(bus) {
  addon.addEventListener("init", ({ source, e, data }) => {
    addon.super_course_id = data.data.super_course_id
    addon.platform = data.data.platform || "reader"
    addon.succeed(source, { source_event: data.event, source_event_id: data.event_id })

    addon.request('data-get').then(e => {
      bus.emit("toggle-embed", true)
    })
  })
  addon.addEventListener("fullscreen", ({ source, data, e }) => {
    bus.emit("toggle-embed", false)
    addon.succeed(source, { source_event: data.event, source_event_id: data.event_id })
  })
  addon.addEventListener("exit-fullscreen", ({ source, data, e }) => {
    bus.emit("toggle-embed", true)
    addon.succeed(source, { source_event: data.event, source_event_id: data.event_id })
  })
  addon.startListen()
}
export { addon, InitMessage }