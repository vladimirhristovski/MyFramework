import {DOM_TYPES} from './h'
import {setAttributes} from './attributes'
import {addEventListeners} from './events'

export function mountDOM(vdom, parentEl) {
    switch (vdom.type) {
        case DOM_TYPES.TEXT: {
            createTextNode(vdom, parentEl) // --1--
            break
        }

        case DOM_TYPES.ELEMENT: {
            createElementNode(vdom, parentEl) // --2--
            break
        }

        case DOM_TYPES.FRAGMENT: {
            createFragmentNodes(vdom, parentEl) // --3--
            break
        }

        default: {
            throw new Error(`Can't mount DOM of type: ${vdom.type}`)
        }
    }
}

function createTextNode(vdom, parentEl) {
    const {value} = vdom

    const textNode = document.createTextNode(value) //--1--
    vdom.el = textNode //--2--

    parentEl.append(textNode) //--3--
}

function createElementNode(vdom, parentEl) {
    const {tag, props, children} = vdom

    const element = document.createElement(tag) //--1--
    addProps(element, props, vdom) //--2--
    vdom.el = element

    children.forEach((child) => mountDOM(child, element))
    parentEl.append(element)
}

function addProps(el, props, vdom) {
    const {on: events, ...attrs} = props //--3--

    vdom.listeners = addEventListeners(events, el) //--4--
    setAttributes(el, attrs) //--5--
}

function createFragmentNodes(vdom, parentEl) {
    const {children} = vdom
    vdom.el = parentEl //--1--

    children.forEach((child) => mountDOM(child, parentEl)) //--2--
}