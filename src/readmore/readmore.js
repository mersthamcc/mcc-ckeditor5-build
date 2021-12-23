import {toWidget} from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import readMoreIcon from './readmore.svg';
import './theme.css';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ReadMoreCommand from "./readmorecommand";

export default class ReadMore extends Plugin {

    static get requires() {
        return [ Widget ];
    }

    init() {
        const editor = this.editor;
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('readMore', new ReadMoreCommand(this.editor));

        editor.ui.componentFactory.add('readMore', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Read more...',
                icon: readMoreIcon,
                tooltip: true
            });
            const command = editor.commands.get('readMore');

            view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );
            this.listenTo(view, 'execute', () => editor.execute('readMore'));

            return view;
        });
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('anchor', {
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributesOf: '$text',
            allowAttributes: ['name']
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToElement( {
            view: {
                name: 'a',
                id: 'readmore',
            },
            model: ( viewElement, { writer: modelWriter } ) => {
                const name = viewElement.getAttribute("name");

                return modelWriter.createElement( 'anchor', { name } );
            }
        } );

        conversion.for('editingDowncast').elementToElement( {
            model: 'anchor',
            view: (modelItem, { writer: viewWriter }) => {
                const widgetElement = createAnchorView(modelItem, viewWriter);
                return toWidget(widgetElement, viewWriter);
            }
        } );

        conversion.for('dataDowncast').elementToElement( {
            model: 'anchor',
            view: (modelItem, { writer: viewWriter }) => createAnchorView(modelItem, viewWriter)
        } );
    }
}

function createAnchorView(modelItem, viewWriter) {
    const name = modelItem.getAttribute('name');

    return viewWriter.createContainerElement('a', {
        class: 'anchor',
        name: name,
        id: name
    }, {
        isAllowedInsideAttributeElement: true
    });
}
