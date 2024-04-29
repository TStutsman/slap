import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { FaCaretDown } from 'react-icons/fa6'
import { NavLink } from "react-router-dom";
import { getAllUsersThunk } from "../../redux/users";

function DMList() {
    const dispatch = useDispatch();
    const users = useSelector(state => state.users);
    const [showDMs, setShowDMs] = useState(true);

    useEffect(() => {
        dispatch(getAllUsersThunk());
    }, [dispatch]);

    if(!users.byId) return null;

    return (
        <div id="dm-list">
            <div className='list-controls no-select'>
                <FaCaretDown className={showDMs ? "caret" : "caret rotate"} onClick={() => setShowDMs(!showDMs)}/>
                <p>Direct Messages</p>
                <button className="options-control">...</button>
            </div>
            { showDMs && Object.entries(users.byId).map(([id, user]) => (
                <NavLink key={id} to="/">{user.firstName} {user.lastName}</NavLink>
            ))}
        </div>
    )
}

export default DMList;