import Component from '../react/component'
const ReactDom = {
    render
}
function render(vnode, container) {
    return container.appendChild(_render(vnode))
}
function createComponent(comp, props) {
    let inst
    if (comp.prototype && comp.prototype.render) {
        //如果是类组件 则创建实例
        inst = new comp(props)
    } else {
        //如果是函数组件 将函数组件扩展成类组件
        inst = new Component(props)
        inst.constructor = comp
        inst.render = function () {
            return this.constructor(props)
        }
    }
    return inst
    //如果是函数组件
}
function renderComponent(comp) {
    const renderer = comp.render()
    _render(renderer)
}
function setComponentProps(comp, attrs) {
    if (!comp.base) {
        if (comp.componentWillMount) comp.componentWillMount()
        else if (comp.componentWillReceiveProps) componentWillReceiveProps()
    }
    //设置组件的属性
    comp.props = props
    //渲染组件
    let base = renderComponent(comp)
    comp.base = base
}
function _render(vnode) {
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
        return
    }
    if (typeof vnode === 'string') {
        //创建文本节点
        return document.createTextNode(vnode)
    }
    //如果tag是函数
    if (typeof vnode.tag === 'function') {
        //1创建组件
        const comp = createComponent(vnode.tag, vnode.attrs)
        //2 设置组件的属性
        setComponentProps(comp, vnode.attrs)
        ///3 组件渲染的节点对象返回
        if (comp.base && comp.componentWillUpdate) comp.componentWillUpdate()
        if (comp.base) {
            if (comp.componentDidUpdate) componentDidUpdate()
        } else if (comp.componentDidMount) {
            comp.componentDidMount()
        }
        return comp.base
    }
    //虚拟dom
    const { tag, attrs, childrens } = vnode
    const dom = document.createElement(tag)
    if (attrs) {
        //遍历
        Object.keys(attrs).forEach(key => {
            const value = attrs[key]
            setAttribute(dom, key, value)
        })
    }
    //遍历子节点
    childrens.forEach(child => {
        render(child, dom)
    })
    return dom
}
//设置属性
function setAttribute(dom, key, value) {
    //将className转换成class
    if (key === 'className') {
        key = 'class'
    }
    //如果是事件 onClick onBlur...
    if (/on\w+/.test(key)) {
        key = key.toLowerCase()
        dom[key] = value || ''
    } else if (key === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value
        } else if (value && typeof value === 'object') {
            //{width:20}
            for (let k in value) {
                if (typeof value[k] === 'number') {
                    dom.style[key] = value[k] + 'px'
                } else {
                    dom.style[key] = value[k]
                }
            }
        }
    }
    else {
        //其他属性
        if (key in dom) {
            dom[key] = value || ''
        }
        if (value) {
            dom.setAttribute(key, value)
        } else {
            dom.removeAttribute(key)
        }
    }
}
export default ReactDom