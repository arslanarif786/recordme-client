/**
 * Event bus to handle events in the whole application
 * It makes events independent of application and removes any dependency on other components
 *
 * listen Events with EventBus.$on('event-name', callback())
 * dispatch Events with EventBus.$emit('event-name', data)
 */
 import Vue from "vue";
 const EventBus = new Vue();
 export default EventBus;