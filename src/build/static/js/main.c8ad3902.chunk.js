(this["webpackJsonputu-gecko-front"]=this["webpackJsonputu-gecko-front"]||[]).push([[0],{25:function(t,e,n){},26:function(t,e,n){},27:function(t,e,n){},37:function(t,e,n){},38:function(t,e,n){"use strict";n.r(e);var c=n(0),r=n.n(c),a=n(18),o=n.n(a),s=n(12),i=n(2),j=(n(25),n(20)),d=n(8),u=(n(26),n(27),n(1)),h=n(17);function b(t){return Object(u.jsxs)("tr",{className:"data-row",children:[Object(u.jsx)("td",{children:t.index}),t.order.map((function(e){return Object(u.jsxs)("td",{className:"Currency"===e?"name":"",children:["Price"===e||"Market Cap"===e?"$":"","number"===typeof t.data[e]?O(Math.round(100*t.data[e])/100):Object(u.jsx)(s.b,{to:"/coin/".concat(t.data[e],"/").concat(t.date),children:t.data[e]}),["24h","7d","30d","All"].includes(e)?"%":""]},h(5))}))]})}function l(t){return Object(u.jsxs)("table",{children:[Object(u.jsx)("thead",{children:Object(u.jsxs)("tr",{children:[Object(u.jsx)("th",{children:"#"}),t.order.map((function(e){return Object(u.jsx)("th",{className:"\n\t\t\t\t\t\t\t\t".concat("Currency"===e?"name-th":"number-th","\n\t\t\t\t\t\t\t\t").concat(e===t.prop?"current-th":"","\n\t\t\t\t\t\t\t\t"),onClick:function(){t.sortBy(e)},children:e},h(3))}))]})}),Object(u.jsx)("tbody",{children:t.data.map((function(e,n){return Object(u.jsx)(b,{data:e,date:t.date,order:t.order,index:n+1},e.Currency)}))})]})}function O(t){var e=t.toString().split(".");return e[0]=e[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),e.join(".")}var f=function(){var t=Object(c.useState)([]),e=Object(d.a)(t,2),n=e[0],r=e[1],a=Object(c.useState)(""),o=Object(d.a)(a,2),s=o[0],i=o[1],h=Object(c.useState)("Market Cap"),b=Object(d.a)(h,2),O=b[0],f=b[1],x=Object(c.useState)(!0),p=Object(d.a)(x,1)[0];return Object(c.useEffect)((function(){p&&fetch("/api/stats/").then((function(t){if(t.ok)return t.json();throw Error("Something went wrong")})).then((function(t){var e="Market Cap",n=t.stats.sort((function(t,n){return n[e]-t[e]}));r(n),i(t.date)})).catch((function(t){console.log(t)}))}),[p]),Object(u.jsxs)("div",{className:"app",children:[Object(u.jsx)("h1",{children:"CryptoCurrency Prices"}),Object(u.jsx)("h2",{children:""!==s?"Latest date: ".concat(s):"Loading..."}),Object(u.jsxs)("div",{className:"currency-table-wrapper",children:[Object(u.jsx)(l,{data:n,order:["Currency","Price","24h","7d","30d","Volume","Market Cap"],date:s,prop:O,sortBy:function(t){!function(t){if(t!==O){var e=n.sort((function(e,n){return n[t]-e[t]}));f(t),r(Object(j.a)(e))}}(t)}}),console.log("re-rendered")]})]})},x=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,39)).then((function(e){var n=e.getCLS,c=e.getFID,r=e.getFCP,a=e.getLCP,o=e.getTTFB;n(t),c(t),r(t),a(t),o(t)}))},p=(n(37),n(17));function m(){var t=Object(i.f)();return Object(u.jsx)("div",{children:Object(u.jsxs)("h3",{children:["No match for ",Object(u.jsx)("code",{children:t.pathname})]})})}o.a.render(Object(u.jsx)(r.a.StrictMode,{children:Object(u.jsx)(s.a,{children:Object(u.jsxs)(i.c,{children:[Object(u.jsx)(i.a,{path:"/",component:f,exact:!0}),Object(u.jsx)(i.a,{path:"/coin/:name/:date",component:function(){var t=Object(i.g)(),e=t.name,n=t.date,r=Object(c.useState)([]),a=Object(d.a)(r,2),o=a[0],s=a[1],j=["Date","Open","High","Close","Volume","Market Cap"];return Object(c.useEffect)((function(){fetch("/api/data/coin/".concat(e,"/").concat(n,"/31")).then((function(t){return t.json()})).then((function(t){s(t.data)}))}),[e,n]),Object(u.jsxs)("div",{children:[Object(u.jsxs)("h1",{children:["Latest stats for ",Object(u.jsx)("span",{style:{color:"goldenrod"},children:e})]}),Object(u.jsx)("div",{className:"table-wrapper",children:Object(u.jsxs)("table",{children:[Object(u.jsx)("thead",{children:Object(u.jsx)("tr",{children:j.map((function(t){return Object(u.jsx)("th",{children:t},p(5))}))})}),Object(u.jsx)("tbody",{children:o.map((function(t){return Object(u.jsx)("tr",{children:j.map((function(e){return Object(u.jsx)("td",{children:t[e]},p(5))}))},p(5))}))})]})}),Object(u.jsx)("ul",{})]})},exact:!0}),Object(u.jsx)(i.a,{path:"/api/"}),Object(u.jsx)(i.a,{path:"*",children:Object(u.jsx)(m,{})})]})})}),document.getElementById("root")),x()}},[[38,1,2]]]);
//# sourceMappingURL=main.c8ad3902.chunk.js.map