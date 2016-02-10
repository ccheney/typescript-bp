import BaseEvent from '../../vendor/structurejs/ts/event/BaseEvent';

/**
 * This event class is meant to manage all event types for all modals within the site.
 *
 * @class ModalEvent
 * @extends BaseEvent
 * @constructor
 **/
class ModalEvent extends BaseEvent {

    /**
     * Event to be dispatched when a modal needs to be added.
     *
     * @event ADD
     * @type {string}
     * @static
     */
    public static ADD:string = 'ModalEvent.add';

    /**
     * Event to be dispatched when a modal needs to be closed.
     *
     * @event REMOVE
     * @type {string}
     * @static
     */
    public static REMOVE:string = 'ModalEvent.remove';

    /**
     * Event to be dispatched when a button in the modal is clicked to cancel something.
     *
     * @event REJECT
     * @type {string}
     * @static
     */
    public static REJECT:string = 'ModalEvent.reject';

    /**
     * Event to be dispatched when a button in the modal is clicked to confirm something.
     *
     * @event ACCEPT
     * @type {string}
     * @static
     */
    public static ACCEPT:string = 'ModalEvent.accept';

    constructor(type:string, bubbles:boolean, cancelable:boolean, data:any) {
        super(type, bubbles, cancelable, data);
    }
}

export default ModalEvent;
