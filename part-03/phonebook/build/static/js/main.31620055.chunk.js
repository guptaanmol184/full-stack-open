(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{40:function(e,n,t){},41:function(e,n,t){"use strict";t.r(n);var r=t(16),o=t.n(r),c=t(3),a=t(2),i=t.n(a),u=t(0),s=function(e){var n=e.nameFilter,t=e.setNameFilter;return Object(u.jsxs)("div",{children:["filter shown with:",Object(u.jsx)("input",{value:n,onChange:function(e){return t(e.target.value)}})]})},l=function(e){var n=e.notification,t=n.message,r=n.type;return null===t?null:"error"===r?Object(u.jsx)("div",{className:"error",children:t}):"info"===r?Object(u.jsx)("div",{className:"info",children:t}):void 0},d=t(4),f=t.n(d),j="/api/persons",b={getAllPersons:function(){return f.a.get(j).then((function(e){return e.data}))},createPerson:function(e){return f.a.post(j,e).then((function(e){return e.data}))},updatePerson:function(e,n){return f.a.put("".concat(j,"/").concat(e),n).then((function(e){return e.data}))},deletePerson:function(e){return f.a.delete("".concat(j,"/").concat(e)).then((function(e){return e.data}))}},m=function(e){var n=e.name,t=e.setName,r=e.number,o=e.setNumber,c=e.handleSubmit;return Object(u.jsxs)("form",{onSubmit:c,children:[Object(u.jsxs)("div",{children:["name:",Object(u.jsx)("input",{value:n,onChange:function(e){return t(e.target.value)}})]}),Object(u.jsxs)("div",{children:["number :",Object(u.jsx)("input",{value:r,onChange:function(e){return o(e.target.value)}})]}),Object(u.jsx)("div",{children:Object(u.jsx)("button",{type:"submit",children:"add"})})]})},h=function(e){var n=e.persons,t=e.onDeletePerson;return n.map((function(e){return Object(u.jsx)(i.a.Fragment,{children:Object(u.jsxs)("p",{children:[e.name," ",e.number," \xa0",Object(u.jsx)("button",{onClick:function(){return t(e)},children:"delete"})]})},e.id)}))},p=function(){var e=Object(a.useState)([]),n=Object(c.a)(e,2),t=n[0],r=n[1],o=Object(a.useState)(""),i=Object(c.a)(o,2),d=i[0],f=i[1],j=Object(a.useState)(""),p=Object(c.a)(j,2),O=p[0],v=p[1],x=Object(a.useState)(""),g=Object(c.a)(x,2),P=g[0],w=g[1],S=Object(a.useState)({message:null,type:null}),N=Object(c.a)(S,2),k=N[0],y=N[1],F=function(e,n){y({message:e,type:n}),setTimeout((function(){y({message:null,type:null})}),3e3)};Object(a.useEffect)((function(){b.getAllPersons().then((function(e){r(e)})).catch((function(e){console.log("Populating persons failed: ",e),F("Failed to retrieve people from server: ".concat(e.response.data.error),"error")}))}),[]);var C=t.filter((function(e){return e.name.toLowerCase().includes(P)}));return Object(u.jsxs)("div",{children:[Object(u.jsx)("h2",{children:"Phonebook"}),Object(u.jsx)(l,{notification:k}),Object(u.jsx)(s,{nameFilter:P,setNameFilter:w}),Object(u.jsx)("h2",{children:"Add a new"}),Object(u.jsx)(m,{name:d,setName:f,number:O,setNumber:v,handleSubmit:function(e){e.preventDefault();var n={name:d,number:O},o=t.find((function(e){return e.name===d}));void 0===o?b.createPerson(n).then((function(e){r(t.concat(e)),F("Added ".concat(e.name),"info")})).catch((function(e){console.log("Server returned error: ".concat(e)),console.log({error:e}),F(e.response.data.error,"error")})):window.confirm("".concat(d," is already added to phonebook, replace the old number with a new one ?"))&&b.updatePerson(o.id,n).then((function(e){r(t.map((function(n){return n.id===o.id?e:n}))),F("Updated ".concat(o.name),"info")})).catch((function(e){console.log("Server returned error: ".concat(e)),F("Server failed to update information for ".concat(o.name,". Error: ").concat(e.response.data.error,". Please refresh to proceed."),"error")}));f(""),v("")}}),Object(u.jsx)("h2",{children:"Numbers"}),Object(u.jsx)(h,{persons:C,onDeletePerson:function(e){window.confirm("Delete ".concat(e.name," ?"))&&b.deletePerson(e.id).then((function(){r(t.filter((function(n){return n.id!==e.id})))})).catch((function(n){console.log("Server returned error: ".concat(n)),F("Information for ".concat(e.name," has been removed from the server."),"error"),r(t.filter((function(n){return n.id!==e.id})))}))}})]})};t(40);o.a.render(Object(u.jsx)(p,{}),document.getElementById("root"))}},[[41,1,2]]]);
//# sourceMappingURL=main.31620055.chunk.js.map