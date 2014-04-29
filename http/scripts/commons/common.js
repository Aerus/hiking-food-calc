/**
 * Created by Serhii_Kotyk on 11/25/13.
 */
var EVENT_PREFIX = 'e_';

/**
 * Builds HTML node by a tag name and with certain attributes
 *
 * @param tag tag name
 * @param attributes attributes as a Map
 * @returns {null} if no tag handled
 */
function buildElement(tag, attributes){
    if (!tag){
        throw new DOMException("Can't create element " + tag);
    }

    switch(typeof(tag)){
        case 'string':
            return buildByTag(tag, attributes);
            break;
        case 'object':
            return buildComplexElement(tag);
            break;
        default:
            throw new DOMException("Can't create element " + tag);
    }

    function buildByTag(tag, attributes){
        if (attributes){
            var atTag = attributes['_tag'];
            if(!atTag){
                attributes['_tag'] = tag;
            }

            return buildComplexElement(attributes);
        }else{
            return document.createElement(tag);
        }
    }
}

/**
 * Builds a DOM element attribute by attribute.
 * Tag of element is handled as a '_tag' property of attributes object
 *
 * @param {Object} attributes
 * @returns {Element} DOM element
 */
function buildComplexElement(attributes){
    if (attributes instanceof Array){//if array

        var templatesArray = attributes,
            children = new Array();

        for(var i = 0; i < templatesArray.length; i++){
            children.push(buildElement(templatesArray[i]));
        }

        if (children.length > 0){
            var containerDiv = buildElement('div');
            for(var i = 0; i < children.length; i++){
                containerDiv.appendChild(children[i]);
            }
            return containerDiv;
        }

    }else if(attributes != undefined && attributes != null){//if object

        var tag = attributes['_tag'];

        //if tag is null or not a string
        if (!tag || typeof (tag) !== 'string'){
            throw new Error("Can't build element with tag name " + tag);
        }

        var element = document.createElement(tag);


        if (attributes)
        //for each attribute assign it to element
            for(var key in attributes){
                var attributeName = key,
                    attributeValue = attributes[key];

                if (attributeName.indexOf(EVENT_PREFIX) === 0 //starts with "e_"
                    && typeof(attributeValue) === 'function'){ //and value is function
                    var realAttribute = attributeName.replace(EVENT_PREFIX, '');
                    element[realAttribute] = attributeValue;
                }else if (attributeValue instanceof Node){
                    element.appendChild(attributeValue);
                }else if(attributeName === '_tag'){
                    if (tag !== attributeValue){
                        return buildElement(attributeValue, attributes);
                    }else{
                        continue;
                    }
                }else if (attributeName === 'innerText'){
                    element.appendChild(document.createTextNode(attributeValue));
                }else if(typeof attributeValue === 'object'){
                    element.appendChild(buildElement(attributeValue));
                }else{
                    element.setAttribute(attributeName, attributeValue);
                }
            }

        return element;
    }
}

/**
 * Returns freezed value getter of variable, like iterator in a loop
 * @param value
 */
function FixedValueGetter(value){
    return function(){return value};
}

/**
 * Clones object
 * @param obj object to clone
 * @return {Object} object clone
 */
function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

/**
 * Instantiate new object with parameters
 * @param cosntr
 * @param args
 * @returns {Constr} instanceof constructor
 */
function applyConstruct(cosntr, args, context){
    function F() {
        return cosntr.apply(context || this, args);
    }
    F.prototype = cosntr.prototype;
    return new F();
}

/**
 *
 * Creates a function in global scope which when called
 * creates object
 * if parent is defined
 *          as a new instance of parent
 * else
 *          as empty object
 * then creates a new object using
 * constructor method and copies references to properties of that new object
 * as properties of new previously created object.
 *
 * As a result a new object is created with copies of properties and functions
 * of parent object if it exists and copies of properties and functions
 * of object created by a constructor = truly merged-by-override object
 *
 * The gotten function can be called as a cosntructor of an object e.g.
 *
 * EXAMPLE:
 *
 *      Class('A', function(){this.name = 'John'})
 *
 *      new A() -> {name: 'John'}
 *
 *      Class('B', function(this.surname = 'Doe'), 'A')
 *
 *      new B() -> {name: 'John', surname: 'Doe'}
 *
 *
 *  Each time you use new ClassName() it is guaranteed that you
 *  will recieve a completely new Object with no scope conflicts
 *
 *
 * @param {String} name class name
 * @param {Function} construct cunstructor of a class
 * @param {String/Function} parent parent of class (BETTER FUNCTION)
 * @constructor
 */
