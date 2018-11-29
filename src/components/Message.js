import React from 'react';

const Message = ({ message, toggleSelect, toggleStar }) => {
    const read = message.read ? 'read' : 'unread'
    const selected = message.selected ? 'selected' : ''
    const star = message.starred ? 'fa-star' : 'fa-star-o'

    const labels = message.labels.map((label, i) => (
        <span key={i} className='label label-warning'>{label}</span>
    ))

    return (
        <div className={`row message ${read} ${selected}`}>
            <div className="col-xs-1">
                <div className="row">
                    <div className="col-xs-2">
                        <input
                            type="checkbox"
                            checked={!!message.selected}
                            onChange={() => toggleSelect(message)}
                        />
                    </div>
                    <div className="col-xs-2" onClick={() => toggleStar(message)}>
                        <i className={`star fa ${star}`}></i>
                    </div>
                </div>
            </div>
            <div className="col-xs-11">
                {labels}
                {message.subject}
            </div>
        </div>
    )
}

export default Message