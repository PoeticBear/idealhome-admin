15:07:37.492 
src/components/utility/PaymentModal.vue(432,58): error TS2339: Property 'water' does not exist on type 'unknown'.
15:07:37.492 
src/components/utility/PaymentModal.vue(432,88): error TS2339: Property 'electricity' does not exist on type 'unknown'.
15:07:37.492 
src/router/index.ts(139,3): error TS2322: Type '({ path: string; name: string; redirect: string; meta: { hideInMenu: boolean; icon?: undefined; title?: undefined; }; component?: undefined; children?: undefined; } | { path: string; name: string; component: () => Promise<...>; meta: { ...; }; redirect?: undefined; children?: undefined; } | { ...; } | { ...; } | { ....' is not assignable to type 'readonly RouteRecordRaw[]'.
15:07:37.492 
  Type '{ path: string; name: string; redirect: string; meta: { hideInMenu: boolean; icon?: undefined; title?: undefined; }; component?: undefined; children?: undefined; } | { path: string; name: string; component: () => Promise<...>; meta: { ...; }; redirect?: undefined; children?: undefined; } | { ...; } | { ...; } | { .....' is not assignable to type 'RouteRecordRaw'.
15:07:37.492 
    Type '{ path: string; name: string; redirect: string; meta: { hideInMenu: boolean; icon?: undefined; title?: undefined; }; component?: undefined; children?: undefined; }' is not assignable to type 'RouteRecordRaw'.
15:07:37.492 
      Type '{ path: string; name: string; redirect: string; meta: { hideInMenu: boolean; icon?: undefined; title?: undefined; }; component?: undefined; children?: undefined; }' is not assignable to type 'RouteRecordRedirect'.
15:07:37.492 
        Types of property 'component' are incompatible.
15:07:37.492 
          Type 'undefined' is not assignable to type 'never'.
15:07:37.493 
src/views/house/composables/useHouseList.ts(114,23): error TS2345: Argument of type 'string | number' is not assignable to parameter of type 'string | MessageConfig'.
15:07:37.493 
  Type 'number' is not assignable to type 'string | MessageConfig'.
15:07:37.493 
src/views/house/composables/useHouseList.ts(194,23): error TS2345: Argument of type 'string | number' is not assignable to parameter of type 'string | MessageConfig'.
15:07:37.493 
src/views/house/composables/useHouseList.ts(233,23): error TS2345: Argument of type 'string | number' is not assignable to parameter of type 'string | MessageConfig'.
15:07:37.493 
src/views/house/composables/useLocationData.ts(33,23): error TS2345: Argument of type 'string | number' is not assignable to parameter of type 'string | MessageConfig'.
15:07:37.493 
src/views/house/composables/useTenantManagement.ts(141,23): error TS2345: Argument of type 'string | number' is not assignable to parameter of type 'string | MessageConfig'.
15:07:37.493 
src/views/house/composables/useTenantManagement.ts(227,11): error TS2322: Type 'string | number' is not assignable to type 'RenderContent'.
15:07:37.493 
  Type 'number' is not assignable to type 'RenderContent'.
15:07:37.493 
src/views/house/index.vue(122,57): error TS2345: Argument of type 'string | number' is not assignable to parameter of type 'string'.
15:07:37.493 
  Type 'number' is not assignable to type 'string'.
15:07:37.493 
src/views/house/index.vue(123,49): error TS2345: Argument of type 'string | number' is not assignable to parameter of type 'string'.
15:07:37.493 
  Type 'number' is not assignable to type 'string'.
15:07:37.563 
rendering chunks...
15:07:37.620 
ERROR: "type-check" exited with 2.
15:07:37.633 
Error: Command "npm run build" exited with 1
