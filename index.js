import React from './react'
import ReactDom from './react-dom'
// const ele = (
//     <div className='active' title='123'>
//         hello,<span>react</span>
//     </div>
// )
function Home() {
    return (
        <div className='active' title='123'>
            hello,<span>react</span>
        </div>
    )
}
ReactDom.render(ele, document.querySelector('#root'))