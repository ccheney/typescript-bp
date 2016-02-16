import Stage from '../vendor/structurejs/ts/display/Stage';

import ModalController from './controllers/ModalController';
import GenericModal from './views/modals/GenericModal';

/*

 ╔══════════════════════════════════════════════════════════════════════════════════════╗
 ║ Naming Convention                                                                    ║
 ╠══════════════════════════════════════════════════════════════════════════════════════╣
 ║ Anytime JavaScript interact with an element. Prepend the selector name with a 'js-'. ║
 ║ - Example: js-someButton                                                             ║
 ║                                                                                      ║
 ║ Name the selector the same name as the view.                                         ║
 ║ - Example: SomeView would have a selector named js-someView                          ║
 ╚══════════════════════════════════════════════════════════════════════════════════════╝

 ╔═══════════════════════════════════════════════════════════════════════════════════════════════╗
 ║ Architecture                                                                                  ║
 ╟───────────────────────────────────────────────────────────────────────────────────────────────╢
 ║ This application uses the StructureJS library.                                                ║
 ║ - https://github.com/codeBelt/StructureJS                                                     ║
 ║ - http://codebelt.github.io/StructureJS/docs/                                                 ║
 ╚═══════════════════════════════════════════════════════════════════════════════════════════════╝

 http://lorefnon.me/plain-text-table/
 */


/**
 * TODO: YUIDoc_comment
 *
 * @class App
 * @extends Stage
 * @constructor
 **/
class App extends Stage {

    constructor() {
        super();
    }

    /**
     * @overridden Stage.create
     */
    public create():void {
        super.create();

        ModalController.setView(this);

        const modalData = {
            title: 'Modal Title',
            body: 'Modal Content',
            rejectBtn: 'Cancel',
            acceptBtn: 'Accept'
        };

        const tempModal = new GenericModal('templates/precompile/modals/GenericModal', modalData);

        ModalController.addModal(tempModal);

    }

    /**
     * @overridden Stage.enable
     */
    public enable():void {
        if (this.isEnabled === true) { return; }

        super.enable();
    }

    /**
     * @overridden Stage.disable
     */
    public disable():void {
        if (this.isEnabled === false) { return; }

        super.disable();
    }

    /**
     * @overridden Stage.layout
     */
    public layout():void {
    }

}

export default App;
