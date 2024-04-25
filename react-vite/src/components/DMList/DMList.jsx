import { useState } from "react";
import { FaCaretDown } from 'react-icons/fa6'
import { NavLink } from "react-router-dom";

function DMList() {
    const [showDMs, setShowDMs] = useState(true);

    const dms = [1, 2, 3, 4, 5, 6];
    return (
        <div id="dm-list">
            <div className='list-controls no-select'>
                <FaCaretDown className={showDMs ? "caret" : "caret rotate"} onClick={() => setShowDMs(!showDMs)}/>
                <p>Direct Messages</p>
                <button className="options-control">...</button>
            </div>
            { showDMs && dms.map(dm => (
            <NavLink key={dm} to="/">Direct Message {dm}</NavLink>
            ))}
        </div>
    )
}

export default DMList;