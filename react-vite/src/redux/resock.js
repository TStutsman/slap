export function Resock(socket, name, dispatch) {
    const eventListeners = {};

    function createListener(event) {
        function listener(payload) {
            const actionCreator = (payload) => ({type: name + '/' + event, payload});
            return dispatch(actionCreator(payload));
        }
        // changes the name of the function from listener() to <event_name>()
        Object.defineProperty(listener, 'name', {value: event, writable: false});

        socket.on(event, listener);
        eventListeners[event] = listener;
    }


    return {
        addListeners:(events) => {
            for(let event of events) {
                createListener(event);
            }
        },

        removeListeners:() => {
            for(let event in eventListeners){
                const listener = eventListeners[event];
                socket.off(event, listener);
            }
        }
    }

}