import React from 'react'

const Labels = ({ labels }) => {
    return labels.map((label, idx) => <span key={idx} className="label label-warning" >{label}</span>)
}

export default Labels