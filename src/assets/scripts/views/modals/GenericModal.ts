import BaseModal from './BaseModal';

/**
 * TODO: YUIDoc_comment
 *
 * @class ModalController
 * @extends EventDispatcher
 * @constructor
 **/
class GenericModal extends BaseModal {

    constructor(template:string, data:any = {}) {
        super(template, data);

        this.modalData = data;
        this.allowPageScroll = (data.allowPageScroll === void 0) ? this.allowPageScroll : data.allowPageScroll;
    }

}

export default GenericModal;
