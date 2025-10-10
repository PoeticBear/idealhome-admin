houseList.vue:274 [Vue warn]: Failed to resolve component: icon-money-circle
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement. 
  at <HouseList class="content" onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <BaseTransition mode="out-in" appear=false persisted=false  ... > 
  at <Transition name="fade" mode="out-in" > 
  at <RouterView class="content" > 
  at <Content> 
  at <LayoutContent class="layout-content" > 
  at <Layout class="layout-middle-content" > 
  at <Layout class="layout-parent" > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-TWPBI2NV.js?v=d60cadb3:2115
resolveAsset @ chunk-TWPBI2NV.js?v=d60cadb3:5050
resolveComponent @ chunk-TWPBI2NV.js?v=d60cadb3:5012
_sfc_render @ houseList.vue:274
renderComponentRoot @ chunk-TWPBI2NV.js?v=d60cadb3:8717
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7597
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
runIfDirty @ chunk-TWPBI2NV.js?v=d60cadb3:497
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
flushJobs @ chunk-TWPBI2NV.js?v=d60cadb3:2472
Promise.then
queueFlush @ chunk-TWPBI2NV.js?v=d60cadb3:2385
queueJob @ chunk-TWPBI2NV.js?v=d60cadb3:2380
effect2.scheduler @ chunk-TWPBI2NV.js?v=d60cadb3:7648
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:487
endBatch @ chunk-TWPBI2NV.js?v=d60cadb3:545
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:938
deleteProperty @ chunk-TWPBI2NV.js?v=d60cadb3:1239
(anonymous) @ houseList.vue:1140
showEdit @ houseList.vue:1140
onClick @ houseList.vue:65
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
emit @ chunk-TWPBI2NV.js?v=d60cadb3:8601
(anonymous) @ chunk-TWPBI2NV.js?v=d60cadb3:10316
handleClick @ @arco-design_web-vue.js?v=d60cadb3:3347
_ctx.href.createElementBlock.onClick._cache.<computed>._cache.<computed> @ @arco-design_web-vue.js?v=d60cadb3:3389
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
invoker @ chunk-TWPBI2NV.js?v=d60cadb3:11525
Show 25 more frames
Show less
houseList.vue:1149 [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Number with value 85, got String with value "85". 
  at <InputNumber modelValue="85" onUpdate:modelValue=fn placeholder="请输入面积"  ... > 
  at <Col class="arco-form-item-wrapper-col" style= {} span=19  ... > 
  at <Row key=1 class="arco-form-item arco-form-item-layout-vertical" wrap=true  ... > 
  at <FormItem label="面积(㎡)" field="area" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Card bordered=false class="info-section compact" > 
  at <Space direction="vertical" size="small" fill="" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Form model= {id: 753, name: '示例房源-测试用', roomNumber: 'A102', area: '85', floor: 10, …} layout="vertical" size="medium" > 
  at <BaseTransition onAfterEnter=fn<handleOpen> onAfterLeave=fn<handleClose> appear=true  ... > 
  at <Transition name="zoom-modal" appear="" onAfterEnter=fn<handleOpen>  ... > 
  at <ClientOnly> 
  at <Modal visible=true onUpdate:visible=fn title="编辑房屋信息 - 示例房源-测试用"  ... > 
  at <HouseList class="content" onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <BaseTransition mode="out-in" appear=false persisted=false  ... > 
  at <Transition name="fade" mode="out-in" > 
  at <RouterView class="content" > 
  at <Content> 
  at <LayoutContent class="layout-content" > 
  at <Layout class="layout-middle-content" > 
  at <Layout class="layout-parent" > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-TWPBI2NV.js?v=d60cadb3:2115
validateProp @ chunk-TWPBI2NV.js?v=d60cadb3:6579
validateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6551
updateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6346
updateComponentPreRender @ chunk-TWPBI2NV.js?v=d60cadb3:7661
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7583
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
updateComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7457
processComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7390
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6892
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchBlockChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7248
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7166
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7606
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
runIfDirty @ chunk-TWPBI2NV.js?v=d60cadb3:497
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
flushJobs @ chunk-TWPBI2NV.js?v=d60cadb3:2472
Promise.then
queueFlush @ chunk-TWPBI2NV.js?v=d60cadb3:2385
queueJob @ chunk-TWPBI2NV.js?v=d60cadb3:2380
effect2.scheduler @ chunk-TWPBI2NV.js?v=d60cadb3:7648
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:487
endBatch @ chunk-TWPBI2NV.js?v=d60cadb3:545
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:938
set @ chunk-TWPBI2NV.js?v=d60cadb3:1227
(anonymous) @ houseList.vue:1149
Promise.then
nextTick @ chunk-TWPBI2NV.js?v=d60cadb3:2352
showEdit @ houseList.vue:1146
onClick @ houseList.vue:65
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
emit @ chunk-TWPBI2NV.js?v=d60cadb3:8601
(anonymous) @ chunk-TWPBI2NV.js?v=d60cadb3:10316
handleClick @ @arco-design_web-vue.js?v=d60cadb3:3347
_ctx.href.createElementBlock.onClick._cache.<computed>._cache.<computed> @ @arco-design_web-vue.js?v=d60cadb3:3389
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
invoker @ chunk-TWPBI2NV.js?v=d60cadb3:11525
Show 54 more frames
Show less
houseList.vue:1149 [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected String with value "10", got Number with value 10. 
  at <Input modelValue=10 onUpdate:modelValue=fn placeholder="请输入楼层" > 
  at <Col class="arco-form-item-wrapper-col" style= {} span=19  ... > 
  at <Row key=1 class="arco-form-item arco-form-item-layout-vertical" wrap=true  ... > 
  at <FormItem label="楼层" field="floor" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Card bordered=false class="info-section compact" > 
  at <Space direction="vertical" size="small" fill="" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Form model= {id: 753, name: '示例房源-测试用', roomNumber: 'A102', area: '85', floor: 10, …} layout="vertical" size="medium" > 
  at <BaseTransition onAfterEnter=fn<handleOpen> onAfterLeave=fn<handleClose> appear=true  ... > 
  at <Transition name="zoom-modal" appear="" onAfterEnter=fn<handleOpen>  ... > 
  at <ClientOnly> 
  at <Modal visible=true onUpdate:visible=fn title="编辑房屋信息 - 示例房源-测试用"  ... > 
  at <HouseList class="content" onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <BaseTransition mode="out-in" appear=false persisted=false  ... > 
  at <Transition name="fade" mode="out-in" > 
  at <RouterView class="content" > 
  at <Content> 
  at <LayoutContent class="layout-content" > 
  at <Layout class="layout-middle-content" > 
  at <Layout class="layout-parent" > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-TWPBI2NV.js?v=d60cadb3:2115
validateProp @ chunk-TWPBI2NV.js?v=d60cadb3:6579
validateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6551
updateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6346
updateComponentPreRender @ chunk-TWPBI2NV.js?v=d60cadb3:7661
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7583
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
updateComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7457
processComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7390
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6892
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchBlockChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7248
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7166
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7606
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
runIfDirty @ chunk-TWPBI2NV.js?v=d60cadb3:497
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
flushJobs @ chunk-TWPBI2NV.js?v=d60cadb3:2472
Promise.then
queueFlush @ chunk-TWPBI2NV.js?v=d60cadb3:2385
queueJob @ chunk-TWPBI2NV.js?v=d60cadb3:2380
effect2.scheduler @ chunk-TWPBI2NV.js?v=d60cadb3:7648
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:487
endBatch @ chunk-TWPBI2NV.js?v=d60cadb3:545
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:938
set @ chunk-TWPBI2NV.js?v=d60cadb3:1227
(anonymous) @ houseList.vue:1149
Promise.then
nextTick @ chunk-TWPBI2NV.js?v=d60cadb3:2352
showEdit @ houseList.vue:1146
onClick @ houseList.vue:65
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
emit @ chunk-TWPBI2NV.js?v=d60cadb3:8601
(anonymous) @ chunk-TWPBI2NV.js?v=d60cadb3:10316
handleClick @ @arco-design_web-vue.js?v=d60cadb3:3347
_ctx.href.createElementBlock.onClick._cache.<computed>._cache.<computed> @ @arco-design_web-vue.js?v=d60cadb3:3389
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
invoker @ chunk-TWPBI2NV.js?v=d60cadb3:11525
Show 54 more frames
Show less
houseList.vue:1149 [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Number with value 3500, got String with value "3500.00000000". 
  at <InputNumber modelValue="3500.00000000" onUpdate:modelValue=fn placeholder="请输入实际租金"  ... > 
  at <Col class="arco-form-item-wrapper-col" style= {} span=19  ... > 
  at <Row key=1 class="arco-form-item arco-form-item-layout-vertical" wrap=true  ... > 
  at <FormItem label="实际租金(元/月)" field="price" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Card bordered=false class="info-section compact" > 
  at <Space direction="vertical" size="small" fill="" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Form model= {id: 753, name: '示例房源-测试用', roomNumber: 'A102', area: '85', floor: 10, …} layout="vertical" size="medium" > 
  at <BaseTransition onAfterEnter=fn<handleOpen> onAfterLeave=fn<handleClose> appear=true  ... > 
  at <Transition name="zoom-modal" appear="" onAfterEnter=fn<handleOpen>  ... > 
  at <ClientOnly> 
  at <Modal visible=true onUpdate:visible=fn title="编辑房屋信息 - 示例房源-测试用"  ... > 
  at <HouseList class="content" onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <BaseTransition mode="out-in" appear=false persisted=false  ... > 
  at <Transition name="fade" mode="out-in" > 
  at <RouterView class="content" > 
  at <Content> 
  at <LayoutContent class="layout-content" > 
  at <Layout class="layout-middle-content" > 
  at <Layout class="layout-parent" > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-TWPBI2NV.js?v=d60cadb3:2115
validateProp @ chunk-TWPBI2NV.js?v=d60cadb3:6579
validateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6551
updateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6346
updateComponentPreRender @ chunk-TWPBI2NV.js?v=d60cadb3:7661
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7583
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
updateComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7457
processComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7390
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6892
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchBlockChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7248
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7166
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7606
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
runIfDirty @ chunk-TWPBI2NV.js?v=d60cadb3:497
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
flushJobs @ chunk-TWPBI2NV.js?v=d60cadb3:2472
Promise.then
queueFlush @ chunk-TWPBI2NV.js?v=d60cadb3:2385
queueJob @ chunk-TWPBI2NV.js?v=d60cadb3:2380
effect2.scheduler @ chunk-TWPBI2NV.js?v=d60cadb3:7648
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:487
endBatch @ chunk-TWPBI2NV.js?v=d60cadb3:545
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:938
set @ chunk-TWPBI2NV.js?v=d60cadb3:1227
(anonymous) @ houseList.vue:1149
Promise.then
nextTick @ chunk-TWPBI2NV.js?v=d60cadb3:2352
showEdit @ houseList.vue:1146
onClick @ houseList.vue:65
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
emit @ chunk-TWPBI2NV.js?v=d60cadb3:8601
(anonymous) @ chunk-TWPBI2NV.js?v=d60cadb3:10316
handleClick @ @arco-design_web-vue.js?v=d60cadb3:3347
_ctx.href.createElementBlock.onClick._cache.<computed>._cache.<computed> @ @arco-design_web-vue.js?v=d60cadb3:3389
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
invoker @ chunk-TWPBI2NV.js?v=d60cadb3:11525
Show 54 more frames
Show less
houseList.vue:1149 [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Number with value 3800, got String with value "3800.00000000". 
  at <InputNumber modelValue="3800.00000000" onUpdate:modelValue=fn placeholder="请输入对外租金"  ... > 
  at <Col class="arco-form-item-wrapper-col" style= {} span=19  ... > 
  at <Row key=1 class="arco-form-item arco-form-item-layout-vertical" wrap=true  ... > 
  at <FormItem label="对外租金(元/月)" field="fakePrice" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Card bordered=false class="info-section compact" > 
  at <Space direction="vertical" size="small" fill="" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Form model= {id: 753, name: '示例房源-测试用', roomNumber: 'A102', area: '85', floor: 10, …} layout="vertical" size="medium" > 
  at <BaseTransition onAfterEnter=fn<handleOpen> onAfterLeave=fn<handleClose> appear=true  ... > 
  at <Transition name="zoom-modal" appear="" onAfterEnter=fn<handleOpen>  ... > 
  at <ClientOnly> 
  at <Modal visible=true onUpdate:visible=fn title="编辑房屋信息 - 示例房源-测试用"  ... > 
  at <HouseList class="content" onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <BaseTransition mode="out-in" appear=false persisted=false  ... > 
  at <Transition name="fade" mode="out-in" > 
  at <RouterView class="content" > 
  at <Content> 
  at <LayoutContent class="layout-content" > 
  at <Layout class="layout-middle-content" > 
  at <Layout class="layout-parent" > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-TWPBI2NV.js?v=d60cadb3:2115
validateProp @ chunk-TWPBI2NV.js?v=d60cadb3:6579
validateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6551
updateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6346
updateComponentPreRender @ chunk-TWPBI2NV.js?v=d60cadb3:7661
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7583
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
updateComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7457
processComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7390
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6892
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchBlockChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7248
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7166
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7606
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
runIfDirty @ chunk-TWPBI2NV.js?v=d60cadb3:497
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
flushJobs @ chunk-TWPBI2NV.js?v=d60cadb3:2472
Promise.then
queueFlush @ chunk-TWPBI2NV.js?v=d60cadb3:2385
queueJob @ chunk-TWPBI2NV.js?v=d60cadb3:2380
effect2.scheduler @ chunk-TWPBI2NV.js?v=d60cadb3:7648
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:487
endBatch @ chunk-TWPBI2NV.js?v=d60cadb3:545
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:938
set @ chunk-TWPBI2NV.js?v=d60cadb3:1227
(anonymous) @ houseList.vue:1149
Promise.then
nextTick @ chunk-TWPBI2NV.js?v=d60cadb3:2352
showEdit @ houseList.vue:1146
onClick @ houseList.vue:65
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
emit @ chunk-TWPBI2NV.js?v=d60cadb3:8601
(anonymous) @ chunk-TWPBI2NV.js?v=d60cadb3:10316
handleClick @ @arco-design_web-vue.js?v=d60cadb3:3347
_ctx.href.createElementBlock.onClick._cache.<computed>._cache.<computed> @ @arco-design_web-vue.js?v=d60cadb3:3389
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
invoker @ chunk-TWPBI2NV.js?v=d60cadb3:11525
Show 54 more frames
Show less
houseList.vue:1149 [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Number with value 50, got String with value "50.00000000". 
  at <InputNumber modelValue="50.00000000" onUpdate:modelValue=fn placeholder="请输入水费"  ... > 
  at <Col class="arco-form-item-wrapper-col" style= {} span=19  ... > 
  at <Row key=1 class="arco-form-item arco-form-item-layout-vertical" wrap=true  ... > 
  at <FormItem label="水费(元)" field="waterFee" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Card bordered=false class="info-section compact" > 
  at <Space direction="vertical" size="small" fill="" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Form model= {id: 753, name: '示例房源-测试用', roomNumber: 'A102', area: '85', floor: 10, …} layout="vertical" size="medium" > 
  at <BaseTransition onAfterEnter=fn<handleOpen> onAfterLeave=fn<handleClose> appear=true  ... > 
  at <Transition name="zoom-modal" appear="" onAfterEnter=fn<handleOpen>  ... > 
  at <ClientOnly> 
  at <Modal visible=true onUpdate:visible=fn title="编辑房屋信息 - 示例房源-测试用"  ... > 
  at <HouseList class="content" onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <BaseTransition mode="out-in" appear=false persisted=false  ... > 
  at <Transition name="fade" mode="out-in" > 
  at <RouterView class="content" > 
  at <Content> 
  at <LayoutContent class="layout-content" > 
  at <Layout class="layout-middle-content" > 
  at <Layout class="layout-parent" > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-TWPBI2NV.js?v=d60cadb3:2115
validateProp @ chunk-TWPBI2NV.js?v=d60cadb3:6579
validateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6551
updateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6346
updateComponentPreRender @ chunk-TWPBI2NV.js?v=d60cadb3:7661
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7583
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
updateComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7457
processComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7390
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6892
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchBlockChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7248
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7166
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7606
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
runIfDirty @ chunk-TWPBI2NV.js?v=d60cadb3:497
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
flushJobs @ chunk-TWPBI2NV.js?v=d60cadb3:2472
Promise.then
queueFlush @ chunk-TWPBI2NV.js?v=d60cadb3:2385
queueJob @ chunk-TWPBI2NV.js?v=d60cadb3:2380
effect2.scheduler @ chunk-TWPBI2NV.js?v=d60cadb3:7648
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:487
endBatch @ chunk-TWPBI2NV.js?v=d60cadb3:545
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:938
set @ chunk-TWPBI2NV.js?v=d60cadb3:1227
(anonymous) @ houseList.vue:1149
Promise.then
nextTick @ chunk-TWPBI2NV.js?v=d60cadb3:2352
showEdit @ houseList.vue:1146
onClick @ houseList.vue:65
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
emit @ chunk-TWPBI2NV.js?v=d60cadb3:8601
(anonymous) @ chunk-TWPBI2NV.js?v=d60cadb3:10316
handleClick @ @arco-design_web-vue.js?v=d60cadb3:3347
_ctx.href.createElementBlock.onClick._cache.<computed>._cache.<computed> @ @arco-design_web-vue.js?v=d60cadb3:3389
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
invoker @ chunk-TWPBI2NV.js?v=d60cadb3:11525
Show 54 more frames
Show less
houseList.vue:1149 [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Number with value 0.8, got String with value "0.80000000". 
  at <InputNumber modelValue="0.80000000" onUpdate:modelValue=fn placeholder="请输入电费"  ... > 
  at <Col class="arco-form-item-wrapper-col" style= {} span=19  ... > 
  at <Row key=1 class="arco-form-item arco-form-item-layout-vertical" wrap=true  ... > 
  at <FormItem label="电费(元)" field="electricityFee" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Card bordered=false class="info-section compact" > 
  at <Space direction="vertical" size="small" fill="" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Form model= {id: 753, name: '示例房源-测试用', roomNumber: 'A102', area: '85', floor: 10, …} layout="vertical" size="medium" > 
  at <BaseTransition onAfterEnter=fn<handleOpen> onAfterLeave=fn<handleClose> appear=true  ... > 
  at <Transition name="zoom-modal" appear="" onAfterEnter=fn<handleOpen>  ... > 
  at <ClientOnly> 
  at <Modal visible=true onUpdate:visible=fn title="编辑房屋信息 - 示例房源-测试用"  ... > 
  at <HouseList class="content" onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <BaseTransition mode="out-in" appear=false persisted=false  ... > 
  at <Transition name="fade" mode="out-in" > 
  at <RouterView class="content" > 
  at <Content> 
  at <LayoutContent class="layout-content" > 
  at <Layout class="layout-middle-content" > 
  at <Layout class="layout-parent" > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-TWPBI2NV.js?v=d60cadb3:2115
validateProp @ chunk-TWPBI2NV.js?v=d60cadb3:6579
validateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6551
updateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6346
updateComponentPreRender @ chunk-TWPBI2NV.js?v=d60cadb3:7661
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7583
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
updateComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7457
processComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7390
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6892
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchBlockChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7248
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7166
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7606
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
runIfDirty @ chunk-TWPBI2NV.js?v=d60cadb3:497
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
flushJobs @ chunk-TWPBI2NV.js?v=d60cadb3:2472
Promise.then
queueFlush @ chunk-TWPBI2NV.js?v=d60cadb3:2385
queueJob @ chunk-TWPBI2NV.js?v=d60cadb3:2380
effect2.scheduler @ chunk-TWPBI2NV.js?v=d60cadb3:7648
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:487
endBatch @ chunk-TWPBI2NV.js?v=d60cadb3:545
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:938
set @ chunk-TWPBI2NV.js?v=d60cadb3:1227
(anonymous) @ houseList.vue:1149
Promise.then
nextTick @ chunk-TWPBI2NV.js?v=d60cadb3:2352
showEdit @ houseList.vue:1146
onClick @ houseList.vue:65
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
emit @ chunk-TWPBI2NV.js?v=d60cadb3:8601
(anonymous) @ chunk-TWPBI2NV.js?v=d60cadb3:10316
handleClick @ @arco-design_web-vue.js?v=d60cadb3:3347
_ctx.href.createElementBlock.onClick._cache.<computed>._cache.<computed> @ @arco-design_web-vue.js?v=d60cadb3:3389
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
invoker @ chunk-TWPBI2NV.js?v=d60cadb3:11525
Show 54 more frames
Show less
houseList.vue:1149 [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Number with value 100, got String with value "100.00000000". 
  at <InputNumber modelValue="100.00000000" onUpdate:modelValue=fn placeholder="请输入网费"  ... > 
  at <Col class="arco-form-item-wrapper-col" style= {} span=19  ... > 
  at <Row key=1 class="arco-form-item arco-form-item-layout-vertical" wrap=true  ... > 
  at <FormItem label="网费(元)" field="internetFee" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Card bordered=false class="info-section compact" > 
  at <Space direction="vertical" size="small" fill="" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Form model= {id: 753, name: '示例房源-测试用', roomNumber: 'A102', area: '85', floor: 10, …} layout="vertical" size="medium" > 
  at <BaseTransition onAfterEnter=fn<handleOpen> onAfterLeave=fn<handleClose> appear=true  ... > 
  at <Transition name="zoom-modal" appear="" onAfterEnter=fn<handleOpen>  ... > 
  at <ClientOnly> 
  at <Modal visible=true onUpdate:visible=fn title="编辑房屋信息 - 示例房源-测试用"  ... > 
  at <HouseList class="content" onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <BaseTransition mode="out-in" appear=false persisted=false  ... > 
  at <Transition name="fade" mode="out-in" > 
  at <RouterView class="content" > 
  at <Content> 
  at <LayoutContent class="layout-content" > 
  at <Layout class="layout-middle-content" > 
  at <Layout class="layout-parent" > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-TWPBI2NV.js?v=d60cadb3:2115
validateProp @ chunk-TWPBI2NV.js?v=d60cadb3:6579
validateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6551
updateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6346
updateComponentPreRender @ chunk-TWPBI2NV.js?v=d60cadb3:7661
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7583
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
updateComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7457
processComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7390
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6892
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchBlockChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7248
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7166
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7606
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
runIfDirty @ chunk-TWPBI2NV.js?v=d60cadb3:497
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
flushJobs @ chunk-TWPBI2NV.js?v=d60cadb3:2472
Promise.then
queueFlush @ chunk-TWPBI2NV.js?v=d60cadb3:2385
queueJob @ chunk-TWPBI2NV.js?v=d60cadb3:2380
effect2.scheduler @ chunk-TWPBI2NV.js?v=d60cadb3:7648
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:487
endBatch @ chunk-TWPBI2NV.js?v=d60cadb3:545
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:938
set @ chunk-TWPBI2NV.js?v=d60cadb3:1227
(anonymous) @ houseList.vue:1149
Promise.then
nextTick @ chunk-TWPBI2NV.js?v=d60cadb3:2352
showEdit @ houseList.vue:1146
onClick @ houseList.vue:65
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
emit @ chunk-TWPBI2NV.js?v=d60cadb3:8601
(anonymous) @ chunk-TWPBI2NV.js?v=d60cadb3:10316
handleClick @ @arco-design_web-vue.js?v=d60cadb3:3347
_ctx.href.createElementBlock.onClick._cache.<computed>._cache.<computed> @ @arco-design_web-vue.js?v=d60cadb3:3389
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
invoker @ chunk-TWPBI2NV.js?v=d60cadb3:11525
Show 54 more frames
Show less
houseList.vue:1149 [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Number with value 0, got String with value "0.00000000". 
  at <InputNumber modelValue="0.00000000" onUpdate:modelValue=fn placeholder="请输入燃气费"  ... > 
  at <Col class="arco-form-item-wrapper-col" style= {} span=19  ... > 
  at <Row key=1 class="arco-form-item arco-form-item-layout-vertical" wrap=true  ... > 
  at <FormItem label="燃气费(元)" field="fuelFee" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Card bordered=false class="info-section compact" > 
  at <Space direction="vertical" size="small" fill="" > 
  at <Col span=12 > 
  at <Row gutter=16 > 
  at <Form model= {id: 753, name: '示例房源-测试用', roomNumber: 'A102', area: '85', floor: 10, …} layout="vertical" size="medium" > 
  at <BaseTransition onAfterEnter=fn<handleOpen> onAfterLeave=fn<handleClose> appear=true  ... > 
  at <Transition name="zoom-modal" appear="" onAfterEnter=fn<handleOpen>  ... > 
  at <ClientOnly> 
  at <Modal visible=true onUpdate:visible=fn title="编辑房屋信息 - 示例房源-测试用"  ... > 
  at <HouseList class="content" onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <BaseTransition mode="out-in" appear=false persisted=false  ... > 
  at <Transition name="fade" mode="out-in" > 
  at <RouterView class="content" > 
  at <Content> 
  at <LayoutContent class="layout-content" > 
  at <Layout class="layout-middle-content" > 
  at <Layout class="layout-parent" > 
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-TWPBI2NV.js?v=d60cadb3:2115
validateProp @ chunk-TWPBI2NV.js?v=d60cadb3:6579
validateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6551
updateProps @ chunk-TWPBI2NV.js?v=d60cadb3:6346
updateComponentPreRender @ chunk-TWPBI2NV.js?v=d60cadb3:7661
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7583
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
updateComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7457
processComponent @ chunk-TWPBI2NV.js?v=d60cadb3:7390
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6892
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7179
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
patchKeyedChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7797
patchChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7711
processFragment @ chunk-TWPBI2NV.js?v=d60cadb3:7353
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6866
patchBlockChildren @ chunk-TWPBI2NV.js?v=d60cadb3:7248
patchElement @ chunk-TWPBI2NV.js?v=d60cadb3:7166
processElement @ chunk-TWPBI2NV.js?v=d60cadb3:7025
patch @ chunk-TWPBI2NV.js?v=d60cadb3:6880
componentUpdateFn @ chunk-TWPBI2NV.js?v=d60cadb3:7606
run @ chunk-TWPBI2NV.js?v=d60cadb3:459
runIfDirty @ chunk-TWPBI2NV.js?v=d60cadb3:497
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
flushJobs @ chunk-TWPBI2NV.js?v=d60cadb3:2472
Promise.then
queueFlush @ chunk-TWPBI2NV.js?v=d60cadb3:2385
queueJob @ chunk-TWPBI2NV.js?v=d60cadb3:2380
effect2.scheduler @ chunk-TWPBI2NV.js?v=d60cadb3:7648
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:487
endBatch @ chunk-TWPBI2NV.js?v=d60cadb3:545
trigger @ chunk-TWPBI2NV.js?v=d60cadb3:938
set @ chunk-TWPBI2NV.js?v=d60cadb3:1227
(anonymous) @ houseList.vue:1149
Promise.then
nextTick @ chunk-TWPBI2NV.js?v=d60cadb3:2352
showEdit @ houseList.vue:1146
onClick @ houseList.vue:65
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
emit @ chunk-TWPBI2NV.js?v=d60cadb3:8601
(anonymous) @ chunk-TWPBI2NV.js?v=d60cadb3:10316
handleClick @ @arco-design_web-vue.js?v=d60cadb3:3347
_ctx.href.createElementBlock.onClick._cache.<computed>._cache.<computed> @ @arco-design_web-vue.js?v=d60cadb3:3389
callWithErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2263
callWithAsyncErrorHandling @ chunk-TWPBI2NV.js?v=d60cadb3:2270
invoker @ chunk-TWPBI2NV.js?v=d60cadb3:11525
Show 54 more frames
Show less