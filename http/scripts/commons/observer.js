/**
 * Created by Serhii_Kotyk on 12/3/13.
 */
var Observer = function(){

    /**
     * Map of topics to their handlers.
     * Each topic has an array of handlers which are to be called
     * when publish on this topic is called
     *
     * @type {Object} {{topic: {String} -> handlers {Array}}}
     */
    var topicToHandlersMap = {};

    /**
     * Checks if topic is registered (topic map has such key)
     *
     * @param topicName name of topic
     * @returns {Boolean} true of topic is registered, false if not
     */
    function isTopicRegistered(topicName){
        return topicToHandlersMap[topicName] ? true : false;
    }

    /**
     * Gets array of all handlers registered for topic
     *
     * @param topicName name of topic
     * @returns {Array} array of handlers for topic
     */
    function getHandlersForTopic(topicName){
        if (isTopicRegistered(topicName)){
            return topicToHandlersMap[topicName];
        }
    }

    /**
     * Checks if topic has at least one handler.
     *
     * @param topicName name of topic
     * @returns {Boolean} true if topic has at least one handler
     */
    function isTopicEmpty(topicName){
        if (getHandlersForTopic(topicName) &&
            getHandlersForTopic(topicName).length &&
            getHandlersForTopic(topicName).length === 0){
            return true;
        }else{
            return false;
        }
    }

    /**
     * Removes topic from topic map.
     * if topic registered once more,
     * handlers will be empty array
     *
     * @param topicName name of topic
     */
    function closeTopic(topicName){
        if (isHandlerRegistered(topicName)){
            delete getHandlersForTopic(topicName);
        }
    }

    /**
     * Gets index of handler in handlers array for topic.
     *
     * @param topicName name of topic
     * @param handler handler
     * @returns {Number} index of handler in handlers array for topic
     */
    function getHandlerIndex(topicName, handler){
        if (!getHandlersForTopic(topicName)){
            return -1;
        }else{
            var handlersList = getHandlersForTopic(topicName),
                handlerIndex = handlersList.indexOf(handler);

            return handlerIndex;
        }
    }

    /**
     * Checks if handler was not yet registered for certain topic.
     *
     * @param {String} topicName name of topic
     * @param {Function} handler hanlder for topic
     * @returns {Boolean} true if handler was already registered
     */
    function isHandlerRegistered(topicName, handler){
        return getHandlerIndex(topicName, handler) != -1;
    }

    /**
     * Add handler to array of handlers.
     *
     * @param topicName {String} name of topic
     * @param handler {Function} function handler
     */
    function registerHandler(topicName, handler){
        if ('function' !== typeof handler){
            throw new Error("Can't register handler, require function");
        }

        if (!isHandlerRegistered(topicName, handler)){

            if (!getHandlersForTopic(topicName)){
                topicToHandlersMap[topicName] = new Array();
            }

            getHandlersForTopic(topicName).push(handler);
        }
    }

    /**
     * remove handler from handlers array for topic
     *
     * @param topicName name of topic
     * @param {Function} handler function handler
     */
    function unregisterHandler(topicName, handler){
        if ( topicName && !handler){

            closeTopic(topicName);

        }else{

            var handlerIndex = getHandlerIndex(topicName, handler);

            if (handlerIndex != -1) {
                handlersList.splice(handlerIndex, 1);
            }

            if (isTopicEmpty(topicName)){
                //delete topic and delete all handlers
                closeTopic(topicName);
            }
        }
    }

    /**
     * Add handler to handler array for topic name
     *
     * @param topicName name of topic
     * @param handler handler function
     * @returns {*}
     */
    function subscribe(topicName, handler){
        return registerHandler(topicName, handler);
    }

    /**
     * Remove handler from handlers array
     *
     * @param topicName
     * @param handler
     * @returns {*}
     */
    function unsubscribe(topicName, handler){
        return unregisterHandler(topicName, handler);
    }

    /**
     * send message to all handlers registered for topic
     *
     * @param topicName
     * @param data
     */
    function triggerHandlers(topicName, data){
        var handlers = getHandlersForTopic(topicName);
    }

    /**
     * send message to all handlers registered for topic
     *
     * @param {String} topicName
     * @param {Object} message
     */
    function publish(topicName, message){
        if (isTopicRegistered(topicName)
            && !isTopicEmpty(topicName)){

            var handlers = getHandlersForTopic(topicName);

            for(var i = 0; i < handlers.length; i++){
                var handler = handlers[i];
                handler(message);
            }
        }
    }

    this.publish = publish;
    this.subscribe = registerHandler;
    this.unsubscribe = unregisterHandler;
};