function Class(name, construct, parent){
    if ('string' === typeof(name)
        && 'function' === typeof(construct)){

        if ('string' === typeof parent){
            parent = Class.getByName(parent);
        }

        //now parent is a function

        Class[name] = function(){
            var parentInstance = null;

            //instantiate object as a parent
            if (parent){
                parentInstance = applyConstruct(parent, arguments);
            }

            //override all parent fields with child fields
            var extender = applyConstruct(construct, arguments, parentInstance);

            if (parentInstance){
                for(var key in parentInstance){
                    this[key] = parentInstance[key];
                }
                this.super = parentInstance;
            }

            for(var key in extender){
                this[key] = extender[key];
            }

        };

        //if parent is defined
        if('function' === typeof parent){
            Class[name].prototype = new parent();
        }

        Class.namespace.set(name, Class[name]);
        return Class[name];
    }else if('string' === typeof name){
        return Class.getByName(name);
    } else{
        throw new Error("Class should have name and cosntructor. " + JSON.stringify({
            name: name,
            constructor: construct,
            parent: parent
        }));
    }
}

/**
 * Creates an object hirearchy by following namespace
 * @param {String/Array} package
 */
Class.namespace = function (package, context){
    context = context || window;

    var parts = package instanceof Array ? package : package.split('.');
    if (parts instanceof Array
        && parts.length > 0){
        if (!context[parts[0]]){
            context[parts[0]] = {};
        }

        if (parts.length == 1){
            return context[parts[0]];
        } else if(parts.length > 1){
            return Class.namespace(parts, context[parts.splice(0, 1)]);
        }
    }

    return context;
};

/**
 * returns last part of namespace
 * @param {String/Array} package
 * @returns {String} namespace part
 */
Class.namespace.lastName = function (package){
    var parts = package instanceof Array ? package : package.split('.');
    if (parts instanceof Array
        && parts.length > 0){
        return parts[parts.length - 1];
    }else{
        return package;
    }
};

/**
 * returns namespace but for last part of namespace
 * @param {String/Array} package
 * @returns {Object} namespace part but for the last one
 */
Class.namespace.lastButOne = function (package){
    var parts = package instanceof Array ? package : package.split('.');
    if (parts instanceof Array
        && parts.length > 0){
        Class.namespace(package);
        parts.splice(parts.length - 1, 1);
        return Class.namespace(parts);
    }else{
        return window;
    }
};

/**
 * Sets value of object by namespace
 * @param namespace string or array namespace
 * @param value object or function
 */
Class.namespace.set = function(namespace, value){
    Class.namespace.lastButOne(namespace)[Class.namespace.lastName(namespace)] = value;
};

Class.getByName = function(name){
    return Class[name] || window[name];
};

/**
 *
 * @param name Class name
 * @param constr constructor
 * @param parent parent class
 * @constructor
 */
Class.Singleton = function(name, constr, parent){
    var singleTonConstructor = Class(name, constr, parent);
    Class.namespace.set(name, new singleTonConstructor());
};

Function.setFunction = function(name, functionBody){
    eval.call(this, 'var ' + name + ' = ' + functionBody);
};

Function.getByName = function(name){
    return eval(name);
};

Node.prototype.isClass = function(className){
    if ( typeof(className) === 'string' ){
        var index = this.className.indexOf(className);
        if ( index == 0 ){
            if (this.className === className){
                return true;
            }else if (this.className.length > className.length){
                return this.className[className.length] === ' ';
            }else{
                return false;
            }
        }else if ( index > 0 ){
            if ( index + className.length == this.className.length
                && this.className[index - 1] === ' '){ // in the end
                 return true;
            } else if ( index + className.length < this.className.length
                && this.className[index - 1] === ' '
                && this.className[index + className.length] === ' '){//in the middle
                return true;
            } else{
                return false;
            }
        }else if ( index == -1){
            return false;
        }
    }else{
        return false;
    }
};

Node.prototype.addClass = function(className){
   if ( typeof(className) === 'string' ){
       if ( !this.isClass(className) ){
           if ( this.className.length == 0 ){
               this.className = className;
           }else{
               this.className += ' ' + className;
           }
       }
   }
};

Node.prototype.removeClass = function(className){
    if ( typeof(className) === 'string' ){
        if ( this.className.length > 0 ){
            this.className = this.className.replace(className, '').replace('  ', ' ');
        }
    }
};

Node.prototype.toggleClass = function(className){
    if ( typeof(className) === 'string' ){
        if (this.isClass(className)){
            this.removeClass(className);
        }else{
            this.addClass(className);
        }
    }
};

Node.prototype.insertAfter = function (referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

/**
 * returns uniq id
 */
function uniqId(){
    uniqId.counter = uniqId.counter || 0;
    uniqId.prefix = uniqId.prefix || "uid";

    return uniqId.prefix + uniqId.counter++;
}

String.prototype.endsWith = function(substring){
    return this.lastIndexOf(substring) == this.length - substring.length;
};