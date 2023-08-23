import Vue from "vue";
import moment from 'moment'

var filter = function (text, length, clamp) {
  clamp = clamp || "...";
  var node = document.createElement("div");
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length ? content.slice(0, length) + clamp : content;
};
Vue.filter("truncate", filter);
Vue.filter("formatDate", function (value) {
  if (!value) return "N/A";
  return moment(value).format("DD MMM YYYY");
});
Vue.filter("formatTime", function (value) {
  if (!value) return "N/A";
  return moment(value).format("hh:mm A");
});
Vue.filter("msgDate", function (value) {
  if (!value) return "";
  return moment(value).format("DD/MM/YYYY hh:mm:ss");
});


