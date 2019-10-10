/**
 * createElement(tag,attrs,child1,child2)
 */
import Component from './component'
const React = {
    createElement,
    Component
}
function createElement(tag, attrs, ...childrens) {
    return {
        tag,
        attrs,
        childrens
    }
}
export default React
