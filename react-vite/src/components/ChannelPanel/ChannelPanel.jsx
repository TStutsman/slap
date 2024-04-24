import './ChannelPanel.css'

function ChannelPanel() {
    const messages = [1, 2, 3, 4, 5]
    return (
        <div id="channel-panel">
            <div id='channel-details'>
                <h3>Channel Name</h3>
                <p>369 members</p>
            </div>
            <div id='message-feed'>
                { messages.map(message => (
                    <p key={message}>Message {message}</p>
                ))}
            </div>
        </div>
    )
}

export default ChannelPanel;