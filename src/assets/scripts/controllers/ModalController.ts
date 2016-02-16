import EventDispatcher from '../../vendor/structurejs/ts/event/EventDispatcher';
import EventBroker from '../../vendor/structurejs/ts/event/EventBroker';
import DOMElement from '../../vendor/structurejs/ts/display/DOMElement';
import BaseModal from '../views/modals/BaseModal';
import GenericModal from '../views/modals/GenericModal';
import ModalEvent from '../events/ModalEvent';
import KeyCode from '../constants/KeyCode';

/**
 * A class to manage the modals in the application.
 *
 * @class ModalController
 * @extends EventDispatcher
 * @constructor
 **/
class ModalController extends EventDispatcher {

    /**
     * Determines if a modal is up or not.
     *
     * @property isModalActive
     * @type {boolean}
     * @public
     */
    public isModalActive:boolean = false;

    /**
     * Holds a reference to a view that the modal will be added to.
     * The {{#crossLink "App"}}{{/crossLink}} $element is the HTML body element.
     *
     * @property _view
     * @type {DOMElement}
     * @protected
     */
    protected _view:DOMElement = null;

    /**
     * Holds a reference to the current modal being displayed.
     *
     * @property _currentModal
     * @type {BaseModal}
     * @protected
     */
    protected _currentModal:BaseModal = null;

    /**
     * TODO: YUIDoc_comment
     *
     * @property _modalQueue
     * @type {Array<BaseModal>}
     * @protected
     */
    protected _modalQueue:Array<BaseModal> = [];

    constructor() {
        super();
    }

    /**
     * @overridden EventDispatcher.enable
     */
    public enable():void {
        if (this.isEnabled === true) { return; }

        this._view.$element.addEventListener('click', '.js-modalTrigger', this._onCreateModal, this);
        this._view.$element.addEventListener('keydown', this._onEscPress, this);

        EventBroker.addEventListener(ModalEvent.ADD, this._onAddModal, this);
        EventBroker.addEventListener(ModalEvent.REMOVE, this._onCloseModal, this);

        super.enable();
    }

    /**
     * @overridden EventDispatcher.disable
     */
    public disable():void {
        if (this.isEnabled === false) { return; }

        this._view.$element.removeEventListener('click', '.js-modalTrigger', this._onCreateModal, this);
        this._view.$element.removeEventListener('keydown', this._onEscPress, this);

        EventBroker.removeEventListener(ModalEvent.ADD, this._onAddModal, this);
        EventBroker.removeEventListener(ModalEvent.REMOVE, this._onCloseModal, this);

        super.disable();
    }

    //////////////////////////////////////////////////////////////////////////////////
    // HELPER METHODS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Allows a view to be set so this controller knows what view to add the modal to.
     * The view needs to be set before any other interaction with this controller.
     *
     * @method setView
     * @param view {App}
     * @public
     */
    public setView(view:DOMElement):void {
        if (this._view != null) {
            this.disable();
        }

        this._view = view;
        this.enable();
    }

    /**
     * Adds a modal to correct view. Also remove the current modal if one is active.
     *
     * @method addModal
     * @param modal {BaseModal}
     * @public
     */
    public addModal(modal:BaseModal):void {
        this._modalQueue.push(modal);

        if (this.isModalActive === false) {
            this._addModal();
        }
    }

    /**
     * Removes the current modal from the DOM.
     *
     * @method removeModal
     * @public
     */
    public removeModal():void {
        if (this._currentModal !== null) {
            this._view.removeChild(this._currentModal);

            this._currentModal = null;

            this.isModalActive = false;

            if (this._modalQueue.length > 0) {
                this._addModal();
            }
        }
    }

    /**
     * Helper method to add a model.
     *
     * @method _addModal
     * @protected
     */
    protected _addModal():void {
        this._currentModal = this._modalQueue.shift();

        this._view.addChildAt(this._currentModal, 0);

        this.isModalActive = true;
    }

    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * On the global dispatching of the ModalEvent.{{#crossLink "ModalEvent/REMOVE:event"}}{{/crossLink}}
     * event this method will remove the modal from the display view.
     *
     * @method _onAddModal
     * @param event {ModalEvent}
     * @protected
     */
    protected _onAddModal(event:ModalEvent):void {
        this.addModal(event.data);
    }

    /**
     * On the global dispatching of the ModalEvent.{{#crossLink "ModalEvent/REMOVE:event"}}{{/crossLink}}
     * event this method will remove the modal from the display view.
     *
     * @method _onCloseModal
     * @param event {ModalEvent}
     * @protected
     */
    protected _onCloseModal(event:ModalEvent):void {
        this.removeModal();
    }

    /**
     * When the esc key is press it will close the modal unless the modal tells the controller not to
     * by the {{#crossLink "BaseModal/forceInteraction:property"}}{{/crossLink}} property.
     *
     * @method _onEscPress
     * @param event {JQueryEventObject}
     * @protected
     */
    protected _onEscPress(event:JQueryEventObject):void {
        if (this._currentModal != null) {
            if (event.keyCode === KeyCode.ESCAPE_KEY && this._currentModal.forceInteraction === false) {
                this.removeModal();
            }
        }
    }

    /**
     * When one of the '.js-modalTrigger' modal trigger buttons is clicked this method will get the template
     * and data from the button. It will create a GenericModal then pass it to the modal controller to display it.
     *
     * @method _onCreateModal
     * @param event {JQueryEventObject}
     * @protected
     */
    protected _onCreateModal(event:JQueryEventObject):void {
        const template:string = (<HTMLElement>event.currentTarget).getAttribute('data-modal-template');
        const data:string = (<HTMLElement>event.currentTarget).getAttribute('data-modal-data');
        const modal:BaseModal = new GenericModal(template, JSON.parse(data));

        this.addModal(modal);
    }
}

export default new ModalController();
