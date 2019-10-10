export function diff(dom, vnode, container) {
    const ret = diffNode(dom, vnode)
    if (container) {
        container.appendChild(ret)
    }
    return ret
}
function diffNode(dom, vnode) {
    let out = dom
    if (vnode === undefined || vnode === null) return
    if (typeof vnode === 'number') vnode = String(vnode)
    //文本节点
    if (typeof vnode === 'string') {
        if (dom && dom.nodeType === 3) {
            if (dom.textContent !== vnode) {
                //更新文本内容
                dom.textContent = vnode
            }
        } else {
            out = document.createTextNode(vnode)
            if (dom && dom.parentNode) {
                dom.parentNode.replaceNode(out, dom)
            }
        }
        return out
    }
    //非文本DOM节点
    if (!dom) {
        out = document.createElement(vnode.tag)
    }
    //比较子节点
    if (vnode.childrens && vnode.childrens.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
        diffChildren(out, vnode.childrens)
    }
    diffAttribute(out, vnode)
    return out
}
function diffChildren(out, vchildren) {
    const domChildren = dom.childNodes
    const children = []
    const keyed = {}
    //将有key的节点（用对象保存）和没有key的节点(用数组保存)分开
    if (domChildren.length > 0) {
        [...domChildren].forEach(item => {
            const key = item.key
            if (key) {
                keyed[key] = item
            } else {
                children.push(item)
            }
        })
    }
    if (vchildren && vchildren.length > 0) {
        let min = 0
        let childrenLen = children.length
        [...vchildren].forEach((vchild, i) => {
            const key = vchild.key
            let child
            if (key) {
                if (keyed[key]) {
                    child = keyed[key]
                    keyed[key] = undefined
                } else if (childrenLen > min) {
                    for (let j = min; j < childrenLen; j++) {
                        let c = children[j]
                        if (c) {
                            child = c
                            children[j] = undefined
                            if (j === childrenLen - 1) childrenLen--;
                            if (j === min) min++
                            break;
                        }
                    }
                }
                child = diffNode(child, vchild)
                const f = domChildren[i]
                if (child && child !== dom && child !== f) {
                    if (!f) {
                        dom.appendChild(child)
                    } else if (child === f.nextSibling) {
                        removeNode(f)
                    } else {
                        dom.insertBefore(child, f)
                    }
                }
            }
        })
    }
}
function diffAttribute(dom, vnode) {
    //dom 是原有的节点对象  vnode虚拟dom
    const oldAttrs = {}
    const domAttrs = dom.attributes
    [...domAttrs].forEach(item => {
        oldAttrs[item.name] = item.value
    })
    for (let key in newAttrs) {
        if (!(key in oldAttrs)) {
            setAttribute(dom, key, undefined) // 设置属性
        }
    }
    //更新
    for (let key in newAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            setAttribute(dom, key, newAttrs[key])
        }
    }
}