import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { FaCaretDown } from 'react-icons/fa6'
import { NavLink } from "react-router-dom";
import { getAllUsersThunk } from "../../redux/users";
import './DMList.css';

function DMList() {
    const dispatch = useDispatch();
    const users = useSelector(state => state.users);
    const [showDMs, setShowDMs] = useState(true);

    useEffect(() => {
        dispatch(getAllUsersThunk());
    }, [dispatch]);

    if(!users.byId) return null;

    return (
        <div id="dm-list-wrapper">
            <div className='list-controls no-select'>
                <FaCaretDown className={showDMs ? "caret" : "caret rotate"} onClick={() => setShowDMs(!showDMs)}/>
                <p>Direct Messages</p>
                <button className="options-control" onClick={() => alert('Feature coming soon!')}>...</button>
            </div>
            <div id="dm-list" onClick={() => alert("Feature coming soon!")}>
                { showDMs && Object.entries(users.byId).map(([id, user]) => (
                    <NavLink key={id} to="/">{user.firstName} {user.lastName}</NavLink>
                ))}
            </div>
        </div>
    )
}

export default DMList;